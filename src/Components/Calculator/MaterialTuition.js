import {
	DirectionsBus as BusIcon,
	Calculate as CalculateIcon,
	AttachMoney as MoneyIcon,
	School as SchoolIcon,
} from "@mui/icons-material";
import {
	Alert,
	Box,
	Card,
	CardContent,
	Chip,
	Container,
	Fab,
	Grid,
	Paper,
	Step,
	StepLabel,
	Stepper,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import { formatDollars } from "../Objects/Currancy";
import {
	busFee,
	concessionFee,
	concessionFeeClare,
	FeeConfigService,
	staffDiscountPercentage,
	standardCosts,
	standardCostsClare,
	yearLevels,
} from "./Constants";
import MaterialCalculatorControls from "./MaterialCalculatorControls";
import MaterialCampusSelector from "./MaterialCampusSelector";
import MaterialFeeOutcomeTable from "./MaterialFeeOutcomeTable";
import MaterialStaffDiscount from "./MaterialStaffDiscount";

const MaterialTuition = (props) => {
	const theme = useTheme();
	const isMobile = useMediaQuery("(max-width:1360px)");

	const [children, setChildren] = useState([""]);
	const [hasConcessionCard, setHasConcessionCard] = useState(false);
	const [hasBusFee, setHasBusFee] = useState(false);
	const [total, setTotal] = useState(0);
	const totalRef = useRef(null);
	const [sortedChildren, setSortedChildren] = useState([]);
	const [isStaffDiscount, setIsStaffDiscount] = useState(false);
	const [campus, setCampus] = useState(props.campus);
	const [activeStep, setActiveStep] = useState(0);

	const steps = ["Select Year Levels", "Choose Options", "View Results"];

	const getClearLevy = (yearLevel) => {
		// Use dynamic resource fees from configuration
		return FeeConfigService.getResourceFeeForYear(yearLevel);
	};

	const addChild = () => {
		setChildren([...children, ""]);
	};

	const updateChildYear = (year, index) => {
		const newChildren = [...children];
		newChildren[index] = year;
		setChildren(newChildren);
		const sorted = calculateTotal(
			newChildren,
			hasConcessionCard,
			hasBusFee
		);
		setSortedChildren(sorted);

		// Auto advance to next step if we have at least one child selected
		if (year && activeStep === 0) {
			setActiveStep(1);
		}
	};

	const removeChild = (index) => {
		if (children.length > 1) {
			const newChildren = children.filter((_, i) => i !== index);
			setChildren(newChildren);
			const sorted = calculateTotal(
				newChildren,
				hasConcessionCard,
				hasBusFee
			);
			setSortedChildren(sorted);
		}
	};

	const calculateTotal = useCallback(
		(childrenYears, concession, bus, staffDiscount) => {
			let newTotal = 0;
			const sortedChildren = [...childrenYears]
				.filter(Boolean)
				.sort((a, b) => yearLevels.indexOf(b) - yearLevels.indexOf(a));

			sortedChildren.forEach((year, index) => {
				if (year) {
					// Only first 3 children get tuition fees
					if (index < 3) {
						let costs = concession
							? (campus === 0
									? concessionFee
									: concessionFeeClare)[year]
							: (campus === 0
									? standardCosts
									: standardCostsClare)[year];

						if (staffDiscount && !concession) {
							costs = costs.map(
								(cost) => cost * staffDiscountPercentage
							);
						}

						newTotal += costs[Math.min(index, 2)] || 0;
					}

					// All children get resource fees (levy)
					newTotal += getClearLevy(year);
				}

				// Only first 3 children get bus fees
				if (bus && index < 3) {
					if (index === 0) newTotal += busFee.child1;
					else if (index === 1) newTotal += busFee.child2;
					else if (index === 2) newTotal += busFee.child3;
				}
			});

			setTotal(newTotal);
			return sortedChildren;
		},
		[campus]
	);

	const handleConcessionChange = (checked) => {
		if (!isStaffDiscount) {
			setHasConcessionCard(checked);
			calculateTotal(children, checked, hasBusFee);
			if (activeStep === 1 && (checked || hasBusFee)) {
				setActiveStep(2);
			}
		} else {
			setHasConcessionCard(false);
		}
	};

	const handleBusFeeChange = (checked) => {
		setHasBusFee(checked);
		calculateTotal(children, hasConcessionCard, checked);
		if (activeStep === 1 && (checked || hasConcessionCard)) {
			setActiveStep(2);
		}
	};

	const resetCalculator = () => {
		setChildren([""]);
		setHasConcessionCard(false);
		setHasBusFee(false);
		setIsStaffDiscount(false);
		setTotal(0);
		setSortedChildren([]);
		setActiveStep(0);
		calculateTotal([""], false, false, false);
	};

	const handleCampusChange = (newCampus) => {
		setCampus(newCampus);
		props.onSetCampus(newCampus);
	};

	const handleStaffDiscountChange = (checked) => {
		setIsStaffDiscount(checked);
		if (hasConcessionCard) {
			setHasConcessionCard(false);
		}
		calculateTotal(children, hasConcessionCard, hasBusFee, checked);
	};

	const animatedProps = useSpring({
		total: total,
		from: { total: 0 },
		onRest: () => {
			if (totalRef.current) {
				totalRef.current.classList.add("pop-effect");
				setTimeout(() => {
					if (totalRef.current) {
						totalRef.current.classList.remove("pop-effect");
					}
				}, 300);
			}
		},
	});

	useEffect(() => {
		setCampus(props.campus || 0);
	}, [props.campus]);

	useEffect(() => {
		calculateTotal(children, hasConcessionCard, hasBusFee, isStaffDiscount);
	}, [
		calculateTotal,
		campus,
		children,
		hasBusFee,
		hasConcessionCard,
		isStaffDiscount,
	]);

	return (
		<Container maxWidth="xl" sx={{ pt: { xs: 12, md: 14 }, pb: 4 }}>
			{/* Header Section */}
			<Paper
				elevation={2}
				sx={{
					p: 4,
					mb: 4,
					background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
					textAlign: "center",
				}}
			>
				<SchoolIcon
					sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
				/>
				<Typography variant="h3" component="h1" gutterBottom>
					Fee Calculator
				</Typography>
				<Typography variant="h5" color="text.secondary" gutterBottom>
					{campus === 0 ? "Balaklava Campus" : "Clare Campus"}
				</Typography>
				<Typography variant="body1" sx={{ maxWidth: 600, mx: "auto" }}>
					Calculate school fees for your children. This simple tool
					will help you understand the total cost for the school year.
				</Typography>
			</Paper>

			{/* Campus Switch */}
			<MaterialCampusSelector
				campus={campus}
				onCampusChange={handleCampusChange}
			/>

			{/* Progress Stepper */}
			{!isMobile && (
				<Paper elevation={1} sx={{ p: 3, mb: 4 }}>
					<Stepper activeStep={activeStep} alternativeLabel>
						{steps.map((label, index) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
				</Paper>
			)}

			{/* Main Calculator Grid */}
			<Grid container spacing={4}>
				{/* Left Column - Calculator Controls */}
				<Grid item xs={12} {...(isMobile ? {} : { xl: 4 })}>
					<Card sx={{ height: "100%" }}>
						<CardContent sx={{ p: 3 }}>
							<Box display="flex" alignItems="center" mb={3}>
								<CalculateIcon
									sx={{ mr: 2, color: "primary.main" }}
								/>
								<Typography
									variant="h5"
									component="h2"
									fontWeight={600}
								>
									Calculator
								</Typography>
							</Box>

							<MaterialCalculatorControls
								children={children}
								updateChildYear={updateChildYear}
								addChild={addChild}
								removeChild={removeChild}
								hasConcessionCard={hasConcessionCard}
								handleConcessionChange={handleConcessionChange}
								handleBusFeeChange={handleBusFeeChange}
								hasBusFee={hasBusFee}
								resetCalculator={resetCalculator}
								isStaffDiscount={isStaffDiscount}
								onStepChange={setActiveStep}
							/>

							<MaterialStaffDiscount
								handleStaffDiscountChange={
									handleStaffDiscountChange
								}
								isStaffDiscount={isStaffDiscount}
								hasConcessionCard={hasConcessionCard}
							/>
						</CardContent>
					</Card>
				</Grid>

				{/* Right Column - Fee Breakdown */}
				<Grid item xs={12} {...(isMobile ? {} : { xl: 8 })}>
					<Card sx={{ height: "100%" }}>
						<CardContent sx={{ p: 3 }}>
							<Box display="flex" alignItems="center" mb={3}>
								<MoneyIcon
									sx={{ mr: 2, color: "secondary.main" }}
								/>
								<Typography
									variant="h5"
									component="h2"
									fontWeight={600}
								>
									Fee Breakdown
								</Typography>
							</Box>

							<MaterialFeeOutcomeTable
								getClearLevy={getClearLevy}
								sortedChildren={sortedChildren}
								formatDollars={formatDollars}
								hasConcessionCard={hasConcessionCard}
								concessionFee={concessionFee}
								concessionFeeClare={concessionFeeClare}
								hasBusFee={hasBusFee}
								busFee={busFee}
								standardCosts={standardCosts}
								standardCostsClare={standardCostsClare}
								animatedProps={animatedProps}
								totalRef={totalRef}
								campus={campus}
								animated={animated}
								isStaffDiscount={isStaffDiscount}
							/>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Summary Section */}
			{sortedChildren.length > 0 && total > 0 && (
				<Paper
					elevation={4}
					sx={{
						mt: 4,
						p: 4,
						background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
						color: "white",
						textAlign: "center",
					}}
				>
					<Typography variant="h4" gutterBottom>
						Annual School Fees Summary
					</Typography>
					<Box
						display="flex"
						justifyContent="center"
						flexWrap="wrap"
						gap={2}
						mb={3}
					>
						<Chip
							icon={<SchoolIcon />}
							label={`${sortedChildren.length} ${
								sortedChildren.length === 1
									? "Child"
									: "Children"
							}`}
							sx={{
								bgcolor: "rgba(255,255,255,0.2)",
								color: "white",
							}}
						/>
						{hasConcessionCard && (
							<Chip
								label="Concession Card Applied"
								sx={{
									bgcolor: "rgba(255,255,255,0.2)",
									color: "white",
								}}
							/>
						)}
						{hasBusFee && (
							<Chip
								icon={<BusIcon />}
								label="Bus Transport Included"
								sx={{
									bgcolor: "rgba(255,255,255,0.2)",
									color: "white",
								}}
							/>
						)}
						{isStaffDiscount && (
							<Chip
								label="Staff Discount Applied"
								sx={{
									bgcolor: "rgba(255,255,255,0.2)",
									color: "white",
								}}
							/>
						)}
					</Box>
					<Typography variant="h3" fontWeight={700} ref={totalRef}>
						<animated.span>
							{animatedProps.total.to((val) =>
								formatDollars(Math.round(val))
							)}
						</animated.span>
					</Typography>
					<Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
						Total annual school fees for{" "}
						{campus === 0 ? "Balaklava" : "Clare"} Campus
					</Typography>
				</Paper>
			)}

			{/* Help Section */}
			<Alert severity="info" sx={{ mt: 4 }} icon={<SchoolIcon />}>
				<Typography variant="h6" gutterBottom>
					Need Help Understanding Your Fees?
				</Typography>
				<Typography variant="body2">
					If you have questions about school fees or need assistance
					with your calculation, please contact our school office.
					We're here to help make Christian education accessible for
					your family.
				</Typography>
			</Alert>

			{/* Floating Action Button for Mobile Reset */}
			{isMobile && (
				<Fab
					color="secondary"
					aria-label="reset"
					onClick={resetCalculator}
					sx={{
						position: "fixed",
						bottom: 16,
						right: 16,
						zIndex: 1000,
					}}
				>
					<CalculateIcon />
				</Fab>
			)}
		</Container>
	);
};

export default MaterialTuition;
