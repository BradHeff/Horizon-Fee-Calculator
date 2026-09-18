// Explicit local-only preview while the production database is being provisioned.
const fs = require("node:fs");
const path = require("node:path");
const { createApp } = require("./app.cjs");
const directory = path.join(__dirname, "private");
const auth = JSON.parse(
	fs.readFileSync(path.join(directory, "auth.json"), "utf8"),
);
const app = createApp({
	directory,
	auth,
	origins: ["http://127.0.0.1:3000", "http://localhost:3000"],
	secure: false,
});
app.listen(3001, "127.0.0.1", () =>
	console.log(
		"Local preview API on 3001 (JSON storage; MongoDB provisioning pending).",
	),
);
