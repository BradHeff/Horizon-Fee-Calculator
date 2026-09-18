const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const seed = require("../src/data/fee-config.json");

function fail(message, status = 422) {
	throw Object.assign(new Error(message), { status });
}
function validate(input) {
	const next = structuredClone(seed);
	const year = String(input?.settings?.academicYear ?? "");
	if (!/^(20\d{2}|2100)$/.test(year) || +year < 2020 || +year > 2100)
		fail("Enter an academic year between 2020 and 2100.");
	const label = input.settings.scheduleLabel ?? "";
	if (typeof label !== "string" || label.length > 60)
		fail("Schedule label must be 60 characters or fewer.");
	next.settings.academicYear = year;
	next.settings.scheduleLabel = label.trim();
	function number(value) {
		if (
			typeof value !== "number" ||
			!Number.isFinite(value) ||
			value < 0 ||
			value > 100000 ||
			Math.abs(value * 100 - Math.round(value * 100)) > 0.00001
		)
			fail(
				"Every fee must be a number from $0 to $100,000 with at most two decimal places.",
			);
		return value;
	}
	for (const campus of ["balaklava", "clare"])
		for (const type of ["standard", "concession"])
			for (const { key } of seed.yearLevels) {
				const row = input?.feeStructure?.tuition?.[campus]?.[type]?.[key];
				if (!Array.isArray(row) || row.length !== 4)
					fail(`Missing child rates: ${campus}, ${type}, ${key}.`);
				next.feeStructure.tuition[campus][type][key] = row.map(number);
			}
	for (const { key } of seed.yearLevels)
		next.feeStructure.resources.resourceFees[key] = number(
			input?.feeStructure?.resources?.resourceFees?.[key],
		);
	for (const key of ["child1", "child2", "child3", "child4"])
		next.feeStructure.transport.busFees[key] = number(
			input?.feeStructure?.transport?.busFees?.[key],
		);
	// Editable amounts only: clients cannot alter discount policy or other config structure.
	next.description = `Horizon Christian School Fee Structure - ${year}`;
	next.lastUpdated = new Date().toISOString().slice(0, 10);
	next.version = `${year}.${Date.now()}`;
	next.metadata = {
		notes: ["Annual fee estimates; confirm final fees with the school office."],
	};
	return next;
}
function createStore(directory) {
	fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
	const file = path.join(directory, "fees.json");
	function write(state) {
		const temporary = `${file}.${crypto.randomUUID()}.tmp`;
		fs.writeFileSync(temporary, JSON.stringify(state, null, 2), {
			mode: 0o600,
		});
		fs.renameSync(temporary, file);
	}
	if (!fs.existsSync(file))
		write({
			live: seed,
			draft: seed,
			revision: crypto.randomUUID(),
			history: [],
		});
	const read = () => JSON.parse(fs.readFileSync(file, "utf8"));
	const view = () => {
		const { live, draft, revision } = read();
		return { live, draft, revision };
	};
	function change(action, input) {
		const state = read();
		if (input?.revision !== state.revision)
			fail(
				"Another administrator changed this draft. Reload the page before editing again.",
				409,
			);
		if (action === "save") state.draft = validate(input.config);
		else {
			state.history = [
				...state.history,
				{ publishedAt: new Date().toISOString(), config: state.live },
			].slice(-30);
			state.live = state.draft;
		}
		state.revision = crypto.randomUUID();
		write(state);
		return view();
	}
	return { read, view, change };
}
module.exports = { createStore, validate };
