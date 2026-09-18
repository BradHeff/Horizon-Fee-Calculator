const { test } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { connectDatabase, createMongoStore } = require("./mongo.cjs");
const configured = Boolean(
	process.env.MONGODB_URI ||
		fs.existsSync(path.join(__dirname, "private", "connection.json")),
);

test(
	"MongoDB persistence and concurrent revision protection",
	{ skip: !configured },
	async (t) => {
		const { client, db } = await connectDatabase();
		const collectionName = `test_fees_${crypto.randomBytes(12).toString("hex")}`;
		t.after(async () => {
			await db
				.collection(collectionName)
				.drop()
				.catch((error) => {
					if (error.codeName !== "NamespaceNotFound") throw error;
				});
			await client.close();
		});
		const store = await createMongoStore(db, collectionName);
		const original = await store.view();
		const config = structuredClone(original.draft);
		config.settings.academicYear = "2027";
		config.feeStructure.tuition.clare.standard.foundation[0] = 2000;
		const results = await Promise.allSettled([
			store.change("save", { config, revision: original.revision }),
			store.change("save", { config, revision: original.revision }),
		]);
		assert.equal(
			results.filter((result) => result.status === "fulfilled").length,
			1,
		);
		assert.equal(
			results.find((result) => result.status === "rejected").reason.status,
			409,
		);
		const reconnected = await createMongoStore(db, collectionName);
		const saved = await reconnected.view();
		assert.equal(saved.live.settings.academicYear, "2026");
		assert.equal(
			saved.draft.feeStructure.tuition.clare.standard.foundation[0],
			2000,
		);
		const reset = await store.change("save", { config: saved.live, revision: saved.revision });
		const afterReset = await reconnected.view();
		assert.deepEqual(afterReset.draft.feeStructure, original.live.feeStructure);
		assert.equal(afterReset.draft.settings.academicYear, "2026");
		assert.deepEqual(afterReset.live, original.live);
		assert.equal((await store.read()).history.length, 0);
		await assert.rejects(store.change("save", { config: saved.live, revision: saved.revision }), { status: 409 });
		const resaved = await store.change("save", { config, revision: reset.revision });
		await store.change("publish", { revision: resaved.revision });
		assert.equal((await store.view()).live.settings.academicYear, "2027");
		assert.equal((await store.read()).history.length, 1);
	},
);
