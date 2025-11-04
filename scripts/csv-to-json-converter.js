/**
 * Fee CSV to JSON Converter
 *
 * This utility helps convert fee data from spreadsheets (CSV format)
 * to the JSON configuration format used by the dynamic fee system.
 *
 * Usage: node scripts/csv-to-json-converter.js input.csv output.json
 */

const fs = require("fs");

class FeeCSVConverter {
	constructor() {
		this.template = {
			version: "2026.1",
			lastUpdated: new Date().toISOString().split("T")[0],
			description:
				"Horizon Christian School Fee Structure - Converted from CSV",

			settings: {
				staffDiscountPercentage: 25,
				currency: "AUD",
				paymentFrequency: "per term",
				academicYear: "2026",
			},

			yearLevels: [
				{ key: "foundation", display: "Foundation", order: 0 },
				{ key: "year1", display: "Year 1", order: 1 },
				{ key: "year2", display: "Year 2", order: 2 },
				{ key: "year3", display: "Year 3", order: 3 },
				{ key: "year4", display: "Year 4", order: 4 },
				{ key: "year5", display: "Year 5", order: 5 },
				{ key: "year6", display: "Year 6", order: 6 },
				{ key: "year7", display: "Year 7", order: 7 },
				{ key: "year8", display: "Year 8", order: 8 },
				{ key: "year9", display: "Year 9", order: 9 },
				{ key: "year10", display: "Year 10", order: 10 },
				{ key: "year11", display: "Year 11", order: 11 },
				{ key: "year12", display: "Year 12", order: 12 },
			],

			campuses: [
				{
					id: 0,
					name: "Balaklava",
					code: "BAL",
					fullRate: true,
				},
				{
					id: 1,
					name: "Clare",
					code: "CLA",
					fullRate: false,
					discountPercentage: 50,
				},
			],

			childPriorityDiscounts: [
				{
					childNumber: 1,
					discountPercentage: 0,
					description: "First child - full fee",
				},
				{
					childNumber: 2,
					discountPercentage: 25,
					description: "Second child - 25% discount",
				},
				{
					childNumber: 3,
					discountPercentage: 50,
					description: "Third child - 50% discount",
				},
				{
					childNumber: 4,
					discountPercentage: 100,
					description: "Fourth+ child - free",
				},
			],

			feeStructure: {
				tuition: {
					balaklava: { standard: {}, concession: {} },
					clare: { standard: {}, concession: {} },
				},
				transport: {
					busFees: {
						child1: 250,
						child2: 150,
						child3: 100,
						child4: 0,
					},
				},
			},

			metadata: {
				approvedBy: "Board of Directors",
				approvalDate: new Date().toISOString().split("T")[0],
				effectiveDate: "2026-01-01",
				notes: [
					"Fees are charged per term",
					"Staff discount applies to tuition only, not transport",
					"Concession card holders eligible for reduced rates",
					"Fourth child and subsequent children attend free",
				],
			},
		};
	}

	/**
	 * Parse CSV content into fee structure
	 * Expected CSV format:
	 * YearLevel,Campus,FeeType,Child1,Child2,Child3,Child4
	 */
	parseCSV(csvContent) {
		const lines = csvContent.trim().split("\n");
		const headers = lines[0].split(",").map((h) => h.trim());

		console.log("CSV Headers:", headers);

		if (!this.validateHeaders(headers)) {
			throw new Error(
				"Invalid CSV format. Expected: YearLevel,Campus,FeeType,Child1,Child2,Child3,Child4"
			);
		}

		const config = JSON.parse(JSON.stringify(this.template));

		for (let i = 1; i < lines.length; i++) {
			const values = lines[i].split(",").map((v) => v.trim());

			if (values.length !== headers.length) {
				console.warn(
					`Row ${i + 1} has ${values.length} columns, expected ${
						headers.length
					}. Skipping.`
				);
				continue;
			}

			const rowData = {};
			headers.forEach((header, index) => {
				rowData[header] = values[index];
			});

			this.processRow(config, rowData);
		}

		return config;
	}

	validateHeaders(headers) {
		const required = [
			"YearLevel",
			"Campus",
			"FeeType",
			"Child1",
			"Child2",
			"Child3",
			"Child4",
		];
		return required.every((req) => headers.includes(req));
	}

	processRow(config, row) {
		const yearLevel = this.normalizeYearLevel(row.YearLevel);
		const campus = row.Campus.toLowerCase();
		const feeType = row.FeeType.toLowerCase();

		if (
			!yearLevel ||
			!["balaklava", "clare"].includes(campus) ||
			!["standard", "concession"].includes(feeType)
		) {
			console.warn(`Invalid row data:`, row);
			return;
		}

		const fees = [
			parseFloat(row.Child1) || 0,
			parseFloat(row.Child2) || 0,
			parseFloat(row.Child3) || 0,
			parseFloat(row.Child4) || 0,
		];

		config.feeStructure.tuition[campus][feeType][yearLevel] = fees;
	}

	normalizeYearLevel(yearLevel) {
		const normalized = yearLevel.toLowerCase().replace(/\s+/g, "");

		const mapping = {
			foundation: "foundation",
			prep: "foundation",
			year1: "year1",
			1: "year1",
			year2: "year2",
			2: "year2",
			year3: "year3",
			3: "year3",
			year4: "year4",
			4: "year4",
			year5: "year5",
			5: "year5",
			year6: "year6",
			6: "year6",
			year7: "year7",
			7: "year7",
			year8: "year8",
			8: "year8",
			year9: "year9",
			9: "year9",
			year10: "year10",
			10: "year10",
			year11: "year11",
			11: "year11",
			year12: "year12",
			12: "year12",
		};

		return mapping[normalized] || null;
	}

	/**
	 * Convert CSV file to JSON configuration
	 */
	async convertFile(inputPath, outputPath, options = {}) {
		try {
			console.log(`Converting CSV: ${inputPath} -> ${outputPath}`);

			const csvContent = fs.readFileSync(inputPath, "utf8");
			const config = this.parseCSV(csvContent);

			// Apply any additional options
			if (options.academicYear) {
				config.settings.academicYear = options.academicYear;
			}

			if (options.staffDiscount) {
				config.settings.staffDiscountPercentage = options.staffDiscount;
			}

			// Validate the configuration
			this.validateConfig(config);

			// Write the JSON file
			fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));

			console.log(`✅ Conversion completed successfully!`);
			console.log(`📄 JSON configuration saved to: ${outputPath}`);

			return config;
		} catch (error) {
			console.error(`❌ Conversion failed:`, error.message);
			throw error;
		}
	}

	validateConfig(config) {
		const errors = [];

		// Check that we have fees for all year levels and campuses
		const yearLevels = config.yearLevels.map((yl) => yl.key);
		const campuses = ["balaklava", "clare"];
		const feeTypes = ["standard", "concession"];

		campuses.forEach((campus) => {
			feeTypes.forEach((feeType) => {
				yearLevels.forEach((yearLevel) => {
					const fees =
						config.feeStructure.tuition[campus][feeType][yearLevel];
					if (!fees || fees.length !== 4) {
						errors.push(
							`Missing or invalid fees for ${campus} ${feeType} ${yearLevel}`
						);
					}
				});
			});
		});

		if (errors.length > 0) {
			throw new Error(
				`Configuration validation failed:\n${errors.join("\n")}`
			);
		}

		console.log(`✅ Configuration validation passed`);
	}

	/**
	 * Generate a template CSV file
	 */
	generateTemplate(outputPath) {
		const headers = [
			"YearLevel",
			"Campus",
			"FeeType",
			"Child1",
			"Child2",
			"Child3",
			"Child4",
		];
		const rows = [headers.join(",")];

		const yearLevels = [
			"Foundation",
			"Year 1",
			"Year 2",
			"Year 3",
			"Year 4",
			"Year 5",
			"Year 6",
			"Year 7",
			"Year 8",
			"Year 9",
			"Year 10",
			"Year 11",
			"Year 12",
		];
		const campuses = ["Balaklava", "Clare"];
		const feeTypes = ["Standard", "Concession"];

		yearLevels.forEach((yearLevel) => {
			campuses.forEach((campus) => {
				feeTypes.forEach((feeType) => {
					rows.push(`${yearLevel},${campus},${feeType},0,0,0,0`);
				});
			});
		});

		fs.writeFileSync(outputPath, rows.join("\n"));
		console.log(`📋 Template CSV generated: ${outputPath}`);
	}
}

// Command line interface
if (require.main === module) {
	const converter = new FeeCSVConverter();
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.log(`
Usage:
  node csv-to-json-converter.js <input.csv> <output.json>     # Convert CSV to JSON
  node csv-to-json-converter.js --template <output.csv>       # Generate template CSV
  node csv-to-json-converter.js --help                        # Show this help

Examples:
  node csv-to-json-converter.js fees-2026.csv fee-config.json
  node csv-to-json-converter.js --template fee-template.csv
    `);
		process.exit(0);
	}

	if (args[0] === "--help") {
		console.log(
			"Fee CSV to JSON Converter - Help documentation available in DYNAMIC_FEE_SYSTEM.md"
		);
		process.exit(0);
	}

	if (args[0] === "--template") {
		const outputPath = args[1] || "fee-template.csv";
		converter.generateTemplate(outputPath);
		process.exit(0);
	}

	if (args.length < 2) {
		console.error(
			"❌ Error: Please provide both input CSV and output JSON file paths"
		);
		process.exit(1);
	}

	const [inputPath, outputPath] = args;

	converter
		.convertFile(inputPath, outputPath)
		.then(() => {
			console.log("🎉 Conversion completed successfully!");
			process.exit(0);
		})
		.catch((error) => {
			console.error("💥 Conversion failed:", error.message);
			process.exit(1);
		});
}

module.exports = FeeCSVConverter;
