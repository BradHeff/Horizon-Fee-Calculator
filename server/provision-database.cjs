// Run once with an authorised MongoDB administrator URI on stdin.
// Creates only the dedicated fee database/user; never reuses another app's account.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { MongoClient } = require("mongodb");
const { createMongoStore } = require("./mongo.cjs");
let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
	input += chunk;
});
process.stdin.on("end", async () => {
	let admin, app;
	try {
		const directory = path.resolve(__dirname, "private");
		const file = path.join(directory, "connection.json");
		if (fs.existsSync(file))
			throw new Error(
				"A private app connection already exists; no changes made.",
			);
		const uri = input.trim();
		const parsed = new URL(uri);
		const caFile = path.resolve(
			process.env.MONGODB_TLS_CA_FILE || path.join(directory, "mongodb-ca.crt"),
		);
		admin = new MongoClient(uri, {
			tls: true,
			tlsCAFile: caFile,
			serverSelectionTimeoutMS: 10000,
		});
		await admin.connect();
		const name = "horizon_fee_calculator";
		const database = admin.db(name);
		if (
			(await database.listCollections({}, { nameOnly: true }).toArray()).length
		)
			throw new Error(
				"The fee database already contains collections; no changes made.",
			);
		if ((await database.command({ usersInfo: "horizon_fee_app" })).users.length)
			throw new Error("The fee database user already exists; no changes made.");
		const password = crypto.randomBytes(32).toString("hex");
		const appUri = `mongodb://horizon_fee_app:${password}@${parsed.host}/${name}?authSource=${name}&directConnection=true`;
		fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
		// Persist the generated connection before provisioning to retain recovery details.
		fs.writeFileSync(
			file,
			JSON.stringify({ uri: appUri, database: name, caFile }, null, 2),
			{ mode: 0o600, flag: "wx" },
		);
		await database.command({
			createUser: "horizon_fee_app",
			pwd: password,
			roles: [{ role: "readWrite", db: name }],
		});
		app = new MongoClient(appUri, {
			tls: true,
			tlsCAFile: caFile,
			serverSelectionTimeoutMS: 10000,
		});
		await app.connect();
		await createMongoStore(app.db(name));
		console.log(
			"Dedicated fee database and restricted application user created. Connection saved privately. Run admin:setup to create the panel account.",
		);
	} catch (error) {
		console.error(
			"Provisioning did not complete:",
			error.codeName || error.message,
		);
		process.exitCode = 1;
	} finally {
		if (app) await app.close();
		if (admin) await admin.close();
	}
});
