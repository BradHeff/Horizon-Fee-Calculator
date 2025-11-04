import {
	DirectionsBus as BusIcon,
	LocalOffer as DiscountIcon,
	AttachMoney as MoneyIcon,
	School as SchoolIcon,
} from "@mui/icons-material";
import {
	Alert,
	Box,
	Chip,
	Divider,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";

const MaterialFeeOutcomeTable = ({
	getClearLevy,
	sortedChildren,
	formatDollars,
	hasConcessionCard,
	concessionFee,
	concessionFeeClare,
	hasBusFee,
	busFee,
	standardCosts,
	standardCostsClare,
	animatedProps,
	totalRef,
	campus,
	animated,
	isStaffDiscount,
}) => {
	const yearLevelLabels = {
		foundation: "Foundation/Kindy",
		year1: "Year 1",
		year2: "Year 2",
		year3: "Year 3",
		year4: "Year 4",
		year5: "Year 5",
		year6: "Year 6",
		year7: "Year 7",
		year8: "Year 8",
		year9: "Year 9",
		year10: "Year 10",
		year11: "Year 11",
		year12: "Year 12",
	};

	const getOrdinalSuffix = (i) => {
		const j = i % 10,
			k = i % 100;
		if (j === 1 && k !== 11) return "st";
		if (j === 2 && k !== 12) return "nd";
		if (j === 3 && k !== 13) return "rd";
		return "th";
	};

	if (sortedChildren.length === 0) {
		return (
			<Box textAlign="center" py={4}>
				<SchoolIcon sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
				<Typography variant="h6" color="text.secondary" gutterBottom>
					No Children Selected
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Please select year levels for your children to see the fee
					breakdown.
				</Typography>
			</Box>
		);
	}

	const calculateSubtotal = () => {
		let subtotal = 0;

		sortedChildren.forEach((year, index) => {
			if (index < 3 && year) {
				const costs = hasConcessionCard
					? (campus === 0 ? concessionFee : concessionFeeClare)[year]
					: (campus === 0 ? standardCosts : standardCostsClare)[year];

				let fee = costs[Math.min(index, 2)] || 0;

				if (isStaffDiscount && !hasConcessionCard) {
					fee = fee * 0.75; // 25% staff discount
				}

				subtotal += fee;
				subtotal += getClearLevy(year);
			}
		});

		return subtotal;
	};

	const calculateBusTotal = () => {
		let busTotal = 0;
		if (hasBusFee) {
			sortedChildren.forEach((_, index) => {
				if (index === 0) busTotal += busFee.child1;
				else if (index === 1) busTotal += busFee.child2;
				else if (index === 2) busTotal += busFee.child3;
			});
		}
		return busTotal;
	};

	const subtotal = calculateSubtotal();
	const busTotal = calculateBusTotal();

	return (
		<Box>
			{/* Fee Breakdown Table */}
			<TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 600 }}>
								Child
							</TableCell>
							<TableCell sx={{ fontWeight: 600 }}>
								Year Level
							</TableCell>
							<TableCell sx={{ fontWeight: 600 }} align="right">
								Tuition Fee
							</TableCell>
							<TableCell sx={{ fontWeight: 600 }} align="right">
								Levy
							</TableCell>
							{hasBusFee && (
								<TableCell
									sx={{ fontWeight: 600 }}
									align="right"
								>
									Bus Fee
								</TableCell>
							)}
							<TableCell sx={{ fontWeight: 600 }} align="right">
								Subtotal
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{sortedChildren.map((year, index) => {
							if (index >= 3 || !year) return null;

							const costs = hasConcessionCard
								? (campus === 0
										? concessionFee
										: concessionFeeClare)[year]
								: (campus === 0
										? standardCosts
										: standardCostsClare)[year];

							let tuitionFee = costs[Math.min(index, 2)] || 0;

							if (isStaffDiscount && !hasConcessionCard) {
								tuitionFee = tuitionFee * 0.75;
							}

							const levy = getClearLevy(year);
							let childBusFee = 0;

							if (hasBusFee) {
								if (index === 0) childBusFee = busFee.child1;
								else if (index === 1)
									childBusFee = busFee.child2;
								else if (index === 2)
									childBusFee = busFee.child3;
							}

							const childSubtotal =
								tuitionFee + levy + childBusFee;

							return (
								<TableRow key={index}>
									<TableCell>
										<Box display="flex" alignItems="center">
											<SchoolIcon
												sx={{
													mr: 1,
													color: "primary.main",
													fontSize: 20,
												}}
											/>
											<Typography
												variant="body2"
												fontWeight={500}
											>
												{index + 1}
												{getOrdinalSuffix(
													index + 1
												)}{" "}
												Child
											</Typography>
										</Box>
									</TableCell>
									<TableCell>
										<Chip
											label={yearLevelLabels[year]}
											size="small"
											color="primary"
											variant="outlined"
										/>
									</TableCell>
									<TableCell align="right">
										<Box>
											<Typography
												variant="body2"
												fontWeight={500}
											>
												{formatDollars(tuitionFee)}
											</Typography>
											{isStaffDiscount &&
												!hasConcessionCard && (
													<Typography
														variant="caption"
														color="success.main"
													>
														Staff discount applied
													</Typography>
												)}
											{hasConcessionCard && (
												<Typography
													variant="caption"
													color="info.main"
												>
													Concession rate
												</Typography>
											)}
										</Box>
									</TableCell>
									<TableCell align="right">
										<Typography variant="body2">
											{formatDollars(levy)}
										</Typography>
									</TableCell>
									{hasBusFee && (
										<TableCell align="right">
											<Typography variant="body2">
												{formatDollars(childBusFee)}
											</Typography>
										</TableCell>
									)}
									<TableCell align="right">
										<Typography
											variant="body2"
											fontWeight={600}
										>
											{formatDollars(childSubtotal)}
										</Typography>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Applied Discounts/Options */}
			{(hasConcessionCard || hasBusFee || isStaffDiscount) && (
				<Box mb={3}>
					<Typography
						variant="subtitle2"
						gutterBottom
						fontWeight={600}
					>
						Applied Options:
					</Typography>
					<Box display="flex" flexWrap="wrap" gap={1}>
						{hasConcessionCard && (
							<Chip
								icon={<DiscountIcon />}
								label="Concession Card"
								color="info"
								size="small"
							/>
						)}
						{isStaffDiscount && (
							<Chip
								icon={<DiscountIcon />}
								label="Staff Discount (25%)"
								color="success"
								size="small"
							/>
						)}
						{hasBusFee && (
							<Chip
								icon={<BusIcon />}
								label="Bus Transportation"
								color="primary"
								size="small"
							/>
						)}
					</Box>
				</Box>
			)}

			<Divider sx={{ my: 2 }} />

			{/* Total Summary */}
			<Paper
				variant="outlined"
				sx={{ p: 3, bgcolor: "background.accent" }}
			>
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					mb={2}
				>
					<Typography variant="body1">Tuition & Levies:</Typography>
					<Typography variant="body1" fontWeight={500}>
						{formatDollars(subtotal)}
					</Typography>
				</Box>

				{hasBusFee && (
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						mb={2}
					>
						<Box display="flex" alignItems="center">
							<BusIcon sx={{ mr: 1, fontSize: 20 }} />
							<Typography variant="body1">
								Bus Transportation:
							</Typography>
						</Box>
						<Typography variant="body1" fontWeight={500}>
							{formatDollars(busTotal)}
						</Typography>
					</Box>
				)}

				<Divider sx={{ my: 2 }} />

				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
				>
					<Box display="flex" alignItems="center">
						<MoneyIcon sx={{ mr: 1, color: "primary.main" }} />
						<Typography variant="h6" fontWeight={600}>
							Annual Total:
						</Typography>
					</Box>
					<Typography
						variant="h5"
						fontWeight={700}
						color="primary.main"
						ref={totalRef}
					>
						<animated.span>
							{animatedProps.total.to((val) =>
								formatDollars(Math.round(val))
							)}
						</animated.span>
					</Typography>
				</Box>
			</Paper>

			{/* Important Notes */}
			<Alert severity="info" sx={{ mt: 3 }}>
				<Typography variant="body2">
					<strong>Important:</strong> This calculator provides an
					estimate of annual school fees. Final fees may vary based on
					specific circumstances. Please contact the school office for
					official fee confirmation and payment plan options.
				</Typography>
			</Alert>
		</Box>
	);
};

export default MaterialFeeOutcomeTable;
