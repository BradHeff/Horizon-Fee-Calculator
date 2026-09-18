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
        const beforeCreate = await store.view();
        const second = await store.change("create", {revision:beforeCreate.revision, name:"2028 fees", config:{...config,settings:{...config.settings,academicYear:"2028"}}});
        assert.equal(second.drafts.length, 2);
        assert.equal(second.draft.settings.academicYear, "2028");
        assert.equal((await store.view("original")).draft.settings.academicYear, "2027");
        assert.equal(second.live.settings.academicYear, "2027");
        await assert.rejects(store.change("save", {revision:second.revision,config}), {status:409});
        const publishedSecond = await store.change("publish", {revision:second.revision,draftId:second.draftId});
        assert.equal(publishedSecond.live.settings.academicYear,"2028");
        assert.equal((await store.view("original")).draft.settings.academicYear,"2027");
        await assert.rejects(store.view("missing"), {status:404});
        await assert.rejects(store.change("delete", {revision:second.revision,draftId:second.draftId}), {status:409});
        await assert.rejects(store.change("delete", {revision:publishedSecond.revision,draftId:"missing"}), {status:404});
        const deleted = await store.change("delete", {revision:publishedSecond.revision,draftId:second.draftId});
        assert.equal(deleted.drafts.length,1);
        assert.equal(deleted.draftId,"original");
        assert.deepEqual(deleted.live,publishedSecond.live);
        await assert.rejects(store.view(second.draftId), {status:404});
        await assert.rejects(store.change("delete", {revision:deleted.revision,draftId:deleted.draftId}), {status:422});
        assert.equal((await reconnected.view()).drafts.length,1);
        const enabled = await store.change("maintenance", {revision:deleted.revision,draftId:deleted.draftId,enabled:true});
        assert.equal((await reconnected.view()).maintenance,true);
        assert.deepEqual(enabled.live,deleted.live);
        assert.deepEqual(enabled.draft,deleted.draft);
        await store.change("maintenance", {revision:enabled.revision,draftId:enabled.draftId,enabled:false});
        assert.equal((await reconnected.view()).maintenance,false);

	},
);
