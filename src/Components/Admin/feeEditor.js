export const bands = [
	{
		label: "Foundation–Year 3",
		years: ["foundation", "year1", "year2", "year3"],
	},
	{ label: "Years 4–6", years: ["year4", "year5", "year6"] },
	{ label: "Years 7–9", years: ["year7", "year8", "year9"] },
	{ label: "Years 10–12", years: ["year10", "year11", "year12"] },
];
export const clone = (value) => JSON.parse(JSON.stringify(value));
export const amount = (value) => (value === "" ? "" : Number(value));
export function updateTuition(config, campus, type, years, child, value) {
	const next = clone(config);
	years.forEach((year) => {
		next.feeStructure.tuition[campus][type][year][child] = amount(value);
	});
	return next;
}
export function updateResource(config, years, value) {
	const next = clone(config);
	years.forEach((year) => {
		next.feeStructure.resources.resourceFees[year] = amount(value);
	});
	return next;
}
export function applyIncrease(
	config,
	percent,
	scope,
	campus,
	rounding = "dollar",
) {
	if (!Number.isFinite(percent) || percent <= 0 || percent > 100)
		throw new Error("Enter an increase greater than 0 and no more than 100%.");
	const next = clone(config);
	const factor = rounding === "cent" ? 100 : 1;
	const increase = (value) => {
		if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
			throw new Error("Complete all fee amounts before applying an increase.");
		const result =
			Math.round((value * (100 + percent) * factor) / 100 + 1e-8) / factor;
		if (result > 100000) throw new Error("Fee amounts cannot exceed $100,000.");
		return result;
	};
	if (scope === "all" || scope === "tuition") {
		const campuses = scope === "all" ? ["balaklava", "clare"] : [campus];
		campuses.forEach((key) =>
			["standard", "concession"].forEach((type) => {
				Object.keys(next.feeStructure.tuition[key][type]).forEach((year) => {
					next.feeStructure.tuition[key][type][year] =
						next.feeStructure.tuition[key][type][year].map(increase);
				});
			}),
		);
	}
	if (scope === "all" || scope === "resources")
		Object.keys(next.feeStructure.resources.resourceFees).forEach((year) => {
			next.feeStructure.resources.resourceFees[year] = increase(
				next.feeStructure.resources.resourceFees[year],
			);
		});
	if (scope === "all" || scope === "transport")
		Object.keys(next.feeStructure.transport.busFees).forEach((key) => {
			next.feeStructure.transport.busFees[key] = increase(
				next.feeStructure.transport.busFees[key],
			);
		});
	return next;
}
