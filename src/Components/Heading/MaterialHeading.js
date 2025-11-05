import {
	AdminPanelSettings as AdminIcon,
	Home as HomeIcon,
	LocationOn as LocationIcon,
	Menu as MenuIcon,
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
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/icon.png";

const MaterialHeading = (props) => {
	const [anchorElNav, setAnchorElNav] = useState(null);
	const theme = useTheme();
	const isMobile = useMediaQuery("(max-width:1360px)");
	const navigate = useNavigate();

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleNavigation = (item) => {
		if (item.external) {
			window.open(item.url, "_blank", "noopener,noreferrer");
		} else {
			navigate(item.url);
		}
	};

	const campusInfo = {
		name: props.campus === 0 ? "Balaklava" : "Clare",
		url:
			props.campus === 0
				? "https://balaklava.horizon.sa.edu.au/"
				: "https://clare.horizon.sa.edu.au/",
	};

	const navItems = [
		{
			label: "Home",
			icon: <HomeIcon />,
			url: campusInfo.url,
			external: true,
		},
		{
			label: "Admin",
			icon: <AdminIcon />,
			url: "/admin",
			external: false,
		},
	];

	return (
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
				borderRadius: isMobile ? 0 : "0 0 24px 24px",
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
					{/* Desktop Logo and Brand */}
					<Box
						sx={{
							display: { xs: "none", md: "flex" },
							alignItems: "center",
							gap: 2,
						}}
					>
						<Avatar
							src={Logo}
							alt="Horizon Christian School"
							sx={{
								width: 48,
								height: 48,
								border: `2px solid ${theme.palette.secondary.main}`,
								boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
							}}
						/>
						<Box>
							<Typography
								variant="h5"
								component="div"
								sx={{
									fontWeight: 700,
									color: "white",
									textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
									lineHeight: 1.2,
								}}
							>
								Horizon Fee Calculator
							</Typography>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									mt: 0.5,
								}}
							>
								<LocationIcon
									sx={{
										fontSize: 16,
										color: theme.palette.secondary.main,
									}}
								/>
								<Chip
									label={`${campusInfo.name} Campus`}
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

					{/* Mobile Logo */}
					<Box
						sx={{
							display: { xs: "flex", md: "none" },
							alignItems: "center",
							gap: 1.5,
						}}
					>
						<Avatar
							src={Logo}
							alt="Horizon Christian School"
							sx={{
								width: 40,
								height: 40,
								border: `2px solid ${theme.palette.secondary.main}`,
							}}
						/>
						<Box>
							<Typography
								variant="h6"
								component="div"
								sx={{
									fontWeight: 700,
									color: "white",
									textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
									lineHeight: 1.1,
								}}
							>
								Fee Calculator
							</Typography>
							<Chip
								label={campusInfo.name}
								size="small"
								sx={{
									backgroundColor:
										theme.palette.secondary.main,
									color: theme.palette.primary.dark,
									fontWeight: 600,
									fontSize: "0.7rem",
									height: 20,
									mt: 0.5,
								}}
							/>
						</Box>
					</Box>

					{/* Desktop Navigation */}
					<Box
						sx={{
							display: { xs: "none", md: "flex" },
							alignItems: "center",
							gap: 2,
						}}
					>
						{navItems.map((item, index) => (
							<Button
								key={index}
								onClick={() => handleNavigation(item)}
								startIcon={item.icon}
								sx={{
									color: "white",
									fontWeight: 600,
									textTransform: "none",
									px: 3,
									py: 1.5,
									borderRadius: "50px",
									backgroundColor: "rgba(255, 255, 255, 0.1)",
									border: `1px solid rgba(255, 255, 255, 0.2)`,
									backdropFilter: "blur(10px)",
									transition: "all 0.3s ease",
									"&:hover": {
										backgroundColor:
											theme.palette.secondary.main,
										color: theme.palette.primary.dark,
										transform: "translateY(-2px)",
										boxShadow:
											"0 8px 20px rgba(244, 185, 66, 0.3)",
									},
								}}
							>
								{item.label}
							</Button>
						))}
					</Box>

					{/* Mobile Menu */}
					<Box sx={{ display: { xs: "flex", md: "none" } }}>
						<IconButton
							size="large"
							aria-label="navigation menu"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							sx={{
								color: "white",
								backgroundColor: "rgba(255, 255, 255, 0.1)",
								border: `1px solid rgba(255, 255, 255, 0.2)`,
								"&:hover": {
									backgroundColor:
										theme.palette.secondary.main,
									color: theme.palette.primary.dark,
								},
							}}
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: "block", md: "none" },
								"& .MuiPaper-root": {
									backgroundColor: theme.palette.primary.main,
									backdropFilter: "blur(20px)",
									borderRadius: 2,
									border: `1px solid ${theme.palette.secondary.main}30`,
									mt: 1,
								},
							}}
						>
							{navItems.map((item, index) => (
								<MenuItem
									key={index}
									onClick={() => {
										handleNavigation(item);
										handleCloseNavMenu();
									}}
									sx={{
										color: "white",
										py: 1.5,
										px: 3,
										"&:hover": {
											backgroundColor:
												theme.palette.secondary.main,
											color: theme.palette.primary.dark,
										},
									}}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1,
										}}
									>
										{item.icon}
										<Typography>{item.label}</Typography>
									</Box>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default MaterialHeading;
