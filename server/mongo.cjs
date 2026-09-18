const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { MongoClient } = require("mongodb");
const { draftView, changeDraft } = require("./fees.cjs");
const seed = require("../src/data/fee-config.json");

async function connectDatabase() {
	const file = path.resolve(
		process.env.FEE_CONNECTION_FILE ||
			path.join(__dirname, "private", "connection.json"),
	);
	const settings = fs.existsSync(file)
		? JSON.parse(fs.readFileSync(file, "utf8"))
		: {};
	const uri = process.env.MONGODB_URI || settings.uri;
	const ca = process.env.MONGODB_TLS_CA_FILE || settings.caFile;
	const database =
		process.env.MONGODB_DATABASE ||
		settings.database ||
		"horizon_fee_calculator";
	if (!uri || !ca)
		throw new Error(
			"Configure MONGODB_URI and MONGODB_TLS_CA_FILE, or a private connection.json.",
		);
	const client = new MongoClient(uri, {
		tls: true,
		tlsCAFile: path.resolve(ca),
		serverSelectionTimeoutMS: 10000,
		maxPoolSize: 10,
	});
	await client.connect();
	const db = client.db(database);
	await db.command({ ping: 1 });
	return { client, db };
}
async function createMongoStore(db, collectionName = "fee_schedules") {
	const collection = db.collection(collectionName);
	await collection.updateOne(
		{ _id: "current" },
		{
			$setOnInsert: {
				live: seed,
				draft: seed,
				revision: crypto.randomUUID(),
				history: [],
			},
		},
		{ upsert: true },
	);
	const read = async () => {
		const state = await collection.findOne({ _id: "current" });
		if (!state) throw new Error("Fee schedule is missing.");
		return state;
	};
	const view = async (id) => draftView(await read(), id);
	async function change(action, input) {
		const state = await read();
		const conflict = () =>
			Object.assign(
				new Error(
					"Another administrator changed this draft. Reload the page before editing again.",
				),
				{ status: 409 },
			);
		if (
			typeof input?.revision !== "string" ||
			input.revision !== state.revision
		)
			throw conflict();
		const id = changeDraft(state, action, input);
		const oldRevision = state.revision;
		state.revision = crypto.randomUUID();
		// One atomic compare-and-swap also works on a standalone MongoDB server.
		const result = await collection.replaceOne(
			{ _id: "current", revision: oldRevision },
			state,
		);
		if (result.matchedCount !== 1) throw conflict();
		return draftView(state, id);
	}
	return { read, view, change };
}
module.exports = { connectDatabase, createMongoStore };
