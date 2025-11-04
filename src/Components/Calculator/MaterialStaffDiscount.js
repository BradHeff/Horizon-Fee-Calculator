import { Work as WorkIcon } from "@mui/icons-material";
import {
	Alert,
	Box,
	FormControlLabel,
	Paper,
	Switch,
	Typography,
} from "@mui/material";

const MaterialStaffDiscount = ({
	handleStaffDiscountChange,
	isStaffDiscount,
	hasConcessionCard,
}) => {
	return (
		<Box mt={3}>
			<Paper
				variant="outlined"
				sx={{
					p: 2,
					border: "2px dashed",
					borderColor: isStaffDiscount ? "success.main" : "grey.300",
					bgcolor: isStaffDiscount
						? "success.50"
						: "background.paper",
				}}
			>
				<FormControlLabel
					control={
						<Switch
							checked={isStaffDiscount}
							onChange={(event) =>
								handleStaffDiscountChange(event.target.checked)
							}
							color="success"
						/>
					}
					label={
						<Box display="flex" alignItems="center">
							<WorkIcon sx={{ mr: 1, color: "success.main" }} />
							<Box>
								<Typography variant="body1" fontWeight={500}>
									Staff Member Discount
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									25% discount for Horizon Christian School
									staff members
								</Typography>
							</Box>
						</Box>
					}
				/>

				{isStaffDiscount && (
					<Alert
						severity="success"
						sx={{ mt: 2, fontSize: "0.875rem" }}
					>
						<Typography variant="body2">
							<strong>Staff Discount Applied:</strong> 25%
							reduction on tuition fees. This discount cannot be
							combined with concession card discounts.
						</Typography>
					</Alert>
				)}

				{hasConcessionCard && (
					<Alert
						severity="warning"
						sx={{ mt: 2, fontSize: "0.875rem" }}
					>
						<Typography variant="body2">
							Staff discount cannot be combined with concession
							card discounts. Please choose the option that
							provides the best value for your family.
						</Typography>
					</Alert>
				)}
			</Paper>

			<Typography
				variant="caption"
				color="text.secondary"
				sx={{ mt: 1, display: "block" }}
			>
				Staff discount eligibility requires verification with the school
				office.
			</Typography>
		</Box>
	);
};

export default MaterialStaffDiscount;
