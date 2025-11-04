import {
	Add as AddIcon,
	DirectionsBus as BusIcon,
	Help as HelpIcon,
	Refresh as RefreshIcon,
	Remove as RemoveIcon,
	School as SchoolIcon,
} from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	Divider,
	FormControl,
	FormControlLabel,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Switch,
	Tooltip,
	Typography,
} from "@mui/material";
import { yearLevels } from "./Constants";

const MaterialCalculatorControls = ({
	children,
	updateChildYear,
	addChild,
	removeChild,
	hasConcessionCard,
	handleConcessionChange,
	handleBusFeeChange,
	hasBusFee,
	resetCalculator,
	isStaffDiscount,
	onStepChange,
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

	const getOrdinalNumber = (num) => {
		const suffixes = ["th", "st", "nd", "rd"];
		const v = num % 100;
		// Handle special cases for 11, 12, 13 which should be "th"
		if (v >= 11 && v <= 13) {
			return num + "th";
		}
		// Use the last digit for all other cases
		const lastDigit = num % 10;
		return num + (suffixes[lastDigit] || suffixes[0]);
	};

	const handleYearChange = (year, index) => {
		updateChildYear(year, index);
		if (year && onStepChange) {
			onStepChange(1);
		}
	};

	const handleOptionChange = (type, checked) => {
		if (type === "concession") {
			handleConcessionChange(checked);
		} else if (type === "bus") {
			handleBusFeeChange(checked);
		}

		if (onStepChange && (checked || hasConcessionCard || hasBusFee)) {
			onStepChange(2);
		}
	};

	return (
		<Box>
			{/* Year Level Selection */}
			<Box mb={4}>
				<Box display="flex" alignItems="center" mb={2}>
					<SchoolIcon sx={{ mr: 1, color: "primary.main" }} />
					<Typography variant="h6" fontWeight={600}>
						Children's Year Levels
					</Typography>
					<Tooltip title="Select the year level for each child attending school">
						<IconButton size="small" sx={{ ml: 1 }}>
							<HelpIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</Box>

				<Typography variant="body2" color="text.secondary" paragraph>
					Select the year level for each child. You can add up to 3
					children.
				</Typography>

				{children.map((child, index) => (
					<Box key={index} mb={2}>
						<Box display="flex" alignItems="center" gap={2}>
							<FormControl fullWidth variant="outlined">
								<InputLabel id={`child-${index}-label`}>
									{getOrdinalNumber(index + 1)} Child's Year
									Level
								</InputLabel>
								<Select
									labelId={`child-${index}-label`}
									value={child}
									onChange={(e) =>
										handleYearChange(e.target.value, index)
									}
									label={`${getOrdinalNumber(
										index + 1
									)} Child's Year Level`}
								>
									<MenuItem value="">
										<em>Please select a year level</em>
									</MenuItem>
									{yearLevels.map((year) => (
										<MenuItem key={year} value={year}>
											{yearLevelLabels[year]}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							{children.length > 1 && (
								<Tooltip title="Remove this child">
									<IconButton
										onClick={() => removeChild(index)}
										color="error"
										sx={{ flexShrink: 0 }}
									>
										<RemoveIcon />
									</IconButton>
								</Tooltip>
							)}
						</Box>
					</Box>
				))}

				<Box display="flex" gap={2} mt={2}>
					{children.length < 3 && (
						<Button
							variant="outlined"
							startIcon={<AddIcon />}
							onClick={addChild}
							size="large"
						>
							Add Another Child
						</Button>
					)}

					<Button
						variant="outlined"
						startIcon={<RefreshIcon />}
						onClick={resetCalculator}
						color="secondary"
					>
						Reset Calculator
					</Button>
				</Box>
			</Box>

			<Divider sx={{ my: 3 }} />

			{/* Fee Options */}
			<Box mb={3}>
				<Typography variant="h6" fontWeight={600} gutterBottom>
					Fee Options
				</Typography>
				<Typography variant="body2" color="text.secondary" paragraph>
					Select any applicable discounts or additional services.
				</Typography>

				<Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
					<FormControlLabel
						control={
							<Switch
								checked={hasConcessionCard}
								onChange={(e) =>
									handleOptionChange(
										"concession",
										e.target.checked
									)
								}
								disabled={isStaffDiscount}
								color="primary"
							/>
						}
						label={
							<Box>
								<Typography variant="body1" fontWeight={500}>
									Concession Card Holder
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Reduced fees for families with a valid
									concession card
								</Typography>
							</Box>
						}
					/>
					{isStaffDiscount && (
						<Alert
							severity="info"
							sx={{ mt: 1, fontSize: "0.875rem" }}
						>
							Staff discount cannot be combined with concession
							card discounts.
						</Alert>
					)}
				</Paper>

				<Paper variant="outlined" sx={{ p: 2 }}>
					<FormControlLabel
						control={
							<Switch
								checked={hasBusFee}
								onChange={(e) =>
									handleOptionChange("bus", e.target.checked)
								}
								color="primary"
							/>
						}
						label={
							<Box display="flex" alignItems="center">
								<BusIcon
									sx={{ mr: 1, color: "primary.main" }}
								/>
								<Box>
									<Typography
										variant="body1"
										fontWeight={500}
									>
										Bus Transportation
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Add bus fees for school transport
										services
									</Typography>
								</Box>
							</Box>
						}
					/>
				</Paper>
			</Box>

			{/* Instructions */}
			{children.every((child) => !child) && (
				<Alert severity="info" icon={<SchoolIcon />}>
					<Typography variant="body2">
						<strong>Getting Started:</strong> Select year levels for
						your children to see their school fees. The calculator
						will automatically update as you make selections.
					</Typography>
				</Alert>
			)}
		</Box>
	);
};

export default MaterialCalculatorControls;
