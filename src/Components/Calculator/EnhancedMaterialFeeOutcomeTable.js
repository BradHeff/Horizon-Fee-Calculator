/**
 * Enhanced Material Fee Outcome Table
 *
 * This component displays fee calculations with improved features:
 * - Uses dynamic fee configuration
 * - Shows detailed breakdown
 * - Better error handling
 * - Parent-friendly presentation
 */

import {
	DirectionsBus,
	Discount,
	Info,
	AttachMoney as MoneyIcon,
	School,
} from "@mui/icons-material";
import {
	Alert,
	Box,
	Card,
	CardContent,
	Chip,
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Currency from "../Objects/Currancy";
import FeeConfigService, { getFeeMetadata } from "./Constants";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
	marginTop: theme.spacing(2),
	marginBottom: theme.spacing(2),
	borderRadius: theme.shape.borderRadius,
	width: "100%",
	overflowX: "auto",
	"& .MuiTable-root": {
		minWidth: "100%",
		tableLayout: "auto",
	},
	"& .MuiTableHead-root": {
		backgroundColor: theme.palette.primary.main,
		"& .MuiTableCell-root": {
			color: theme.palette.primary.contrastText,
			fontWeight: "bold",
			fontSize: "1rem",
			whiteSpace: "nowrap",
			padding: theme.spacing(1.5, 1),
			[theme.breakpoints.down("md")]: {
				fontSize: "0.875rem",
				padding: theme.spacing(1, 0.5),
			},
		},
	},
	"& .MuiTableBody-root .MuiTableRow-root:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	"& .MuiTableCell-root": {
		padding: theme.spacing(1.5, 1),
		fontSize: "0.95rem",
		whiteSpace: "nowrap",
		[theme.breakpoints.down("md")]: {
			padding: theme.spacing(1, 0.5),
			fontSize: "0.875rem",
		},
		[theme.breakpoints.down("sm")]: {
			padding: theme.spacing(0.75, 0.25),
			fontSize: "0.8rem",
		},
	},
	// Specific column width optimizations
	"& .child-column": {
		width: "20%",
		minWidth: "90px",
		[theme.breakpoints.down("md")]: {
			width: "25%",
			minWidth: "80px",
		},
	},
	"& .year-column": {
		width: "15%",
		minWidth: "70px",
		[theme.breakpoints.down("md")]: {
			width: "15%",
			minWidth: "60px",
		},
	},
	"& .fee-column": {
		width: "16.25%",
		minWidth: "80px",
		textAlign: "right",
		[theme.breakpoints.down("md")]: {
			width: "15%",
			minWidth: "70px",
		},
		[theme.breakpoints.down("sm")]: {
			minWidth: "65px",
		},
	},
	"& .total-column": {
		width: "16.25%",
		minWidth: "80px",
		textAlign: "right",
		fontWeight: "bold",
		[theme.breakpoints.down("md")]: {
			width: "15%",
			minWidth: "70px",
		},
		[theme.breakpoints.down("sm")]: {
			minWidth: "65px",
		},
	},
}));

const SummaryCard = styled(Card)(({ theme }) => ({
	marginTop: theme.spacing(2),
	background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
	border: `1px solid ${theme.palette.primary.main}30`,
}));

const EnhancedMaterialFeeOutcomeTable = ({
	campus,
	yearLevels,
	hasStaffDiscount,
	hasConcessionCard,
	hasBusFee,
	// Legacy props for backward compatibility
	standardCosts,
	standardCostsClare,
	concessionFee,
	concessionFeeClare,
	busFee,
	useEnhanced = true, // New prop to enable enhanced features
}) => {
	const theme = useTheme();

	// If no year levels selected, show help message
	if (!yearLevels || yearLevels.length === 0) {
		return (
			<Box sx={{ mt: 3, mb: 3 }}>
				<Alert severity="info" icon={<Info />}>
					<Typography variant="body1">
						Please select year levels for your children to see the
						fee calculation.
					</Typography>
				</Alert>
			</Box>
		);
	}

	// Calculate if resource fees are applicable for any selected year levels
	const hasResourceFee = yearLevels.some((yearLevel) => {
		const resourceFee = FeeConfigService.getResourceFeeForYear(yearLevel);
		return resourceFee > 0;
	});

	let calculations;

	if (useEnhanced) {
		// Use the new enhanced calculation method
		const children = yearLevels.map((yearLevel) => ({ yearLevel }));
		calculations = FeeConfigService.calculateFamilyFees(
			children,
			campus,
			hasConcessionCard,
			hasStaffDiscount,
			hasBusFee,
			hasResourceFee
		);
	} else {
		// Fall back to legacy calculation for backward compatibility
		calculations = calculateLegacyFees();
	}

	// Helper function for resource fees
	const getClearLevy = (yearLevel) => {
		return FeeConfigService.getResourceFeeForYear(yearLevel);
	};

	function calculateLegacyFees() {
		let subtotal = 0;
		let busTotal = 0;
		let resourceTotal = 0;
		const breakdown = [];

		yearLevels.forEach((year, index) => {
			// Only first 3 children get tuition fees
			let fee = 0;
			if (index < 3) {
				const costs = hasConcessionCard
					? (campus === 0 ? concessionFee : concessionFeeClare)[year]
					: (campus === 0 ? standardCosts : standardCostsClare)[year];

				fee = costs[Math.min(index, 2)] || 0;

				if (hasStaffDiscount && fee > 0) {
					fee = fee * 0.90; // 10% staff discount
				}
			}

			subtotal += fee;

			// All children get resource fees
			const resourceFee = getClearLevy(year);
			resourceTotal += resourceFee;

			// Only first 3 children get bus fees
			let childBusFee = 0;
			if (hasBusFee && index < 3) {
				if (index === 0) childBusFee = busFee.child1;
				else if (index === 1) childBusFee = busFee.child2;
				else if (index === 2) childBusFee = busFee.child3;

				busTotal += childBusFee;
			}

			breakdown.push({
				childNumber: index + 1,
				yearLevel: year,
				tuitionFee: fee,
				resourceFee: resourceFee,
				busFee: childBusFee,
				total: fee + resourceFee + childBusFee,
			});
		});

		return {
			tuition: subtotal,
			resources: resourceTotal,
			transport: busTotal,
			grandTotal: subtotal + resourceTotal + busTotal,
			breakdown,
			appliedDiscounts: {
				concessionCard: hasConcessionCard,
				staffDiscount: hasStaffDiscount,
				staffDiscountPercentage: hasStaffDiscount ? 10 : 0,
			},
		};
	}

	const campusName = campus === 0 ? "Balaklava" : "Clare";
	const metadata = useEnhanced ? getFeeMetadata() : null;

	return (
		<Box sx={{ mt: 3 }}>
			{/* Header */}
			<Box sx={{ mb: 3 }}>
				<Typography
					variant="h5"
					component="h2"
					sx={{
						fontWeight: "bold",
						color: theme.palette.primary.main,
						mb: 1,
					}}
				>
					Fee Calculation Summary
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{campusName} Campus • {yearLevels.length} Child
					{yearLevels.length !== 1 ? "ren" : ""}
					{metadata && ` • ${metadata.academicYear} Academic Year`}
				</Typography>
			</Box>

			{/* Applied Discounts */}
			{(calculations.appliedDiscounts.concessionCard ||
				calculations.appliedDiscounts.staffDiscount) && (
				<Box sx={{ mb: 2 }}>
					<Typography variant="subtitle2" gutterBottom>
						Applied Discounts:
					</Typography>
					<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
						{calculations.appliedDiscounts.concessionCard && (
							<Chip
								icon={<Discount />}
								label="Concession Card Holder"
								color="info"
								size="small"
							/>
						)}
						{calculations.appliedDiscounts.staffDiscount && (
							<Chip
								icon={<Discount />}
								label={`Staff Discount (${calculations.appliedDiscounts.staffDiscountPercentage}%)`}
								color="secondary"
								size="small"
							/>
						)}
					</Box>
				</Box>
			)}

			{/* Detailed Breakdown Table */}
			<Box sx={{ width: "100%", overflow: "hidden" }}>
				<StyledTableContainer component={Paper} elevation={2}>
					<Table
						size="small"
						stickyHeader
						sx={{
							"& .MuiTableCell-sizeSmall": {
								padding: {
									xs: "4px 2px",
									sm: "8px 4px",
									md: "12px 8px",
								},
							},
						}}
					>
						<TableHead>
							<TableRow>
								<TableCell className="child-column">
									<Box
										sx={{
											display: {
												xs: "none",
												sm: "block",
											},
										}}
									>
										Child
									</Box>
									<Box
										sx={{
											display: {
												xs: "block",
												sm: "none",
											},
										}}
									>
										#
									</Box>
								</TableCell>
								<TableCell className="year-column">
									<Box
										sx={{
											display: {
												xs: "none",
												sm: "block",
											},
										}}
									>
										Year Level
									</Box>
									<Box
										sx={{
											display: {
												xs: "block",
												sm: "none",
											},
										}}
									>
										Year
									</Box>
								</TableCell>
								<TableCell align="right" className="fee-column">
									<Box
										sx={{
											display: {
												xs: "none",
												sm: "block",
											},
										}}
									>
										Tuition Fee
									</Box>
									<Box
										sx={{
											display: {
												xs: "block",
												sm: "none",
											},
										}}
									>
										Tuition
									</Box>
								</TableCell>
								<TableCell align="right" className="fee-column">
									<Box
										sx={{
											display: {
												xs: "none",
												sm: "block",
											},
										}}
									>
										Resource Levy
									</Box>
									<Box
										sx={{
											display: {
												xs: "block",
												sm: "none",
											},
										}}
									>
										Resources
									</Box>
								</TableCell>
								{hasBusFee && (
									<TableCell
										align="right"
										className="fee-column"
									>
										<Box
											sx={{
												display: {
													xs: "none",
													sm: "block",
												},
											}}
										>
											Transport Fee
										</Box>
										<Box
											sx={{
												display: {
													xs: "block",
													sm: "none",
												},
											}}
										>
											Transport
										</Box>
									</TableCell>
								)}
								<TableCell
									align="right"
									className="total-column"
								>
									Total
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{calculations.breakdown.map((child, index) => (
								<TableRow key={index}>
									<TableCell className="child-column">
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: { xs: 0.25, sm: 0.5 },
											}}
										>
											<School
												color="primary"
												fontSize="small"
												sx={{
													display: {
														xs: "none",
														sm: "block",
													},
												}}
											/>
											<Typography
												variant="body2"
												fontWeight="medium"
												sx={{
													fontSize: {
														xs: "0.75rem",
														sm: "0.875rem",
													},
												}}
											>
												<Box
													component="span"
													sx={{
														display: {
															xs: "none",
															sm: "inline",
														},
													}}
												>
													Child {child.childNumber}
												</Box>
												<Box
													component="span"
													sx={{
														display: {
															xs: "inline",
															sm: "none",
														},
													}}
												>
													{child.childNumber}
												</Box>
											</Typography>
											{child.childNumber >= 4 && (
												<Chip
													label="Free"
													color="success"
													size="small"
													sx={{
														height: {
															xs: 18,
															sm: 20,
														},
														fontSize: {
															xs: "0.6rem",
															sm: "0.65rem",
														},
														"& .MuiChip-label": {
															px: {
																xs: 0.5,
																sm: 1,
															},
														},
													}}
												/>
											)}
										</Box>
									</TableCell>
									<TableCell className="year-column">
										<Typography
											variant="body2"
											sx={{
												textTransform: "capitalize",
												fontSize: {
													xs: "0.75rem",
													sm: "0.875rem",
												},
											}}
										>
											<Box
												component="span"
												sx={{
													display: {
														xs: "none",
														sm: "inline",
													},
												}}
											>
												{child.yearLevel
													.replace("year", "Year ")
													.replace(
														"foundation",
														"Foundation/Kindy"
													)}
											</Box>
											<Box
												component="span"
												sx={{
													display: {
														xs: "inline",
														sm: "none",
													},
												}}
											>
												{child.yearLevel
													.replace("year", "")
													.replace("foundation", "F")}
											</Box>
										</Typography>
									</TableCell>
									<TableCell
										align="right"
										className="fee-column"
									>
										<Currency number={child.tuitionFee} />
									</TableCell>
									<TableCell
										align="right"
										className="fee-column"
									>
										<Currency number={child.resourceFee} />
									</TableCell>
									{hasBusFee && (
										<TableCell
											align="right"
											className="fee-column"
										>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "flex-end",
													gap: { xs: 0.25, sm: 0.5 },
												}}
											>
												<DirectionsBus
													color="action"
													fontSize="small"
													sx={{
														display: {
															xs: "none",
															sm: "block",
														},
													}}
												/>
												<Currency
													number={child.busFee}
												/>
											</Box>
										</TableCell>
									)}
									<TableCell
										align="right"
										className="total-column"
									>
										<Typography
											variant="body1"
											fontWeight="bold"
										>
											<Currency number={child.total} />
										</Typography>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</StyledTableContainer>
			</Box>

			{/* Summary Cards */}
			<Grid container spacing={2} sx={{ mt: 2 }}>
				<Grid item xs={12} sm={hasBusFee ? 3 : 4}>
					<SummaryCard elevation={2}>
						<CardContent sx={{ textAlign: "center" }}>
							<School
								color="primary"
								sx={{ fontSize: 40, mb: 1 }}
							/>
							<Typography
								variant="h6"
								color="primary"
								gutterBottom
							>
								Tuition Fees
							</Typography>
							<Typography variant="h4" fontWeight="bold">
								<Currency number={calculations.tuition} />
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Per term
							</Typography>
						</CardContent>
					</SummaryCard>
				</Grid>

				<Grid item xs={12} sm={hasBusFee ? 3 : 4}>
					<SummaryCard elevation={2}>
						<CardContent sx={{ textAlign: "center" }}>
							<MoneyIcon
								color="secondary"
								sx={{ fontSize: 40, mb: 1 }}
							/>
							<Typography
								variant="h6"
								color="secondary.main"
								gutterBottom
							>
								Resource Levy
							</Typography>
							<Typography variant="h4" fontWeight="bold">
								<Currency number={calculations.resources} />
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Per term
							</Typography>
						</CardContent>
					</SummaryCard>
				</Grid>

				{hasBusFee && (
					<Grid item xs={12} sm={3}>
						<SummaryCard elevation={2}>
							<CardContent sx={{ textAlign: "center" }}>
								<DirectionsBus
									color="info"
									sx={{ fontSize: 40, mb: 1 }}
								/>
								<Typography
									variant="h6"
									color="info.main"
									gutterBottom
								>
									Transport Fees
								</Typography>
								<Typography variant="h4" fontWeight="bold">
									<Currency number={calculations.transport} />
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Per term
								</Typography>
							</CardContent>
						</SummaryCard>
					</Grid>
				)}

				<Grid
					item
					xs={12}
					sm={
						hasResourceFee && hasBusFee
							? 3
							: hasResourceFee || hasBusFee
							? 4
							: 6
					}
				>
					<Card
						elevation={3}
						sx={{
							background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
							color: "white",
						}}
					>
						<CardContent sx={{ textAlign: "center" }}>
							<Typography variant="h6" gutterBottom>
								Total Amount
							</Typography>
							<Typography variant="h3" fontWeight="bold">
								<Currency number={calculations.grandTotal} />
							</Typography>
							<Typography
								variant="body2"
								sx={{ opacity: 0.9, mt: 1 }}
							>
								Per term • All {yearLevels.length} child
								{yearLevels.length !== 1 ? "ren" : ""}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Additional Information */}
			<Box sx={{ mt: 3 }}>
				<Alert severity="info" icon={<Info />}>
					<Typography variant="body2">
						<strong>Important Notes:</strong>
						<br />• Fees are charged per term (4 terms per academic
						year) • Family discounts are automatically applied for
						multiple children • Staff discounts apply to tuition
						fees only, not transport
						{hasConcessionCard && (
							<>
								<br />• Concession card discounts have been
								applied to these calculations
							</>
						)}
						<br />• For payment plans and additional information,
						please contact the school office
					</Typography>
				</Alert>
			</Box>

			{/* Configuration Version (Enhanced mode only) */}
			{useEnhanced && metadata && (
				<Box sx={{ mt: 2, textAlign: "center" }}>
					<Typography variant="caption" color="text.secondary">
						Fee structure version {metadata.version} • Last updated{" "}
						{metadata.lastUpdated}
					</Typography>
				</Box>
			)}
		</Box>
	);
};

export default EnhancedMaterialFeeOutcomeTable;
