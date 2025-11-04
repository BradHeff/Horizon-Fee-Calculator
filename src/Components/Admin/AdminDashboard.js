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
				position="sticky"
				sx={{
					background: `linear-gradient(135deg, 
						${theme.palette.primary.main}e6 0%, 
						${theme.palette.primary.dark}f0 50%, 
						${theme.palette.secondary.main}20 100%)`,
					backdropFilter: "blur(20px)",
					boxShadow: "0 8px 32px rgba(46, 93, 74, 0.3)",
				}}
			>
				<Toolbar>
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
							sx={{
								width: 40,
								height: 40,
								bgcolor: "secondary.main",
								color: "primary.dark",
							}}
						>
							<AdminIcon />
						</Avatar>
						<Box>
							<Typography variant="h6" fontWeight={600}>
								Admin Dashboard
							</Typography>
							<Typography variant="caption" sx={{ opacity: 0.8 }}>
								Horizon Fee Administration
							</Typography>
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
									backgroundColor: "rgba(255, 255, 255, 0.1)",
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
									backgroundColor: "rgba(255, 255, 255, 0.1)",
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
									backgroundColor: theme.palette.error.main,
								},
							}}
						>
							<LogoutIcon sx={{ mr: 1 }} />
							Logout
						</MenuItem>
					</Menu>
				</Toolbar>
			</AppBar>

			{/* Main Content */}
			<Container maxWidth="xl" sx={{ py: 4 }}>
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
