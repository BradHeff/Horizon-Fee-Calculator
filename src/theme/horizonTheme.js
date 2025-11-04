import { createTheme } from "@mui/material/styles";

// Horizon Christian School Brand Colors
const horizonColors = {
	primary: {
		main: "#2E5D4A", // Deep forest green (from logo)
		light: "#4A8B3B", // Lighter green
		dark: "#1A3429", // Darker green
		contrastText: "#FFFFFF",
	},
	secondary: {
		main: "#F4B942", // Golden yellow (from logo)
		light: "#F6C142", // Lighter yellow
		dark: "#E6A832", // Darker yellow
		contrastText: "#1A3429",
	},
	success: {
		main: "#28A745",
		light: "#34CE57",
		dark: "#1E7E34",
	},
	warning: {
		main: "#FFC107",
		light: "#FFD54F",
		dark: "#FF8F00",
	},
	error: {
		main: "#DC3545",
		light: "#FF6B6B",
		dark: "#C82333",
	},
	info: {
		main: "#17A2B8",
		light: "#58D3E8",
		dark: "#117A8B",
	},
	background: {
		default: "#FAF7F2", // Warm cream background
		paper: "#FFFFFF",
		accent: "#E8F4E8", // Light green background
	},
	text: {
		primary: "#1A3429", // Dark green for main text
		secondary: "#495057", // Gray for secondary text
		disabled: "#6C757D",
	},
	divider: "#DEE2E6",
	grey: {
		50: "#F8F9FA",
		100: "#F8F9FA",
		200: "#E9ECEF",
		300: "#DEE2E6",
		400: "#CED4DA",
		500: "#6C757D",
		600: "#495057",
		700: "#343A40",
		800: "#212529",
		900: "#1A3429",
	},
};

// Base theme configuration
const baseTheme = createTheme({
	palette: horizonColors,
	typography: {
		fontFamily: [
			"Poppins",
			"Montserrat",
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Arial",
			"sans-serif",
		].join(","),

		// Large, readable sizes for parents
		h1: {
			fontSize: "2.5rem",
			fontWeight: 700,
			fontFamily: "Montserrat, sans-serif",
			color: "#1A3429",
			lineHeight: 1.2,
		},
		h2: {
			fontSize: "2rem",
			fontWeight: 600,
			fontFamily: "Montserrat, sans-serif",
			color: "#1A3429",
			lineHeight: 1.3,
		},
		h3: {
			fontSize: "1.75rem",
			fontWeight: 600,
			fontFamily: "Montserrat, sans-serif",
			color: "#1A3429",
			lineHeight: 1.4,
		},
		h4: {
			fontSize: "1.5rem",
			fontWeight: 500,
			color: "#1A3429",
			lineHeight: 1.4,
		},
		h5: {
			fontSize: "1.25rem",
			fontWeight: 500,
			color: "#1A3429",
			lineHeight: 1.5,
		},
		h6: {
			fontSize: "1.125rem",
			fontWeight: 500,
			color: "#1A3429",
			lineHeight: 1.5,
		},

		// Body text - larger for readability
		body1: {
			fontSize: "1.125rem", // Larger than default
			lineHeight: 1.6,
			color: "#1A3429",
		},
		body2: {
			fontSize: "1rem",
			lineHeight: 1.5,
			color: "#495057",
		},

		// Button text - clear and readable
		button: {
			fontSize: "1rem",
			fontWeight: 600,
			textTransform: "none", // No all-caps for better readability
		},

		// Labels and captions
		caption: {
			fontSize: "0.875rem",
			lineHeight: 1.4,
			color: "#6C757D",
		},
		overline: {
			fontSize: "0.75rem",
			fontWeight: 600,
			letterSpacing: "0.05em",
			textTransform: "uppercase",
			color: "#6C757D",
		},
	},
	spacing: 8, // 8px base spacing unit
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 960,
			lg: 1280,
			xl: 1920,
		},
	},
	shape: {
		borderRadius: 12, // More rounded corners for friendlier appearance
	},
});

// Create the final theme with component overrides
export const horizonTheme = createTheme(baseTheme, {
	components: {
		// Button styles (parent-friendly)
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: "12px",
					padding: "12px 24px",
					fontSize: "1rem",
					fontWeight: 600,
					textTransform: "none",
					boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
					transition: "all 0.3s ease",
					minHeight: "44px", // Touch-friendly size
					"&:hover": {
						transform: "translateY(-2px)",
						boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
					},
				},
				containedPrimary: {
					backgroundColor: baseTheme.palette.primary.main,
					"&:hover": {
						backgroundColor: baseTheme.palette.primary.dark,
					},
				},
				containedSecondary: {
					backgroundColor: baseTheme.palette.secondary.main,
					color: baseTheme.palette.text.primary,
					"&:hover": {
						backgroundColor: baseTheme.palette.secondary.dark,
					},
				},
				outlinedPrimary: {
					borderColor: baseTheme.palette.primary.main,
					color: baseTheme.palette.primary.main,
					borderWidth: "2px",
					"&:hover": {
						borderWidth: "2px",
						backgroundColor: "rgba(46, 93, 74, 0.08)",
					},
				},
				large: {
					padding: "16px 32px",
					fontSize: "1.125rem",
				},
			},
		},

		// Card styles
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: "16px",
					boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
					transition: "all 0.3s ease",
					"&:hover": {
						transform: "translateY(-4px)",
						boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
					},
				},
			},
		},
		MuiCardHeader: {
			styleOverrides: {
				root: {
					background: `linear-gradient(135deg, ${baseTheme.palette.primary.main}, ${baseTheme.palette.primary.light})`,
					color: baseTheme.palette.primary.contrastText,
				},
				title: {
					fontSize: "1.25rem",
					fontWeight: 600,
					fontFamily: "Montserrat, sans-serif",
				},
			},
		},

		// Form controls (simplified for parents)
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-root": {
						borderRadius: "12px",
						fontSize: "1.125rem", // Larger text for readability
						"& fieldset": {
							borderColor: baseTheme.palette.grey[300],
							borderWidth: "2px",
						},
						"&:hover fieldset": {
							borderColor: baseTheme.palette.primary.main,
						},
						"&.Mui-focused fieldset": {
							borderColor: baseTheme.palette.primary.main,
						},
					},
					"& .MuiInputLabel-root": {
						fontSize: "1rem",
						fontWeight: 500,
						color: baseTheme.palette.text.primary,
					},
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					borderRadius: "12px",
					fontSize: "1.125rem",
				},
			},
		},
		MuiFormControlLabel: {
			styleOverrides: {
				label: {
					fontSize: "1rem",
					color: baseTheme.palette.text.primary,
				},
			},
		},

		// Table styles (clear fee display)
		MuiTable: {
			styleOverrides: {
				root: {
					borderRadius: "12px",
					overflow: "hidden",
					boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
				},
			},
		},
		MuiTableHead: {
			styleOverrides: {
				root: {
					backgroundColor: baseTheme.palette.primary.main,
					"& .MuiTableCell-head": {
						color: baseTheme.palette.primary.contrastText,
						fontWeight: 600,
						fontSize: "1rem",
						fontFamily: "Montserrat, sans-serif",
					},
				},
			},
		},
		MuiTableBody: {
			styleOverrides: {
				root: {
					"& .MuiTableRow-root:nth-of-type(even)": {
						backgroundColor: baseTheme.palette.background.accent,
					},
					"& .MuiTableCell-root": {
						fontSize: "1rem",
						padding: "16px",
					},
				},
			},
		},

		// Paper styles
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: "16px",
				},
				elevation1: {
					boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
				},
				elevation4: {
					boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
				},
				elevation8: {
					boxShadow: "0 8px 25px rgba(0, 0, 0, 0.10)",
				},
			},
		},

		// Container styles
		MuiContainer: {
			styleOverrides: {
				root: {
					paddingLeft: "16px",
					paddingRight: "16px",
					[baseTheme.breakpoints.up("sm")]: {
						paddingLeft: "24px",
						paddingRight: "24px",
					},
				},
			},
		},

		// AppBar styles
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: baseTheme.palette.primary.main,
					boxShadow: "0 2px 8px rgba(46, 93, 74, 0.15)",
				},
			},
		},

		// Chip styles
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: "8px",
					fontSize: "0.875rem",
					fontWeight: 500,
				},
				colorPrimary: {
					backgroundColor: baseTheme.palette.primary.main,
					color: baseTheme.palette.primary.contrastText,
				},
				colorSecondary: {
					backgroundColor: baseTheme.palette.secondary.main,
					color: baseTheme.palette.secondary.contrastText,
				},
			},
		},

		// Alert styles
		MuiAlert: {
			styleOverrides: {
				root: {
					borderRadius: "12px",
					fontSize: "1rem",
				},
				standardSuccess: {
					backgroundColor: "#E8F5E8",
					color: baseTheme.palette.success.dark,
				},
				standardError: {
					backgroundColor: "#FFF0F0",
					color: baseTheme.palette.error.dark,
				},
				standardWarning: {
					backgroundColor: "#FFF8E1",
					color: baseTheme.palette.warning.dark,
				},
				standardInfo: {
					backgroundColor: "#E3F2FD",
					color: baseTheme.palette.info.dark,
				},
			},
		},

		// Stepper styles (for multi-step forms)
		MuiStepLabel: {
			styleOverrides: {
				label: {
					fontSize: "1rem",
					fontWeight: 500,
					"&.Mui-active": {
						color: baseTheme.palette.primary.main,
						fontWeight: 600,
					},
					"&.Mui-completed": {
						color: baseTheme.palette.success.main,
						fontWeight: 600,
					},
				},
			},
		},
	},
});

// Campus-specific theme variations
export const createCampusTheme = (campus) => {
	const campusColors = {
		balaklava: {
			primary: {
				main: "#2E5D4A",
				light: "#4A8B3B",
				dark: "#1A3429",
			},
			secondary: {
				main: "#F4B942",
				light: "#F6C142",
				dark: "#E6A832",
			},
		},
		clare: {
			primary: {
				main: "#3E5F4F",
				light: "#5A9B4B",
				dark: "#2A4237",
			},
			secondary: {
				main: "#F6C142",
				light: "#F8D176",
				dark: "#E8B132",
			},
		},
	};

	const campusTheme =
		campus === 1 ? campusColors.clare : campusColors.balaklava;

	return createTheme(horizonTheme, {
		palette: {
			...horizonTheme.palette,
			primary: {
				...horizonTheme.palette.primary,
				...campusTheme.primary,
				contrastText: "#FFFFFF",
			},
			secondary: {
				...horizonTheme.palette.secondary,
				...campusTheme.secondary,
				contrastText: "#1A3429",
			},
		},
	});
};

export default horizonTheme;
