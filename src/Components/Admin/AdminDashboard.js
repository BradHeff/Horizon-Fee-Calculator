import {
	AdminPanelSettings as AdminIcon,
	Dashboard as DashboardIcon,
	Home as HomeIcon,
	ExitToApp as LogoutIcon,
	Settings as SettingsIcon,
} from "@mui/icons-material";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Chip,
	Container,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
	useTheme,
} from "@mui/material";
import { useState } from "react";
import { connect } from "react-redux";
import Logo from "../../assets/images/icon.png";
import { setLogin } from "../../reducer/action";
import FeeAdministration from "./FeeAdministration";

const AdminDashboard = ({ onLogout }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const theme = useTheme();

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleProfileMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		onLogout(false);
		handleProfileMenuClose();
	};

	const handleGoHome = () => {
		window.location.href = "/";
	};

	return (
		<Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
			{/* Admin Navigation Bar */}
			<AppBar
				position="fixed"
				sx={{
					background: `linear-gradient(135deg, 
						${theme.palette.primary.main}e6 0%, 
						${theme.palette.primary.dark}f0 50%, 
						${theme.palette.secondary.main}20 100%)`,
					backdropFilter: "blur(20px)",
					boxShadow: "0 8px 32px rgba(46, 93, 74, 0.3)",
					border: `1px solid ${theme.palette.primary.main}30`,
					borderRadius: "0 0 24px 24px",
					top: 0,
					left: 0,
					right: 0,
					zIndex: 1200,
				}}
			>
				<Container maxWidth="xl">
					<Toolbar
						disableGutters
						sx={{
							minHeight: { xs: 64, md: 80 },
							justifyContent: "space-between",
						}}
					>
						{/* Logo and Title */}
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 2,
								flexGrow: 1,
							}}
						>
							<Avatar
								src={Logo}
								alt="Horizon Christian School"
								sx={{
									width: { xs: 40, md: 48 },
									height: { xs: 40, md: 48 },
									border: `2px solid ${theme.palette.secondary.main}`,
									boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
								}}
							/>
							<Box>
								<Typography
									variant={{ xs: "h6", md: "h5" }}
									component="div"
									sx={{
										fontWeight: 700,
										color: "white",
										textShadow:
											"2px 2px 4px rgba(0,0,0,0.3)",
										lineHeight: 1.2,
									}}
								>
									Admin Dashboard
								</Typography>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1,
										mt: 0.5,
									}}
								>
									<AdminIcon
										sx={{
											fontSize: 16,
											color: theme.palette.secondary.main,
										}}
									/>
									<Chip
										label="Fee Administration"
										size="small"
										sx={{
											backgroundColor:
												theme.palette.secondary.main,
											color: theme.palette.primary.dark,
											fontWeight: 600,
											fontSize: "0.75rem",
											height: 24,
										}}
									/>
								</Box>
							</Box>
						</Box>

						{/* Home Button */}
						<Button
							color="inherit"
							startIcon={<HomeIcon />}
							onClick={handleGoHome}
							sx={{
								mr: 2,
								"&:hover": {
									backgroundColor: "rgba(255, 255, 255, 0.1)",
								},
							}}
						>
							Back to Calculator
						</Button>

						{/* Profile Menu */}
						<IconButton
							size="large"
							edge="end"
							aria-label="admin account"
							aria-controls="profile-menu"
							aria-haspopup="true"
							onClick={handleProfileMenuOpen}
							sx={{
								color: "white",
								backgroundColor: "rgba(255, 255, 255, 0.1)",
								"&:hover": {
									backgroundColor: "rgba(255, 255, 255, 0.2)",
								},
							}}
						>
							<Avatar
								sx={{
									width: 32,
									height: 32,
									bgcolor: "secondary.main",
									color: "primary.dark",
									fontSize: "0.875rem",
								}}
							>
								A
							</Avatar>
						</IconButton>
						<Menu
							id="profile-menu"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorEl)}
							onClose={handleProfileMenuClose}
							sx={{
								"& .MuiPaper-root": {
									backgroundColor: theme.palette.primary.main,
									backdropFilter: "blur(20px)",
									borderRadius: 2,
									border: `1px solid ${theme.palette.secondary.main}30`,
									mt: 1,
								},
							}}
						>
							<MenuItem
								onClick={handleProfileMenuClose}
								sx={{
									color: "white",
									"&:hover": {
										backgroundColor:
											"rgba(255, 255, 255, 0.1)",
									},
								}}
							>
								<DashboardIcon sx={{ mr: 1 }} />
								Dashboard
							</MenuItem>
							<MenuItem
								onClick={handleProfileMenuClose}
								sx={{
									color: "white",
									"&:hover": {
										backgroundColor:
											"rgba(255, 255, 255, 0.1)",
									},
								}}
							>
								<SettingsIcon sx={{ mr: 1 }} />
								Settings
							</MenuItem>
							<MenuItem
								onClick={handleLogout}
								sx={{
									color: "white",
									"&:hover": {
										backgroundColor:
											theme.palette.error.main,
									},
								}}
							>
								<LogoutIcon sx={{ mr: 1 }} />
								Logout
							</MenuItem>
						</Menu>
					</Toolbar>
				</Container>
			</AppBar>

			{/* Main Content */}
			<Container maxWidth="xl" sx={{ py: 4, pt: { xs: 10, md: 12 } }}>
				<FeeAdministration />
			</Container>
		</Box>
	);
};

const mapDispatchToProps = (dispatch) => {
	return {
		onLogout: (status) => dispatch(setLogin(status)),
	};
};

export default connect(null, mapDispatchToProps)(AdminDashboard);
