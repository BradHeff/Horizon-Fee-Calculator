import seed from "../../data/fee-config.json";
import {
	applyIncrease,
	updateTuition,
	updateResource,
	bands,
} from "./feeEditor";

test("percentage increases target one campus, preserve zero fees and do not mutate the original", () => {
	const result = applyIncrease(seed, 5, "tuition", "balaklava");
	expect(result.feeStructure.tuition.balaklava.standard.foundation).toEqual([
		2758, 2065, 1379, 0,
	]);
	expect(result.feeStructure.tuition.balaklava.concession.foundation[0]).toBe(
		1379,
	);
	expect(result.feeStructure.tuition.clare).toEqual(
		seed.feeStructure.tuition.clare,
	);
	expect(result.feeStructure.resources).toEqual(seed.feeStructure.resources);
	expect(seed.feeStructure.tuition.balaklava.standard.foundation[0]).toBe(2627);
});
test("all fees can increase to cents without increasing staff discount percentages", () => {
	const result = applyIncrease(seed, 2.5, "all", "clare", "cent");
	expect(result.feeStructure.tuition.clare.standard.foundation[0]).toBe(
		1632.83,
	);
	expect(result.feeStructure.transport.busFees.child1).toBe(399.75);
	expect(result.feeStructure.resources.resourceFees.foundation).toBe(105.58);
	expect(result.settings.staffDiscountPercentage).toBe(10);
});
test("manual edits include all years in a band and retain blank input for validation", () => {
	const result = updateTuition(
		seed,
		"clare",
		"concession",
		bands[0].years,
		1,
		"1000",
	);
	for (const year of bands[0].years)
		expect(result.feeStructure.tuition.clare.concession[year][1]).toBe(1000);
	expect(
		updateResource(seed, bands[3].years, "").feeStructure.resources.resourceFees
			.year12,
	).toBe("");
	expect(() => applyIncrease(seed, 0, "all", "clare")).toThrow();
	expect(() => applyIncrease(seed, 101, "all", "clare")).toThrow();
});
