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
function draftList(state) {
 return state.drafts || [{ id: "original", name: "Existing draft", config: state.draft }];
}
function draftView(state, id) {
 const drafts = draftList(state);
 const selected = id ? drafts.find(d => d.id === id) : drafts[0];
 if (!selected) fail("Draft not found. Reload the page.", 404);
 return { maintenance: state.maintenance === true, live: state.live, draft: selected.config, draftId: selected.id, draftName: selected.name,
  drafts: drafts.map(d => ({ id:d.id, name:d.name, year:d.config.settings.academicYear })), revision:state.revision };
}
function changeDraft(state, action, input) {
 if (action === "maintenance") {
  if (typeof input.enabled !== "boolean") fail("Maintenance must be on or off.");
  const selected = draftView(state, input.draftId);
  state.maintenance = input.enabled;
  return selected.draftId;
 }
 state.drafts = draftList(state);
 let selected;
 if (action === "create") {
  if (state.drafts.length >= 50) fail("A maximum of 50 drafts is supported.");
  selected = { id:crypto.randomUUID(), config:validate(input.config) };
 } else {
  if (!input.draftId && state.drafts.length > 1) fail("Reload the admin panel to select a draft.", 409);
  selected = state.drafts.find(d => d.id === (input.draftId || state.drafts[0].id));
  if (!selected) fail("Draft not found. Reload the page.", 404);
 }
 if (action === "create" || action === "save") {
  const name = input.name === undefined && action === "save" ? selected.name : input.name;
  if (typeof name !== "string" || !name.trim() || name.trim().length > 80) fail("Enter a draft name of 1–80 characters.");
  if (state.drafts.some(d => d.id !== selected.id && d.name.toLowerCase() === name.trim().toLowerCase())) fail("Choose a different draft name; that name already exists.");
  selected.name = name.trim();
  selected.config = validate(input.config);
  if (action === "create") state.drafts.push(selected);
 } else if (action === "delete") {
  if (!input.draftId) fail("Select a draft to delete.");
  if (state.drafts.length <= 1) fail("Keep at least one draft. Create another draft before deleting this one.");
  state.drafts = state.drafts.filter(d => d.id !== selected.id);
  selected = state.drafts[0];
 } else if (action === "publish") {
  state.history = [...state.history, {publishedAt:new Date().toISOString(), config:state.live}].slice(-30);
  state.live = structuredClone(selected.config);
 } else fail("Unknown action.", 400);
 // Retain the original draft field for compatibility with backups.
 state.draft = state.drafts[0].config;
 return selected.id;
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
	const view = (id) => draftView(read(), id);
	function change(action, input) {
		const state = read();
		if (input?.revision !== state.revision)
			fail(
				"Another administrator changed this draft. Reload the page before editing again.",
				409,
			);
		const id = changeDraft(state, action, input);
		state.revision = crypto.randomUUID();
		write(state);
		return view(id);
	}
	return { read, view, change };
}
module.exports = { createStore, validate, draftView, changeDraft };
