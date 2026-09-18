import { calculateEstimate } from "./calculateEstimate";

test("requires an explicit campus before showing an estimate", () => {
	expect(
		calculateEstimate(["year12"], null, false, false, false).breakdown,
	).toEqual([]);
});

test("keeps the existing 2026 Balaklava rates and ranks higher years first", () => {
	const result = calculateEstimate(
		["foundation", "year12", "year6", "year4", ""],
		0,
		false,
		false,
		true,
	);
	expect(result.breakdown.map((child) => child.yearLevel)).toEqual([
		"year12",
		"year6",
		"year4",
		"foundation",
	]);
	expect(result.tuition).toBe(3337 + 2163 + 1442);
	expect(result.resources).toBe(515 + 258 + 258 + 103);
	expect(result.transport).toBe(390 + 260 + 130);
	expect(result.breakdown[3].total).toBe(103);
	expect(result.total).toBe(8856);
});

test("uses campus-specific rates and preserves concession/staff exclusivity", () => {
	expect(calculateEstimate(["year7"], 1, false, false, false).total).toBe(2440);
	expect(calculateEstimate(["year7"], 1, false, true, true).total).toBe(2637.5);
	expect(calculateEstimate(["year7"], 1, true, true, false).total).toBe(1478);
});

test("published fourth-child amounts are included for fourth and subsequent children", () => {
	const service = require("../../services/FeeConfigService").default;
	const original = service.config;
	try {
		service.config = JSON.parse(JSON.stringify(original));
		service.config.feeStructure.transport.busFees.child4 = 390;
		service.config.feeStructure.tuition.balaklava.standard.foundation[3] = 100;
		const result = calculateEstimate(
			Array(5).fill("foundation"),
			0,
			false,
			false,
			true,
		);
		expect(result.breakdown[3].total).toBe(593);
		expect(result.breakdown[4].total).toBe(593);
	} finally {
		service.config = original;
	}
});
