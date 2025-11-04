import {
	LocationOn as LocationIcon,
	SwapHoriz as SwapIcon,
} from "@mui/icons-material";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

const MaterialCampusSelector = ({ campus, onCampusChange }) => {
	const campusData = [
		{
			id: 0,
			name: "Balaklava Campus",
			shortName: "Balaklava",
			location: "Balaklava",
			color: "#2E5D4A",
		},
		{
			id: 1,
			name: "Clare Campus",
			shortName: "Clare",
			location: "Clare Valley",
			color: "#3E5F4F",
		},
	];

	return (
		<Card sx={{ mb: 4 }}>
			<CardContent sx={{ p: 3 }}>
				<Box
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					flexWrap="wrap"
					gap={2}
				>
					<Box display="flex" alignItems="center" gap={2}>
						<SwapIcon color="primary" />
						<Box>
							<Typography variant="h6" fontWeight={600}>
								Campus Selection
							</Typography>
							<Box display="flex" alignItems="center" gap={1}>
								<LocationIcon fontSize="small" color="action" />
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Currently calculating for:{" "}
									{
										campusData.find((c) => c.id === campus)
											?.name
									}
								</Typography>
							</Box>
						</Box>
					</Box>

					<Box display="flex" gap={2} flexWrap="wrap">
						{campusData.map((campusOption) => (
							<Button
								key={campusOption.id}
								variant={
									campus === campusOption.id
										? "contained"
										: "outlined"
								}
								onClick={() => onCampusChange(campusOption.id)}
								startIcon={<LocationIcon />}
								sx={{
									minWidth: 140,
									bgcolor:
										campus === campusOption.id
											? campusOption.color
											: "transparent",
									borderColor: campusOption.color,
									color:
										campus === campusOption.id
											? "white"
											: campusOption.color,
									"&:hover": {
										bgcolor:
											campus === campusOption.id
												? campusOption.color
												: `${campusOption.color}15`,
										borderColor: campusOption.color,
									},
								}}
							>
								{campusOption.shortName}
							</Button>
						))}
					</Box>
				</Box>

				{/* Campus Info */}
				<Box mt={2} p={2} bgcolor="background.accent" borderRadius={2}>
					<Typography variant="body2" color="text.secondary">
						<strong>Note:</strong> Fees may vary between campuses.
						Make sure you've selected the correct campus for
						accurate fee calculations. You can switch between
						campuses at any time.
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
};

export default MaterialCampusSelector;
