/**
 * Fee Configuration Service
 * Handles loading of fee structures from fee-config.json
 */

import feeConfig from "../data/fee-config.json";

class FeeConfigService {
	constructor() {
		this.config = feeConfig;
		this.validateConfig();
	}

	/**
	 * Validates the fee configuration structure
	 */
	validateConfig() {
		if (!this.config.version) {
			throw new Error("Fee configuration missing version");
		}

		if (!this.config.feeStructure) {
			throw new Error("Fee configuration missing fee structure");
		}

		console.log(
			`Fee Configuration Loaded: Version ${this.config.version} (${this.config.settings.academicYear})`
		);
	}

	/**
	 * Get fee configuration metadata
	 */
	getMetadata() {
		return {
			version: this.config.version,
			lastUpdated: this.config.lastUpdated,
			academicYear: this.config.settings.academicYear,
			currency: this.config.settings.currency,
			...this.config.metadata,
		};
	}

	/**
	 * Get staff discount percentage
	 */
	getStaffDiscountPercentage() {
		return this.config.settings.staffDiscountPercentage || 25;
	}

	/**
	 * Get year levels configuration
	 */
	getYearLevels() {
		return this.config.yearLevels.map((level) => level.key);
	}

	/**
	 * Get campus configuration
	 */
	getCampuses() {
		return this.config.campuses;
	}

	/**
	 * Get child priority discount structure
	 */
	getChildPriorityDiscounts() {
		return this.config.childPriorityDiscounts;
	}

	/**
	 * Get tuition fees for a specific campus and fee type
	 * @param {string} campus - 'balaklava' or 'clare'
	 * @param {string} feeType - 'standard' or 'concession'
	 * @returns {Object} Fee structure object
	 */
	getTuitionFees(campus, feeType = "standard") {
		const campusKey =
			campus === 0 || campus === "balaklava" ? "balaklava" : "clare";
		return this.config.feeStructure.tuition[campusKey][feeType];
	}

	/**
	 * Get specific fee for year level and child priority
	 * @param {string} yearLevel - Year level key
	 * @param {number} childNumber - Child priority (1-based)
	 * @param {string|number} campus - Campus identifier
	 * @param {boolean} hasConcessionCard - Whether family has concession card
	 * @param {boolean} isStaff - Whether family member is staff
	 * @returns {number} Calculated fee amount
	 */
	getFeeForChild(
		yearLevel,
		childNumber,
		campus,
		hasConcessionCard = false,
		isStaff = false
	) {
		const feeType = hasConcessionCard ? "concession" : "standard";
		const fees = this.getTuitionFees(campus, feeType);

		if (!fees[yearLevel]) {
			console.warn(`No fees found for year level: ${yearLevel}`);
			return 0;
		}

		// Get base fee for child priority (1st, 2nd, 3rd child, 4th+ free)
		const childIndex = Math.min(childNumber - 1, 3); // Max index is 3 (4th child)
		let baseFee = fees[yearLevel][childIndex] || 0;

		// Apply staff discount if applicable (only to tuition, not transport)
		if (isStaff && baseFee > 0) {
			const discountMultiplier =
				(100 - this.getStaffDiscountPercentage()) / 100;
			baseFee = baseFee * discountMultiplier;
		}

		return baseFee;
	}

	/**
	 * Get bus fees structure
	 */
	getBusFees() {
		return this.config.feeStructure.transport.busFees;
	}

	/**
	 * Get bus fee for specific child
	 * @param {number} childNumber - Child priority (1-based)
	 * @returns {number} Bus fee amount
	 */
	getBusFeeForChild(childNumber) {
		const busFees = this.getBusFees();
		const childKey = `child${Math.min(childNumber, 4)}`;
		return busFees[childKey] || 0;
	}

	/**
	 * Get resource fees structure
	 */
	getResourceFees() {
		return this.config.feeStructure.resources?.resourceFees || {};
	}

	/**
	 * Get resource fee for specific year level
	 * @param {string} yearLevel - Year level key
	 * @returns {number} Resource fee amount
	 */
	getResourceFeeForYear(yearLevel) {
		const resourceFees = this.getResourceFees();
		return resourceFees[yearLevel] || 0;
	}

	/**
	 * Calculate total fees for a family
	 * @param {Array} children - Array of child objects with {yearLevel, childNumber}
	 * @param {string|number} campus - Campus identifier
	 * @param {boolean} hasConcessionCard - Whether family has concession card
	 * @param {boolean} isStaff - Whether family member is staff
	 * @param {boolean} hasBusFee - Whether family requires bus service
	 * @param {boolean} hasResourceFee - Whether family requires resource levy
	 * @returns {Object} Detailed fee breakdown
	 */
	calculateFamilyFees(
		children,
		campus,
		hasConcessionCard = false,
		isStaff = false,
		hasBusFee = false,
		hasResourceFee = true
	) {
		let totalTuition = 0;
		let totalBus = 0;
		let totalResources = 0;
		const childBreakdown = [];

		children.forEach((child, index) => {
			const childNumber = index + 1;
			const tuitionFee = this.getFeeForChild(
				child.yearLevel,
				childNumber,
				campus,
				hasConcessionCard,
				isStaff
			);

			const busFee = hasBusFee ? this.getBusFeeForChild(childNumber) : 0;
			const resourceFee = hasResourceFee
				? this.getResourceFeeForYear(child.yearLevel)
				: 0;

			childBreakdown.push({
				childNumber,
				yearLevel: child.yearLevel,
				tuitionFee,
				busFee,
				resourceFee,
				total: tuitionFee + busFee + resourceFee,
			});

			totalTuition += tuitionFee;
			totalBus += busFee;
			totalResources += resourceFee;
		});

		return {
			tuition: totalTuition,
			transport: totalBus,
			resources: totalResources,
			grandTotal: totalTuition + totalBus + totalResources,
			breakdown: childBreakdown,
			appliedDiscounts: {
				concessionCard: hasConcessionCard,
				staffDiscount: isStaff,
				staffDiscountPercentage: isStaff
					? this.getStaffDiscountPercentage()
					: 0,
			},
			metadata: this.getMetadata(),
		};
	}

	/**
	 * Export legacy constants for backward compatibility
	 * This allows existing components to continue working while transitioning
	 */
	getLegacyConstants() {
		const balaklavaStandard = this.getTuitionFees("balaklava", "standard");
		const balaklavaConcession = this.getTuitionFees(
			"balaklava",
			"concession"
		);
		const clareStandard = this.getTuitionFees("clare", "standard");
		const clareConcession = this.getTuitionFees("clare", "concession");

		return {
			staffDiscountPercentage:
				(100 - this.getStaffDiscountPercentage()) / 100,
			yearLevels: this.getYearLevels(),
			standardCosts: balaklavaStandard,
			standardCostsClare: clareStandard,
			concessionFee: balaklavaConcession,
			concessionFeeClare: clareConcession,
			busFee: this.getBusFees(),
			resourceFee: this.getResourceFees(),
		};
	}
}

// Create singleton instance
const feeConfigService = new FeeConfigService();

export default feeConfigService;
