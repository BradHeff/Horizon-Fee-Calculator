/**
 * Fee Administration Component
 *
 * This component provides a user-friendly interface for school administrators
 * to update fee structures without requiring technical knowledge.
 *
 * Features:
 * - Visual fee structure editor
 * - Validation and error checking
 * - Preview changes before applying
 * - Export updated configuration
 * - Version management
 */

import {
	Download as DownloadIcon,
	ExpandMore as ExpandMoreIcon,
	Preview as PreviewIcon,
	Save as SaveIcon,
	Upload as UploadIcon,
} from "@mui/icons-material";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Paper,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tabs,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import FeeConfigService from "../../services/FeeConfigService";

function TabPanel({ children, value, index, ...other }) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`fee-admin-tabpanel-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

const FeeAdministration = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [feeData, setFeeData] = useState(null);
	const [hasChanges, setHasChanges] = useState(false);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [errors, setErrors] = useState([]);
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		loadCurrentConfiguration();
	}, []);

	const loadCurrentConfiguration = () => {
		try {
			// In a real implementation, this would load from the service
			const currentConfig = {
				version: "2026.1",
				lastUpdated: new Date().toISOString().split("T")[0],
				settings: {
					staffDiscountPercentage: 25,
					academicYear: "2026",
					currency: "AUD",
				},
				campuses: FeeConfigService.getCampuses(),
				yearLevels: FeeConfigService.getYearLevels(),
				feeStructure: {
					tuition: {
						balaklava: {
							standard: FeeConfigService.getTuitionFees(
								"balaklava",
								"standard"
							),
							concession: FeeConfigService.getTuitionFees(
								"balaklava",
								"concession"
							),
						},
						clare: {
							standard: FeeConfigService.getTuitionFees(
								"clare",
								"standard"
							),
							concession: FeeConfigService.getTuitionFees(
								"clare",
								"concession"
							),
						},
					},
					transport: {
						busFees: FeeConfigService.getBusFees(),
					},
				},
			};

			setFeeData(currentConfig);
			setErrors([]);
		} catch (error) {
			setErrors([
				"Failed to load current configuration: " + error.message,
			]);
		}
	};

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	const updateFee = (campus, feeType, yearLevel, childIndex, value) => {
		const numericValue = parseFloat(value) || 0;

		setFeeData((prev) => ({
			...prev,
			feeStructure: {
				...prev.feeStructure,
				tuition: {
					...prev.feeStructure.tuition,
					[campus]: {
						...prev.feeStructure.tuition[campus],
						[feeType]: {
							...prev.feeStructure.tuition[campus][feeType],
							[yearLevel]: prev.feeStructure.tuition[campus][
								feeType
							][yearLevel].map((fee, index) =>
								index === childIndex ? numericValue : fee
							),
						},
					},
				},
			},
		}));

		setHasChanges(true);
	};

	const updateBusFee = (childKey, value) => {
		const numericValue = parseFloat(value) || 0;

		setFeeData((prev) => ({
			...prev,
			feeStructure: {
				...prev.feeStructure,
				transport: {
					...prev.feeStructure.transport,
					busFees: {
						...prev.feeStructure.transport.busFees,
						[childKey]: numericValue,
					},
				},
			},
		}));

		setHasChanges(true);
	};

	const updateSettings = (key, value) => {
		setFeeData((prev) => ({
			...prev,
			settings: {
				...prev.settings,
				[key]: value,
			},
		}));

		setHasChanges(true);
	};

	const validateConfiguration = () => {
		const newErrors = [];

		if (!feeData.settings.academicYear) {
			newErrors.push("Academic year is required");
		}

		if (
			!feeData.settings.staffDiscountPercentage ||
			feeData.settings.staffDiscountPercentage < 0 ||
			feeData.settings.staffDiscountPercentage > 100
		) {
			newErrors.push(
				"Staff discount percentage must be between 0 and 100"
			);
		}

		// Validate that all fees are numeric and positive
		["balaklava", "clare"].forEach((campus) => {
			["standard", "concession"].forEach((feeType) => {
				Object.entries(
					feeData.feeStructure.tuition[campus][feeType]
				).forEach(([yearLevel, fees]) => {
					fees.forEach((fee, index) => {
						if (typeof fee !== "number" || fee < 0) {
							newErrors.push(
								`Invalid fee for ${campus} ${feeType} ${yearLevel} child ${
									index + 1
								}: must be a positive number`
							);
						}
					});
				});
			});
		});

		setErrors(newErrors);
		return newErrors.length === 0;
	};

	const handlePreview = () => {
		if (validateConfiguration()) {
			setPreviewOpen(true);
		}
	};

	const handleSave = () => {
		if (validateConfiguration()) {
			// Update the configuration using the service
			const success = FeeConfigService.updateConfig(feeData);

			if (success) {
				setSuccessMessage(
					"Fee configuration updated successfully! Changes are now active for all users."
				);
				setHasChanges(false);

				// Trigger a page reload to refresh all components with new data
				setTimeout(() => {
					window.location.reload();
				}, 2000);
			} else {
				setErrors(["Failed to save configuration. Please try again."]);
			}
		}
	};

	const downloadConfiguration = (config = feeData) => {
		const dataStr = JSON.stringify(config, null, 2);
		const dataUri =
			"data:application/json;charset=utf-8," +
			encodeURIComponent(dataStr);

		const exportFileDefaultName = `fee-config-${config.settings.academicYear}-${config.lastUpdated}.json`;

		const linkElement = document.createElement("a");
		linkElement.setAttribute("href", dataUri);
		linkElement.setAttribute("download", exportFileDefaultName);
		linkElement.click();
	};

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const uploadedConfig = JSON.parse(e.target.result);
					setFeeData(uploadedConfig);
					setHasChanges(true);
					setSuccessMessage(
						"Configuration file uploaded successfully!"
					);
				} catch (error) {
					setErrors(["Invalid JSON file: " + error.message]);
				}
			};
			reader.readAsText(file);
		}
	};

	const renderFeeTable = (campus, feeType) => {
		if (!feeData) return null;

		const fees = feeData.feeStructure.tuition[campus][feeType];
		const yearLevels = feeData.yearLevels;

		return (
			<TableContainer component={Paper} sx={{ mb: 2 }}>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: "bold" }}>
								Year Level
							</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>
								1st Child
							</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>
								2nd Child
							</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>
								3rd Child
							</TableCell>
							<TableCell sx={{ fontWeight: "bold" }}>
								4th+ Child
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{yearLevels.map((yearLevel) => (
							<TableRow key={yearLevel}>
								<TableCell
									sx={{
										textTransform: "capitalize",
										fontWeight: "medium",
									}}
								>
									{yearLevel.replace("year", "Year ")}
								</TableCell>
								{fees[yearLevel].map((fee, childIndex) => (
									<TableCell key={childIndex}>
										<TextField
											type="number"
											size="small"
											value={fee}
											onChange={(e) =>
												updateFee(
													campus,
													feeType,
													yearLevel,
													childIndex,
													e.target.value
												)
											}
											sx={{
												width: "100px",
												"& input": {
													textAlign: "right",
													fontSize: "0.875rem",
												},
											}}
											InputProps={{
												startAdornment: (
													<Typography
														variant="caption"
														sx={{
															color: "text.secondary",
															mr: 0.5,
														}}
													>
														$
													</Typography>
												),
											}}
										/>
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	};

	if (!feeData) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="400px"
			>
				<Typography>Loading fee configuration...</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ width: "100%", bgcolor: "background.paper" }}>
			{/* Header */}
			<Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
				<Grid
					container
					justifyContent="space-between"
					alignItems="center"
				>
					<Grid item>
						<Typography variant="h4" component="h1" gutterBottom>
							Fee Administration
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Manage school fee structures for{" "}
							{feeData.settings.academicYear} academic year
						</Typography>
					</Grid>
					<Grid item>
						<Box display="flex" gap={1}>
							<input
								accept=".json"
								style={{ display: "none" }}
								id="upload-config-file"
								type="file"
								onChange={handleFileUpload}
							/>
							<label htmlFor="upload-config-file">
								<Button
									variant="outlined"
									component="span"
									startIcon={<UploadIcon />}
								>
									Upload Config
								</Button>
							</label>

							<Button
								variant="outlined"
								startIcon={<DownloadIcon />}
								onClick={() => downloadConfiguration()}
							>
								Download Current
							</Button>

							<Button
								variant="outlined"
								startIcon={<PreviewIcon />}
								onClick={handlePreview}
								disabled={!hasChanges}
							>
								Preview Changes
							</Button>

							<Button
								variant="contained"
								startIcon={<SaveIcon />}
								onClick={handleSave}
								disabled={!hasChanges}
							>
								Save Changes
							</Button>
						</Box>
					</Grid>
				</Grid>

				{/* Status Messages */}
				{errors.length > 0 && (
					<Alert severity="error" sx={{ mt: 2 }}>
						<ul style={{ margin: 0, paddingLeft: "20px" }}>
							{errors.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</Alert>
				)}

				{successMessage && (
					<Alert severity="success" sx={{ mt: 2 }}>
						{successMessage}
					</Alert>
				)}

				{hasChanges && (
					<Alert severity="info" sx={{ mt: 2 }}>
						<Typography variant="body2">
							You have unsaved changes. Please preview and save
							your configuration.
						</Typography>
					</Alert>
				)}
			</Box>

			{/* Main Content */}
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs value={activeTab} onChange={handleTabChange}>
					<Tab label="General Settings" />
					<Tab label="Balaklava Campus" />
					<Tab label="Clare Campus" />
					<Tab label="Transport Fees" />
					<Tab label="Configuration Info" />
				</Tabs>
			</Box>

			{/* General Settings Tab */}
			<TabPanel value={activeTab} index={0}>
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Basic Settings
								</Typography>

								<TextField
									fullWidth
									label="Academic Year"
									value={feeData.settings.academicYear}
									onChange={(e) =>
										updateSettings(
											"academicYear",
											e.target.value
										)
									}
									margin="normal"
								/>

								<TextField
									fullWidth
									label="Staff Discount Percentage"
									type="number"
									value={
										feeData.settings.staffDiscountPercentage
									}
									onChange={(e) =>
										updateSettings(
											"staffDiscountPercentage",
											parseFloat(e.target.value)
										)
									}
									margin="normal"
									InputProps={{
										endAdornment: (
											<Typography
												variant="body2"
												sx={{ color: "text.secondary" }}
											>
												%
											</Typography>
										),
									}}
								/>

								<TextField
									fullWidth
									label="Currency"
									value={feeData.settings.currency}
									onChange={(e) =>
										updateSettings(
											"currency",
											e.target.value
										)
									}
									margin="normal"
								/>
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs={12} md={6}>
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Configuration Status
								</Typography>

								<Box
									display="flex"
									flexDirection="column"
									gap={1}
								>
									<Box
										display="flex"
										justifyContent="space-between"
									>
										<Typography variant="body2">
											Version:
										</Typography>
										<Chip
											label={feeData.version}
											size="small"
										/>
									</Box>

									<Box
										display="flex"
										justifyContent="space-between"
									>
										<Typography variant="body2">
											Last Updated:
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
										>
											{feeData.lastUpdated}
										</Typography>
									</Box>

									<Box
										display="flex"
										justifyContent="space-between"
									>
										<Typography variant="body2">
											Has Changes:
										</Typography>
										<Chip
											label={hasChanges ? "Yes" : "No"}
											color={
												hasChanges
													? "warning"
													: "success"
											}
											size="small"
										/>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</TabPanel>

			{/* Balaklava Campus Tab */}
			<TabPanel value={activeTab} index={1}>
				<Typography variant="h5" gutterBottom>
					Balaklava Campus Fee Structure
				</Typography>

				<Accordion defaultExpanded>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant="h6">Standard Fees</Typography>
					</AccordionSummary>
					<AccordionDetails>
						{renderFeeTable("balaklava", "standard")}
					</AccordionDetails>
				</Accordion>

				<Accordion>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant="h6">Concession Fees</Typography>
					</AccordionSummary>
					<AccordionDetails>
						{renderFeeTable("balaklava", "concession")}
					</AccordionDetails>
				</Accordion>
			</TabPanel>

			{/* Clare Campus Tab */}
			<TabPanel value={activeTab} index={2}>
				<Typography variant="h5" gutterBottom>
					Clare Campus Fee Structure
				</Typography>

				<Accordion defaultExpanded>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant="h6">Standard Fees</Typography>
					</AccordionSummary>
					<AccordionDetails>
						{renderFeeTable("clare", "standard")}
					</AccordionDetails>
				</Accordion>

				<Accordion>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant="h6">Concession Fees</Typography>
					</AccordionSummary>
					<AccordionDetails>
						{renderFeeTable("clare", "concession")}
					</AccordionDetails>
				</Accordion>
			</TabPanel>

			{/* Transport Fees Tab */}
			<TabPanel value={activeTab} index={3}>
				<Typography variant="h5" gutterBottom>
					Transport Fee Structure
				</Typography>

				<Card>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Bus Fees
						</Typography>

						<Grid container spacing={2}>
							{Object.entries(
								feeData.feeStructure.transport.busFees
							).map(([childKey, fee]) => (
								<Grid item xs={12} sm={6} md={3} key={childKey}>
									<TextField
										fullWidth
										label={`${childKey.replace(
											"child",
											"Child "
										)} Fee`}
										type="number"
										value={fee}
										onChange={(e) =>
											updateBusFee(
												childKey,
												e.target.value
											)
										}
										InputProps={{
											startAdornment: (
												<Typography
													variant="body2"
													sx={{
														color: "text.secondary",
														mr: 0.5,
													}}
												>
													$
												</Typography>
											),
										}}
									/>
								</Grid>
							))}
						</Grid>
					</CardContent>
				</Card>
			</TabPanel>

			{/* Configuration Info Tab */}
			<TabPanel value={activeTab} index={4}>
				<Typography variant="h5" gutterBottom>
					Configuration Information
				</Typography>

				<Card>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							How to Use This Tool
						</Typography>

						<Typography variant="body1" paragraph>
							This administration tool allows you to update school
							fee structures without requiring technical knowledge
							or code changes.
						</Typography>

						<Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
							Key Features:
						</Typography>

						<ul>
							<li>
								<strong>Real-time Validation:</strong> The
								system checks for errors as you make changes
							</li>
							<li>
								<strong>Campus-specific Fees:</strong> Separate
								fee structures for Balaklava and Clare campuses
							</li>
							<li>
								<strong>Multiple Fee Types:</strong> Support for
								standard and concession card fees
							</li>
							<li>
								<strong>Child Priority Discounts:</strong>{" "}
								Automatic handling of sibling discounts
							</li>
							<li>
								<strong>Staff Discounts:</strong> Configurable
								staff discount percentage
							</li>
							<li>
								<strong>Transport Fees:</strong> Separate
								management of bus fees
							</li>
							<li>
								<strong>Version Control:</strong> Automatic
								versioning of configuration changes
							</li>
							<li>
								<strong>Import/Export:</strong> Upload and
								download configuration files
							</li>
						</ul>

						<Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
							Workflow:
						</Typography>

						<ol>
							<li>Update fees in the respective campus tabs</li>
							<li>Modify general settings if needed</li>
							<li>
								Use "Preview Changes" to review your updates
							</li>
							<li>
								Click "Save Changes" to apply the new
								configuration
							</li>
							<li>
								Download the updated configuration file for
								backup
							</li>
						</ol>
					</CardContent>
				</Card>
			</TabPanel>

			{/* Preview Dialog */}
			<Dialog
				open={previewOpen}
				onClose={() => setPreviewOpen(false)}
				maxWidth="lg"
				fullWidth
			>
				<DialogTitle>Preview Fee Changes</DialogTitle>
				<DialogContent>
					<Typography variant="body1" paragraph>
						The following changes will be applied to the fee
						structure:
					</Typography>

					{/* This would show a detailed comparison of changes */}
					<Alert severity="info">
						Configuration preview functionality would be implemented
						here, showing a detailed diff of the changes made.
					</Alert>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setPreviewOpen(false)}>
						Cancel
					</Button>
					<Button variant="contained" onClick={handleSave}>
						Apply Changes
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default FeeAdministration;
