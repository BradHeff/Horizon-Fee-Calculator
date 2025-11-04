import { Box, Typography, useTheme } from "@mui/material";

const MaterialFooter = () => {
	const theme = useTheme();

	return (
		<Box
			component="footer"
			sx={{
				mt: "auto",
				py: 2,
				px: 2,
				borderTop: `1px solid ${theme.palette.divider}`,
				backgroundColor: theme.palette.background.paper,
				textAlign: "center",
			}}
		>
			<Typography
				variant="body2"
				color="text.secondary"
				sx={{ fontSize: "0.875rem" }}
			>
				© {new Date().getFullYear()} Horizon Christian School - Fee
				Calculator
			</Typography>
		</Box>
	);
};

export default MaterialFooter;
