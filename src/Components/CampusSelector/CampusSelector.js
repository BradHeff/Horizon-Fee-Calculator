import {
	ArrowForward as ArrowForwardIcon,
	LocationOn as LocationIcon,
	School as SchoolIcon,
} from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Container,
	Grid,
	Paper,
	Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
	cursor: "pointer",
	transition: "all 0.3s ease",
	height: "100%",
	position: "relative",
	overflow: "hidden",
	"&:hover": {
		transform: "translateY(-8px)",
		boxShadow: theme.shadows[8],
	},
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: "4px",
		background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
	},
}));

const HeaderSection = styled(Box)(({ theme }) => ({
	background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
	padding: theme.spacing(4),
	textAlign: "center",
	borderRadius: `${theme.shape.borderRadius}px`,
	marginBottom: theme.spacing(4),
}));

const CampusSelector = ({ onSelectCampus }) => {
	const campusData = [
		{
			id: 0,
			name: "Balaklava Campus",
			location: "Balaklava",
			description:
				"Select this option if you're enrolling at our Horizon Christian School Balaklava campus.",
			features: [
				"Reception to Year 12",
				"Established Campus",
				"Full Facilities",
			],
			color: "#2E5D4A",
		},
		{
			id: 1,
			name: "Clare Campus",
			location: "Clare Valley",
			description:
				"Select this option if you're enrolling at our Clare Valley Horizon Christian School campus.",
			features: [
				"Reception to Year 12",
				"Growing Campus",
				"Modern Facilities",
			],
			color: "#3E5F4F",
		},
	];

	return (
		<Container
			maxWidth="lg"
			sx={{
				py: 4,
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			{/* Header Section */}
			<HeaderSection>
				<Avatar
					sx={{
						width: 80,
						height: 80,
						bgcolor: "primary.main",
						mx: "auto",
						mb: 2,
						fontSize: "2rem",
					}}
				>
					<SchoolIcon fontSize="large" />
				</Avatar>
				<Typography variant="h2" component="h1" gutterBottom>
					Welcome to Horizon Christian School
				</Typography>
				<Typography variant="h5" color="text.secondary" gutterBottom>
					Fee Calculator
				</Typography>
				<Typography
					variant="body1"
					sx={{ maxWidth: 600, mx: "auto", mt: 2 }}
				>
					Please select your campus to calculate school fees. This
					tool will help you understand the costs associated with your
					child's education at Horizon Christian School.
				</Typography>
			</HeaderSection>

			{/* Campus Selection Cards */}
			<Typography
				variant="h4"
				component="h2"
				textAlign="center"
				gutterBottom
				sx={{ mb: 4 }}
			>
				Select Your Campus
			</Typography>

			<Grid container spacing={4} justifyContent="center">
				{campusData.map((campus) => (
					<Grid item xs={12} sm={6} md={5} key={campus.id}>
						<StyledCard onClick={() => onSelectCampus(campus.id)}>
							<CardContent sx={{ p: 4 }}>
								{/* Campus Header */}
								<Box display="flex" alignItems="center" mb={2}>
									<Avatar
										sx={{
											bgcolor: campus.color,
											mr: 2,
											width: 56,
											height: 56,
										}}
									>
										<SchoolIcon />
									</Avatar>
									<Box flex={1}>
										<Typography
											variant="h5"
											component="h3"
											fontWeight={600}
										>
											{campus.name}
										</Typography>
										<Box
											display="flex"
											alignItems="center"
											mt={0.5}
										>
											<LocationIcon
												color="action"
												sx={{ fontSize: 16, mr: 0.5 }}
											/>
											<Typography
												variant="body2"
												color="text.secondary"
											>
												{campus.location}
											</Typography>
										</Box>
									</Box>
								</Box>

								{/* Description */}
								<Typography
									variant="body1"
									paragraph
									sx={{ my: 3, lineHeight: 1.6 }}
								>
									{campus.description}
								</Typography>

								{/* Features */}
								<Box mb={3}>
									<Typography
										variant="subtitle2"
										gutterBottom
										fontWeight={600}
									>
										Campus Features:
									</Typography>
									<Box display="flex" flexWrap="wrap" gap={1}>
										{campus.features.map(
											(feature, index) => (
												<Chip
													key={index}
													label={feature}
													size="small"
													sx={{
														bgcolor: `${campus.color}15`,
														color: campus.color,
														fontWeight: 500,
													}}
												/>
											)
										)}
									</Box>
								</Box>

								{/* Action Button */}
								<Button
									variant="contained"
									fullWidth
									size="large"
									endIcon={<ArrowForwardIcon />}
									sx={{
										mt: 2,
										py: 1.5,
										bgcolor: campus.color,
										"&:hover": {
											bgcolor: campus.color,
											filter: "brightness(0.9)",
										},
									}}
								>
									Calculate Fees for {campus.name}
								</Button>
							</CardContent>
						</StyledCard>
					</Grid>
				))}
			</Grid>

			{/* Help Section */}
			<Paper
				elevation={1}
				sx={{
					mt: 6,
					p: 3,
					textAlign: "center",
					bgcolor: "background.accent",
				}}
			>
				<Typography variant="h6" gutterBottom>
					Need Help?
				</Typography>
				<Typography variant="body2" color="text.secondary">
					If you're unsure which campus to select or have questions
					about fees, please contact our office for assistance.
				</Typography>
				<Box mt={2}>
					<Button
						variant="outlined"
						sx={{ mr: 2 }}
						href="https://balaklava.horizon.sa.edu.au/get-in-touch/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Contact Balaklava Campus
					</Button>
					<Button
						variant="outlined"
						href="https://clare.horizon.sa.edu.au/get-in-touch/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Contact Clare Campus
					</Button>
				</Box>
			</Paper>
		</Container>
	);
};

export default CampusSelector;
