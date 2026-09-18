const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { promisify } = require("node:util");
const { createStore } = require("./fees.cjs");
const scrypt = promisify(crypto.scrypt);

function createApp({
	directory,
	store: providedStore,
	auth,
	origins,
	secure = false,
	buildDirectory = path.resolve(__dirname, "../build"),
}) {
	const store = providedStore || createStore(directory);
	const sessions = new Map();
	const attempts = new Map();
	const cookieName = secure ? "__Host-horizon-admin" : "horizon-admin";
	const cookie = (token, age = 28800) =>
		`${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${secure ? "; Secure" : ""}`;
	const json = (res, status, data) => {
		res.writeHead(status, {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
			"X-Content-Type-Options": "nosniff",
		});
		res.end(JSON.stringify(data));
	};
	const publicView = async () => (await store.view()).live;
	return http.createServer(async (req, res) => {
		res.setHeader("X-Content-Type-Options", "nosniff");
		res.setHeader("X-Frame-Options", "DENY");
		res.setHeader("Referrer-Policy", "same-origin");
		const url = new URL(req.url, "http://localhost");
		if (url.pathname !== "/api/fees") {
			if (url.pathname.startsWith("/api/"))
				return json(res, 404, { error: "Not found." });
			if (req.method !== "GET" && req.method !== "HEAD")
				return json(res, 405, { error: "Method not allowed." });
			const routes = ["/", "/admin"];
			const relative = routes.includes(url.pathname)
				? "index.html"
				: url.pathname.slice(1);
			const file = path.resolve(buildDirectory, relative);
			if (
				!file.startsWith(buildDirectory + path.sep) ||
				relative.split("/").some((part) => part.startsWith(".")) ||
				!fs.existsSync(file) ||
				!fs.statSync(file).isFile()
			)
				return json(res, 404, { error: "Not found." });
			const types = {
				".html": "text/html",
				".js": "text/javascript",
				".css": "text/css",
				".json": "application/json",
				".png": "image/png",
				".svg": "image/svg+xml",
				".ico": "image/x-icon",
				".txt": "text/plain",
				".woff2": "font/woff2",
			};
			res.setHeader(
				"Content-Type",
				types[path.extname(file)] || "application/octet-stream",
			);
			if (relative === "index.html") res.setHeader("Cache-Control", "no-cache");
			return req.method === "HEAD"
				? res.end()
				: fs.createReadStream(file).pipe(res);
		}
		try {
			const now = Date.now();
			for (const [key, value] of sessions)
				if (value.expires <= now) sessions.delete(key);
			for (const [key, value] of attempts)
				if (value.until <= now) attempts.delete(key);
			const token = (req.headers.cookie || "")
				.split(";")
				.map((part) => part.trim())
				.find((part) => part.startsWith(cookieName + "="))
				?.slice(cookieName.length + 1);
			const session = sessions.get(token);
			const action = url.searchParams.get("action");
			if (req.method === "GET") {
				if (action === "live")
					return json(res, 200, { config: await publicView() });
				if (action === "session")
					return json(res, 200, {
						authenticated: Boolean(session),
						...(session ? { csrfToken: session.csrf } : {}),
					});
				if (action === "admin")
					return session
						? json(res, 200, await store.view())
						: json(res, 401, { error: "Please sign in to manage fees." });
				return json(res, 404, { error: "Not found." });
			}
			if (req.method !== "POST")
				return json(res, 405, { error: "Method not allowed." });
			if (!origins.includes(req.headers.origin))
				return json(res, 403, { error: "Request origin is not allowed." });
			if (!(req.headers["content-type"] || "").startsWith("application/json"))
				return json(res, 415, { error: "JSON requests required." });
			if (!["login", "logout", "save", "publish"].includes(action))
				return json(res, 404, { error: "Not found." });
			if (action !== "login" && !session)
				return json(res, 401, {
					error: "Your session expired. Please sign in again.",
				});
			if (action !== "login" && req.headers["x-csrf-token"] !== session.csrf)
				return json(res, 403, {
					error: "Session verification failed. Reload the page and try again.",
				});
			let body = "";
			for await (const chunk of req) {
				body += chunk;
				if (Buffer.byteLength(body) > 64000)
					return json(res, 413, { error: "Request too large." });
			}
			let input;
			try {
				input = JSON.parse(body);
			} catch {
				return json(res, 400, { error: "Invalid JSON." });
			}
			if (action === "login") {
				const ip = req.socket.remoteAddress;
				const count = attempts.get(ip) || {
					count: 0,
					until: now + 15 * 60 * 1000,
				};
				if (count.count >= 10)
					return json(res, 429, {
						error: "Too many sign-in attempts. Please try again in 15 minutes.",
					});
				count.count++;
				attempts.set(ip, count);
				if (typeof input?.password !== "string" || input.password.length > 256)
					return json(res, 401, { error: "Incorrect username or password." });
				const account = typeof auth === "function" ? await auth() : auth;
				if (!account)
					return json(res, 503, { error: "Admin account is not configured." });
				const hash = await scrypt(input.password, account.salt, 64);
				if (
					!crypto.timingSafeEqual(hash, Buffer.from(account.hash, "hex")) ||
					input.username !== account.username
				)
					return json(res, 401, { error: "Incorrect username or password." });
				attempts.delete(ip);
				const newToken = crypto.randomBytes(32).toString("hex");
				const csrf = crypto.randomBytes(32).toString("hex");
				if (token) sessions.delete(token);
				sessions.set(newToken, { csrf, expires: now + 8 * 60 * 60 * 1000 });
				res.setHeader("Set-Cookie", cookie(newToken));
				return json(res, 200, { authenticated: true, csrfToken: csrf });
			}
			if (action === "logout") {
				sessions.delete(token);
				res.setHeader("Set-Cookie", cookie("", 0));
				return json(res, 200, { authenticated: false });
			}
			return json(res, 200, await store.change(action, input));
		} catch (error) {
			if (!error.status) console.error("Fee API error:", error.message);
			return json(res, error.status || 500, {
				error: error.status
					? error.message
					: "Unable to save or load fees. Please try again.",
			});
		}
	});
}
module.exports = { createApp };
