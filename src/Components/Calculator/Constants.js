/**
 * Constants.js - Dynamic Fee Configuration
 *
 * This file now uses the FeeConfigService to load fees from fee-config.json
 * This eliminates hardcoded values and allows fee updates without code changes.
 *
 * Legacy exports are maintained for backward compatibility during transition.
 */

import FeeConfigService from "../../services/FeeConfigService";

// Get legacy constants from the dynamic configuration service
const legacyConstants = FeeConfigService.getLegacyConstants();

// Export all constants with backward compatibility
export const staffDiscountPercentage = legacyConstants.staffDiscountPercentage;
export const yearLevels = legacyConstants.yearLevels;
export const standardCosts = legacyConstants.standardCosts;
export const standardCostsClare = legacyConstants.standardCostsClare;
export const concessionFee = legacyConstants.concessionFee;
export const concessionFeeClare = legacyConstants.concessionFeeClare;
export const busFee = legacyConstants.busFee;
export const resourceFee = legacyConstants.resourceFee;

// Export the service for advanced usage
export { default as FeeConfigService } from "../../services/FeeConfigService";

// Helper functions for easier fee calculations
export const calculateChildFee = (
	yearLevel,
	childNumber,
	campus,
	hasConcessionCard = false,
	isStaff = false
) => {
	return FeeConfigService.getFeeForChild(
		yearLevel,
		childNumber,
		campus,
		hasConcessionCard,
		isStaff
	);
};

export const calculateFamilyTotal = (
	children,
	campus,
	hasConcessionCard = false,
	isStaff = false,
	hasBusFee = false,
	hasResourceFee = true
) => {
	return FeeConfigService.calculateFamilyFees(
		children,
		campus,
		hasConcessionCard,
		isStaff,
		hasBusFee,
		hasResourceFee
	);
};

export const getFeeMetadata = () => {
	return FeeConfigService.getMetadata();
};
