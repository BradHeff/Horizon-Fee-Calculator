import {
	AdminPanelSettings as AdminIcon,
	Lock as LockIcon,
	School as SchoolIcon,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import {
	Alert,
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Container,
	IconButton,
	InputAdornment,
	Paper,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import { useState } from "react";
import { connect } from "react-redux";
import { setLogin } from "../../reducer/action";

const AdminLogin = ({ onLogin }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const theme = useTheme();

	// Simple hardcoded credentials - in production, use proper authentication
	const ADMIN_CREDENTIALS = {
		username: "admin",
		password: "horizon2024",
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (
			username === ADMIN_CREDENTIALS.username &&
			password === ADMIN_CREDENTIALS.password
		) {
			onLogin(true);
			setError("");
		} else {
			setError("Invalid username or password");
		}
		setLoading(false);
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<Container
			maxWidth="sm"
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Paper
				elevation={8}
				sx={{
					width: "100%",
					background: `linear-gradient(135deg, 
						${theme.palette.background.paper} 0%, 
						${theme.palette.primary.main}08 100%)`,
				}}
			>
				<Card sx={{ boxShadow: "none", background: "transparent" }}>
					<CardContent sx={{ p: 4 }}>
						{/* Header */}
						<Box textAlign="center" mb={4}>
							<Avatar
								sx={{
									mx: "auto",
									mb: 2,
									width: 64,
									height: 64,
									bgcolor: "primary.main",
									background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
								}}
							>
								<AdminIcon fontSize="large" />
							</Avatar>
							<Typography
								variant="h4"
								fontWeight={700}
								gutterBottom
							>
								Admin Panel
							</Typography>
							<Typography variant="body1" color="text.secondary">
								Horizon Christian School Fee Administration
							</Typography>
						</Box>

						{/* Login Form */}
						<Box component="form" onSubmit={handleLogin}>
							<TextField
								fullWidth
								label="Username"
								variant="outlined"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								margin="normal"
								required
								autoFocus
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SchoolIcon color="action" />
										</InputAdornment>
									),
								}}
								sx={{ mb: 2 }}
							/>

							<TextField
								fullWidth
								label="Password"
								type={showPassword ? "text" : "password"}
								variant="outlined"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								margin="normal"
								required
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<LockIcon color="action" />
										</InputAdornment>
									),
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={
													handleClickShowPassword
												}
												edge="end"
											>
												{showPassword ? (
													<VisibilityOff />
												) : (
													<Visibility />
												)}
											</IconButton>
										</InputAdornment>
									),
								}}
								sx={{ mb: 3 }}
							/>

							{error && (
								<Alert severity="error" sx={{ mb: 2 }}>
									{error}
								</Alert>
							)}

							<Button
								type="submit"
								fullWidth
								variant="contained"
								size="large"
								disabled={loading}
								sx={{
									py: 1.5,
									background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
									"&:hover": {
										background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
									},
								}}
							>
								{loading ? "Signing In..." : "Sign In"}
							</Button>
						</Box>

						{/* Help Text */}
						<Box mt={4} textAlign="center">
							<Typography
								variant="caption"
								color="text.secondary"
							>
								For password assistance, contact IT support
							</Typography>
						</Box>

						{/* Development Note */}
						<Box mt={2} p={2} bgcolor="warning.50" borderRadius={1}>
							<Typography variant="caption" color="warning.main">
								<strong>Demo Credentials:</strong> admin /
								horizon2024
							</Typography>
						</Box>
					</CardContent>
				</Card>
			</Paper>
		</Container>
	);
};

const mapDispatchToProps = (dispatch) => {
	return {
		onLogin: (status) => dispatch(setLogin(status)),
	};
};

export default connect(null, mapDispatchToProps)(AdminLogin);
