const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { createApp } = require("./app.cjs");
const { createStore, validate } = require("./fees.cjs");
const seed = require("../src/data/fee-config.json");

test("authenticated drafts persist, publish explicitly, and reject unsafe/stale writes", async (t) => {
	const directory = fs.mkdtempSync(path.join(os.tmpdir(), "horizon-api-test-"));
	const password = crypto.randomBytes(20).toString("hex");
	const salt = crypto.randomBytes(16).toString("hex");
	const auth = {
		username: "test-admin",
		salt,
		hash: crypto.scryptSync(password, salt, 64).toString("hex"),
	};
	const fixture = createStore(directory);
	const app = createApp({
		store: {
			view: async (...args) => fixture.view(...args),
			change: async (...args) => fixture.change(...args),
		},
		auth: async () => auth,
		origins: ["http://test.local"],
	});
	await new Promise((resolve) => app.listen(0, "127.0.0.1", resolve));
	t.after(async () => {
		await new Promise((resolve) => app.close(resolve));
		fs.rmSync(directory, { recursive: true, force: true });
	});
	const base = `http://127.0.0.1:${app.address().port}/api/fees?action=`;
	let cookie = "",
		csrf = "";
	async function request(action, data, extra = {}) {
		return fetch(base + action, {
			method: data === undefined ? "GET" : "POST",
			headers: {
				Origin: "http://test.local",
				"Content-Type": "application/json",
				Cookie: cookie,
				"X-CSRF-Token": csrf,
				...extra,
			},
			...(data === undefined ? {} : { body: JSON.stringify(data) }),
		});
	}
	assert.equal((await request("save", {})).status, 401);
	assert.equal((await request("admin")).status, 401);
	assert.equal(
		(await request("login", { username: "test-admin", password: "wrong" }))
			.status,
		401,
	);
	const login = await request("login", { username: auth.username, password });
	assert.equal(login.status, 200);
	assert.match(login.headers.get("set-cookie"), /HttpOnly; SameSite=Strict/);
	cookie = login.headers.get("set-cookie").split(";")[0];
	csrf = (await login.json()).csrfToken;
	let original = await (await request("admin")).json();
    const maintenancePayload = {revision:original.revision,enabled:true,draftId:original.draftId};
    assert.equal((await request("maintenance",maintenancePayload,{Cookie:""})).status,401);
    assert.equal((await request("maintenance",maintenancePayload,{"X-CSRF-Token":"bad"})).status,403);
    assert.equal((await request("maintenance",{...maintenancePayload,enabled:"true"})).status,422);
    const enabled = await (await request("maintenance",maintenancePayload)).json();
    assert.equal(enabled.maintenance,true);
    assert.equal(createStore(directory).view().maintenance,true);
    assert.deepEqual(enabled.draft,original.draft);
    assert.deepEqual(enabled.live,original.live);
    const blocked = await request("live",undefined,{Cookie:""});
    assert.equal(blocked.status,503);
    assert.equal(blocked.headers.get("cache-control"),"no-store");
    const blockedBody = await blocked.json();
    assert.equal(blockedBody.maintenance,true);
    assert.equal(blockedBody.config,undefined);
    assert.equal((await request("live")).status,200);
    assert.equal((await request("preview&draftId=original",undefined,{Cookie:""})).status,401);
    const preview = await (await request("preview&draftId=original")).json();
    assert.equal(preview.preview.id,"original");
    assert.deepEqual(preview.config,original.draft);
    assert.equal((await request("preview&draftId=missing")).status,404);
    assert.equal((await request("preview")).status,400);
    assert.equal((await (await request("live")).json()).drafts.length,1);

    assert.equal((await request("maintenance",maintenancePayload)).status,409);
    original = await (await request("maintenance",{revision:enabled.revision,enabled:false,draftId:enabled.draftId})).json();
    assert.equal((await request("live",undefined,{Cookie:""})).status,200);
    assert.equal((await request("preview&draftId=original")).status,403);
    assert.equal((await (await request("live")).json()).drafts,undefined);

	const config = structuredClone(original.draft);
	config.settings.academicYear = "2027";
	config.settings.scheduleLabel = "2027 · Term 1";
	config.feeStructure.tuition.balaklava.standard.foundation[0] = 3000;
	assert.equal(
		(
			await request(
				"save",
				{ config, revision: original.revision },
				{ "X-CSRF-Token": "invalid" },
			)
		).status,
		403,
	);
	assert.equal(
		(
			await request(
				"save",
				{ config, revision: original.revision },
				{ Origin: "https://untrusted.example" },
			)
		).status,
		403,
	);
	const invalid = structuredClone(config);
	invalid.feeStructure.transport.busFees.child1 = "";
	assert.equal(
		(await request("save", { config: invalid, revision: original.revision }))
			.status,
		422,
	);
	const saved = await (
		await request("save", { config, revision: original.revision })
	).json();
	assert.equal(
		saved.draft.feeStructure.tuition.balaklava.standard.foundation[0],
		3000,
	);
	assert.equal(
		(await (await request("live")).json()).config.settings.academicYear,
		"2026",
	);
	assert.equal(
		createStore(directory).view().draft.settings.academicYear,
		"2027",
	);
	assert.equal(
		(await request("publish", { revision: original.revision })).status,
		409,
	);
	assert.equal(
		(await request("save", { config, revision: original.revision })).status,
		409,
	);
	assert.equal(
		(await request("publish", { revision: saved.revision })).status,
		200,
	);
	assert.equal(
		(await (await request("live")).json()).config.settings.academicYear,
		"2027",
	);
	assert.equal(createStore(directory).read().history.length, 1);
	assert.equal((await request("logout", {})).status, 200);
	assert.equal((await request("admin")).status, 401);
	for (let i = 0; i < 10; i++)
		assert.equal(
			(await request("login", { username: "test-admin", password: "wrong" }))
				.status,
			401,
		);
	assert.equal(
		(await request("login", { username: "test-admin", password })).status,
		429,
	);
});

test("server validates every fee, allows zero, and discards uneditable fields", () => {
	for (const bad of [-1, NaN, Infinity, 1.234, "300", null, 100001]) {
		const config = structuredClone(seed);
		config.feeStructure.tuition.clare.concession.year12[2] = bad;
		assert.throws(() => validate(config));
	}
	const config = structuredClone(seed);
	config.settings.staffDiscountPercentage = 99;
	config.feeStructure.transport.busFees.child4 = 390;
	const clean = validate(config);
	assert.equal(clean.settings.staffDiscountPercentage, 10);
	assert.equal(clean.feeStructure.transport.busFees.child4, 390);
	assert.equal(clean.feeStructure.tuition.clare.standard.year12[3], 0);
});
