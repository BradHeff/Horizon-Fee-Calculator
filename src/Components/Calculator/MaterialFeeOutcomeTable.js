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
	useMediaQuery,
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
	const isMobile = useMediaQuery("(max-width:1360px)");

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
			if (year) {
				// Only first 3 children get tuition fees
				if (index < 3) {
					const costs = hasConcessionCard
						? (campus === 0 ? concessionFee : concessionFeeClare)[
								year
						  ]
						: (campus === 0 ? standardCosts : standardCostsClare)[
								year
						  ];

					let fee = costs[Math.min(index, 2)] || 0;

					if (isStaffDiscount && !hasConcessionCard) {
						fee = fee * 0.90; // 10% staff discount
					}

					subtotal += fee;
				}

				// All children get resource fees (levy)
				subtotal += getClearLevy(year);
			}
		});

		return subtotal;
	};

	const calculateBusTotal = () => {
		let busTotal = 0;
		if (hasBusFee) {
			sortedChildren.forEach((_, index) => {
				// Only first 3 children get bus fees
				if (index < 3) {
					if (index === 0) busTotal += busFee.child1;
					else if (index === 1) busTotal += busFee.child2;
					else if (index === 2) busTotal += busFee.child3;
				}
			});
		}
		return busTotal;
	};

	const subtotal = calculateSubtotal();
	const busTotal = calculateBusTotal();
	return (
		<Box>
			{/* Fee Breakdown Table */}
			<TableContainer
				component={Paper}
				variant="outlined"
				sx={{
					mb: 3,
					overflowX: "auto",
					width: "100%",
					"& .MuiTable-root": {
						minWidth: isMobile ? (hasBusFee ? 700 : 500) : 800,
					},
				}}
			>
				<Table size={isMobile ? "small" : "medium"}>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 600, minWidth: 100 }}>
								Child
							</TableCell>
							<TableCell sx={{ fontWeight: 600, minWidth: 120 }}>
								Year Level
							</TableCell>
							<TableCell
								sx={{ fontWeight: 600, minWidth: 100 }}
								align="right"
							>
								Tuition Fee
							</TableCell>
							<TableCell
								sx={{ fontWeight: 600, minWidth: 80 }}
								align="right"
							>
								Levy
							</TableCell>
							{hasBusFee && (
								<TableCell
									sx={{ fontWeight: 600, minWidth: 90 }}
									align="right"
								>
									Bus Fee
								</TableCell>
							)}
							<TableCell
								sx={{ fontWeight: 600, minWidth: 100 }}
								align="right"
							>
								Subtotal
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{sortedChildren.map((year, index) => {
							if (!year) return null;

							// Only first 3 children get tuition fees
							let tuitionFee = 0;
							if (index < 3) {
								const costs = hasConcessionCard
									? (campus === 0
											? concessionFee
											: concessionFeeClare)[year]
									: (campus === 0
											? standardCosts
											: standardCostsClare)[year];

								tuitionFee = costs[Math.min(index, 2)] || 0;

								if (isStaffDiscount && !hasConcessionCard) {
									tuitionFee = tuitionFee * 0.90;
								}
							}

							// All children get resource fees (levy)
							const levy = getClearLevy(year);

							// Only first 3 children get bus fees
							let childBusFee = 0;
							if (hasBusFee && index < 3) {
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
									<TableCell sx={{ py: 1 }}>
										<Box display="flex" alignItems="center">
											<SchoolIcon
												sx={{
													mr: 1,
													color: "primary.main",
													fontSize: 18,
												}}
											/>
											<Typography
												variant="body2"
												fontWeight={500}
												sx={{ fontSize: "0.85rem" }}
											>
												{index + 1}
												{getOrdinalSuffix(
													index + 1
												)}{" "}
												Child
											</Typography>
										</Box>
									</TableCell>
									<TableCell sx={{ py: 1 }}>
										<Chip
											label={yearLevelLabels[year]}
											size="small"
											color="primary"
											variant="outlined"
											sx={{ fontSize: "0.75rem" }}
										/>
									</TableCell>
									<TableCell align="right" sx={{ py: 1 }}>
										<Box>
											<Typography
												variant="body2"
												fontWeight={500}
												sx={{ fontSize: "0.85rem" }}
											>
												{formatDollars(tuitionFee)}
											</Typography>
											{isStaffDiscount &&
												!hasConcessionCard && (
													<Typography
														variant="caption"
														color="success.main"
														sx={{
															fontSize: "0.7rem",
														}}
													>
														Staff discount
													</Typography>
												)}
											{hasConcessionCard && (
												<Typography
													variant="caption"
													color="info.main"
													sx={{ fontSize: "0.7rem" }}
												>
													Concession
												</Typography>
											)}
										</Box>
									</TableCell>
									<TableCell align="right" sx={{ py: 1 }}>
										<Typography
											variant="body2"
											sx={{ fontSize: "0.85rem" }}
										>
											{formatDollars(levy)}
										</Typography>
									</TableCell>
									{hasBusFee && (
										<TableCell align="right" sx={{ py: 1 }}>
											<Typography
												variant="body2"
												sx={{ fontSize: "0.85rem" }}
											>
												{formatDollars(childBusFee)}
											</Typography>
										</TableCell>
									)}
									<TableCell align="right" sx={{ py: 1 }}>
										<Typography
											variant="body2"
											fontWeight={600}
											sx={{ fontSize: "0.9rem" }}
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
								label="Staff Discount (10%)"
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
