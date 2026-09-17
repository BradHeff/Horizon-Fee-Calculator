import FeeConfigService from "../../services/FeeConfigService";

// Preserve the existing 2026 calculator policy while sharing one result
// between the family total, desktop table and mobile breakdown.
export const calculateEstimate = (children, campus, concession, staff, bus) => {
	if (campus === null)
		return { breakdown: [], tuition: 0, resources: 0, transport: 0, total: 0 };
	const levels = FeeConfigService.getYearLevels();
	const breakdown = children
		.filter(Boolean)
		.sort((a, b) => levels.indexOf(b) - levels.indexOf(a))
		.map((yearLevel, index) => {
			const tuition =
				index < 3
					? FeeConfigService.getFeeForChild(
							yearLevel,
							index + 1,
							campus,
							concession,
							staff && !concession,
						)
					: 0;
			const resources = FeeConfigService.getResourceFeeForYear(yearLevel);
			const transport =
				bus && index < 3 ? FeeConfigService.getBusFeeForChild(index + 1) : 0;
			return {
				yearLevel,
				tuition,
				resources,
				transport,
				total: tuition + resources + transport,
			};
		});
	return breakdown.reduce(
		(result, child) => ({
			...result,
			tuition: result.tuition + child.tuition,
			resources: result.resources + child.resources,
			transport: result.transport + child.transport,
			total: result.total + child.total,
		}),
		{ breakdown, tuition: 0, resources: 0, transport: 0, total: 0 },
	);
};

export const yearLabel = (year) =>
	year === "foundation"
		? "Foundation / Kindy"
		: `Year ${year.replace("year", "")}`;
export const money = (value) =>
	new Intl.NumberFormat("en-AU", {
		style: "currency",
		currency: "AUD",
		maximumFractionDigits: 2,
		minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
	}).format(value);
