import { useState } from "react";
import {
	Add,
	ArrowForward,
	Check,
	ExpandMore,
	RestartAlt,
	Close,
	SchoolOutlined,
	Tune,
	DirectionsBusOutlined,
	BadgeOutlined,
	LocalOfferOutlined,
} from "@mui/icons-material";
import { Switch } from "@mui/material";
import FeeConfigService from "../../services/FeeConfigService";
import { calculateEstimate, money, yearLabel } from "./calculateEstimate";
import "../../assets/css/calculator.css";

const Option = ({ label, detail, icon, checked, onChange, disabled }) => (
	<label
		className={`fee-option${checked ? " is-selected" : ""}${disabled ? " is-disabled" : ""}`}
	>
		<span className="fee-option-icon">{icon}</span>
		<span className="fee-option-copy">
			<strong>{label}</strong>
			<small>{detail}</small>
		</span>
		<Switch
			checked={checked}
			onChange={(event) => onChange(event.target.checked)}
			disabled={disabled}
			inputProps={{ "aria-label": label }}
		/>
	</label>
);

const MaterialTuition = ({ campus, onSetCampus }) => {
	const [children, setChildren] = useState([""]);
	const [concession, setConcession] = useState(false);
	const [staff, setStaff] = useState(false);
	const [bus, setBus] = useState(false);
	const [readMore, setReadMore] = useState(false);
	const estimate = calculateEstimate(children, campus, concession, staff, bus);
	const hasResults = estimate.breakdown.length > 0;
	const campusName = campus === 0 ? "Balaklava" : "Clare";
	const academicYear = FeeConfigService.getMetadata().academicYear;
	const staffDiscount = FeeConfigService.getStaffDiscountPercentage();
	const reset = () => {
		setChildren([""]);
		setConcession(false);
		setStaff(false);
		setBus(false);
	};
	const updateChild = (index, value) =>
		setChildren(children.map((child, i) => (i === index ? value : child)));

	return (
		<main className="fee-page" id="home">
			<div className="fee-page-title">
				<div>
					<p className="fee-eyebrow">PLAN YOUR FAMILY'S YEAR</p>
					<h1>School fee calculator</h1>
					<p>
						Choose your campus and year levels. Your estimate updates instantly.
					</p>
				</div>
				<span className="fee-year">
					<span />
					{academicYear} fees
				</span>
			</div>
			<div className="fee-workspace">
				<section
					className="fee-controls fee-panel"
					aria-labelledby="calculator-heading"
				>
					<div className="fee-panel-heading">
						<div>
							<Tune fontSize="small" />
							<h2 id="calculator-heading">Your family</h2>
						</div>
						<button className="fee-reset" onClick={reset}>
							<RestartAlt fontSize="small" />
							Reset
						</button>
					</div>
					<fieldset className="fee-campus">
						<legend>
							<span className="fee-step">1</span>Choose your campus
						</legend>
						<div className="fee-campus-options">
							{["Balaklava", "Clare"].map((name, index) => (
								<label
									key={name}
									className={campus === index ? "is-selected" : ""}
								>
									<input
										type="radio"
										name="campus"
										value={index}
										checked={campus === index}
										onChange={() => onSetCampus(index)}
									/>
									<SchoolOutlined fontSize="small" />
									<span>{name}</span>
									{campus === index && (
										<Check className="fee-campus-check" fontSize="small" />
									)}
								</label>
							))}
						</div>
					</fieldset>
					<fieldset className="fee-children">
						<legend>
							<span className="fee-step">2</span>Add your children
						</legend>
						<div className="fee-child-list">
							{children.map((year, index) => (
								<div className="fee-child" key={index}>
									<label htmlFor={`year-${index}`}>Child {index + 1}</label>
									<div className="fee-select-wrap">
										<select
											id={`year-${index}`}
											value={year}
											onChange={(event) =>
												updateChild(index, event.target.value)
											}
										>
											<option value="">Select year level</option>
											{FeeConfigService.getYearLevels().map((level) => (
												<option key={level} value={level}>
													{yearLabel(level)}
												</option>
											))}
										</select>
										<ExpandMore fontSize="small" />
									</div>
									{children.length > 1 && (
										<button
											className="fee-remove"
											aria-label={`Remove child ${index + 1}`}
											onClick={() =>
												setChildren(children.filter((_, i) => i !== index))
											}
										>
											<Close fontSize="small" />
										</button>
									)}
								</div>
							))}
						</div>
						<button
							className="fee-add"
							onClick={() => setChildren([...children, ""])}
						>
							<Add fontSize="small" />
							Add another child
						</button>
					</fieldset>
					<fieldset className="fee-options">
						<legend>
							<span className="fee-step">3</span>Tailor your estimate
						</legend>
						<Option
							label="School Card concession"
							detail={
								staff
									? "Turn off staff discount to select"
									: "For eligible card holders"
							}
							icon={<LocalOfferOutlined fontSize="small" />}
							checked={concession}
							disabled={staff}
							onChange={setConcession}
						/>
						<Option
							label="Bus transport"
							detail="Include transport for your children"
							icon={<DirectionsBusOutlined fontSize="small" />}
							checked={bus}
							onChange={setBus}
						/>
						<Option
							label="Staff discount"
							detail={`${staffDiscount}% off tuition fees`}
							icon={<BadgeOutlined fontSize="small" />}
							checked={staff}
							onChange={(checked) => {
								setStaff(checked);
								if (checked) setConcession(false);
							}}
						/>
					</fieldset>
					<button
						className="fee-read-more"
						aria-expanded={readMore}
						aria-controls="fee-information"
						onClick={() => setReadMore(!readMore)}
					>
						Read more about fees & discounts
						<ExpandMore
							className={readMore ? "is-open" : ""}
							fontSize="small"
						/>
					</button>
					<div
						id="fee-information"
						hidden={!readMore}
						className="fee-information"
					>
						<h3>Understanding your estimate</h3>
						<p>
							Tuition and resource levies are included for your selected year
							levels. Bus transport is optional. Sibling tuition discounts are
							applied automatically, starting with the child in the highest year
							level.
						</p>
						<h3>Discounts & eligibility</h3>
						<p>
							School Card and staff discounts cannot be combined. The staff
							discount applies to tuition only. Please confirm eligibility with
							the school office.
						</p>
						<h3>Need a hand?</h3>
						<p>
							This is an estimate of annual school fees. Final fees may vary
							with your circumstances. Contact the school for an official fee
							confirmation or payment plan options.
						</p>
						<div className="fee-contact-links">
							<a href="tel:0888622100">Balaklava · (08) 8862 2100</a>
							<a href="tel:0888421808">Clare · (08) 8842 1808</a>
							<a href="mailto:admin@horizon.sa.edu.au">
								Email the school office <ArrowForward fontSize="small" />
							</a>
						</div>
					</div>
				</section>
				<section className="fee-results" aria-labelledby="estimate-heading">
					<div className="fee-total-card">
						<div className="fee-total-top">
							<h2 id="estimate-heading">Your annual estimate</h2>
							<span>AUD</span>
						</div>
						<div
							className="fee-total-value"
							role="status"
							aria-live="polite"
							aria-atomic="true"
						>
							<span className="fee-sr-only">Estimated annual total: </span>
							{hasResults ? money(estimate.total) : "—"}
						</div>
						<p>
							{hasResults
								? `${campusName} · ${estimate.breakdown.length} ${estimate.breakdown.length === 1 ? "child" : "children"} · ${academicYear}`
								: "Build an estimate for your family"}
						</p>
						<div className="fee-total-note">
							<span className="fee-live-dot" />
							{hasResults
								? "Updated with your selections"
								: "Select a campus and year level to start"}
						</div>
					</div>
					<div className="fee-breakdown fee-panel">
						<div className="fee-panel-heading">
							<h2>Fee breakdown</h2>
							<span className="fee-small-label">
								{hasResults ? "Annual fees" : "At a glance"}
							</span>
						</div>
						{hasResults ? (
							<>
								<div className="fee-totals">
									<div>
										<span>Tuition</span>
										<strong>{money(estimate.tuition)}</strong>
									</div>
									<div>
										<span>Resource levies</span>
										<strong>{money(estimate.resources)}</strong>
									</div>
									<div>
										<span>Bus transport</span>
										<strong>
											{bus ? money(estimate.transport) : "Not selected"}
										</strong>
									</div>
								</div>
								<div className="fee-desktop-table">
									<table>
										<caption className="fee-sr-only">
											Annual fee breakdown, highest year level first
										</caption>
										<thead>
											<tr>
												<th scope="col">Year level</th>
												<th scope="col">Tuition</th>
												<th scope="col">Levy</th>
												{bus && <th scope="col">Bus</th>}
												<th scope="col">Total</th>
											</tr>
										</thead>
										<tbody>
											{estimate.breakdown.map((child, index) => (
												<tr key={index}>
													<th scope="row">
														{yearLabel(child.yearLevel)}
														<small>Child {index + 1}</small>
													</th>
													<td>{money(child.tuition)}</td>
													<td>{money(child.resources)}</td>
													{bus && <td>{money(child.transport)}</td>}
													<td>{money(child.total)}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								<div className="fee-mobile-breakdown">
									{estimate.breakdown.map((child, index) => (
										<div className="fee-child-result" key={index}>
											<div>
												<strong>{yearLabel(child.yearLevel)}</strong>
												<strong>{money(child.total)}</strong>
											</div>
											<p>Child {index + 1}</p>
											<dl>
												<div>
													<dt>Tuition</dt>
													<dd>{money(child.tuition)}</dd>
												</div>
												<div>
													<dt>Resource levy</dt>
													<dd>{money(child.resources)}</dd>
												</div>
												{bus && (
													<div>
														<dt>Bus transport</dt>
														<dd>{money(child.transport)}</dd>
													</div>
												)}
											</dl>
										</div>
									))}
								</div>
								<div className="fee-applied">
									<Check fontSize="small" />
									<span>
										{staff
											? `${staffDiscount}% staff discount applied`
											: concession
												? "School Card rates applied"
												: "Standard tuition rates"}
										{estimate.breakdown.length > 1
											? " · Sibling rates included"
											: ""}
									</span>
								</div>
							</>
						) : (
							<div className="fee-empty">
								<span className="fee-empty-icon">
									<SchoolOutlined />
								</span>
								<h3>A clearer picture of your fees</h3>
								<p>
									{campus === null
										? "Choose your campus and add your children's year levels to see tuition, levies and optional transport here."
										: "Add your children's year levels to see tuition, levies and optional transport here."}
								</p>
								<div>
									<span>Tuition</span>
									<span>Resource levies</span>
									<span>Transport</span>
								</div>
							</div>
						)}
					</div>
					<p className="fee-disclaimer">
						An estimate to help you plan. Please confirm final fees with the
						school office.
					</p>
				</section>
			</div>
		</main>
	);
};

export default MaterialTuition;
