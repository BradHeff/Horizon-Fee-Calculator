import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../services/adminApi";
import MaterialHeading from "../Heading/MaterialHeading";
import {
	bands,
	clone,
	updateTuition,
	updateResource,
	applyIncrease,
	amount,
} from "./feeEditor";
import "../../assets/css/calculator.css";
import "../../assets/css/admin.css";

const FeeInput = ({ label, value, onChange }) => (
	<input
		aria-label={label}
		type="number"
		min="0"
		max="100000"
		step="0.01"
		required
		value={value}
		onChange={(event) => onChange(event.target.value)}
	/>
);

export default function AdminPanel() {
	const [authenticated, setAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [config, setConfig] = useState(null);
	const [saved, setSaved] = useState(null);
	const [revision, setRevision] = useState("");
	const [liveYear, setLiveYear] = useState("");
	const [liveConfig, setLiveConfig] = useState(null);
	const [campus, setCampus] = useState("balaklava");
	const [type, setType] = useState("standard");
	const [percent, setPercent] = useState("");
	const [scope, setScope] = useState("tuition");
	const [rounding, setRounding] = useState("dollar");
	const [undo, setUndo] = useState(null);
	const [publishReview, setPublishReview] = useState(false);
	const dirty =
		config && saved && JSON.stringify(config) !== JSON.stringify(saved);
	const campusLabel = campus === "balaklava" ? "Balaklava" : "Clare";

	function loadEditor(data) {
		setConfig(data.draft);
		setSaved(clone(data.draft));
		setRevision(data.revision);
		setLiveYear(data.live.settings.academicYear);
		setLiveConfig(clone(data.live));
		setUndo(null);
		setPublishReview(false);
	}
	useEffect(() => {
		let active = true;
		adminApi("session")
			.then(async (data) => {
				if (!active) return;
				if (data.authenticated) {
					const editor = await adminApi("admin");
					if (active) {
						loadEditor(editor);
						setAuthenticated(true);
					}
				}
			})
			.catch((err) => {
				if (active) setError(err.message);
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);
	useEffect(() => {
		const warn = (event) => {
			if (dirty) {
				event.preventDefault();
				event.returnValue = "";
			}
		};
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [dirty]);
	async function run(task) {
		setBusy(true);
		setError("");
		setNotice("");
		try {
			await task();
		} catch (err) {
			setError(err.message);
			if (err.status === 401) setAuthenticated(false);
		} finally {
			setBusy(false);
		}
	}
	function edit(next) {
		setUndo(null);
		setConfig(next);
		setPublishReview(false);
		setNotice("");
	}
	async function login(event) {
		event.preventDefault();
		await run(async () => {
			await adminApi("login", { username, password });
			setPassword("");
			loadEditor(await adminApi("admin"));
			setAuthenticated(true);
		});
	}
	async function save(event) {
		event.preventDefault();
		await run(async () => {
			loadEditor(await adminApi("save", { config, revision }));
			setNotice("Draft saved. The public calculator has not changed.");
		});
	}
	async function resetDraft() {
		if (!window.confirm(`Replace the saved draft and any unsaved edits with the currently published ${liveYear} fees? This saves the reset immediately. Public fees will not change.`)) return;
		await run(async () => {
			loadEditor(await adminApi("save", { config: liveConfig, revision }));
			setNotice("Draft reset to the published fees and saved. The public calculator has not changed.");
		});
	}

	function increase() {
		setError("");
		setNotice("");
		try {
			const updated = applyIncrease(
				config,
				Number(percent),
				scope,
				campus,
				rounding,
			);
			edit(updated);
			setUndo(clone(config));
			setNotice(
				`${percent}% increase applied to the editor. Review the figures, then save your draft.`,
			);
		} catch (err) {
			setError(err.message);
		}
	}
	const heading = (
		<>
			<MaterialHeading />
			<div className="admin-title">
				<div>
					<p className="fee-eyebrow">FEE ADMINISTRATION</p>
					<h1>Manage school fees</h1>
					<p>Update figures, save a draft, then publish when you're ready.</p>
				</div>
				<Link
					to="/"
					onClick={(event) => {
						if (dirty && !window.confirm("Leave without saving your changes?"))
							event.preventDefault();
					}}
				>
					Back to calculator
				</Link>
			</div>
		</>
	);
	if (loading)
		return (
			<main className="fee-page">
				<p role="status">Loading fee administration…</p>
			</main>
		);
	return (
		<div className="admin-shell">
			{heading}
			<main className="admin-main">
				{error && (
					<div className="admin-message is-error" role="alert">
						{error}
					</div>
				)}
				{notice && (
					<div className="admin-message" role="status">
						{notice}
					</div>
				)}
				{!authenticated ? (
					<form className="admin-login fee-panel" onSubmit={login}>
						<h2>Administrator sign in</h2>
						<p>Sign in to edit and publish school fees.</p>
						<label>
							Username
							<input
								autoComplete="username"
								required
								value={username}
								onChange={(event) => setUsername(event.target.value)}
							/>
						</label>
						<label>
							Password
							<input
								type="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
						</label>
						<button className="admin-primary" disabled={busy}>
							{busy ? "Signing in…" : "Sign in"}
						</button>
					</form>
				) : (
					config && (
						<>
							<div className="admin-status">
								<span>
									Public calculator: <strong>{liveYear} fees</strong> · Editing
									a draft{dirty ? " · Unsaved changes" : ""}
								</span>
								<button
									disabled={busy}
									onClick={() => {
										if (
											dirty &&
											!window.confirm("Sign out without saving your changes?")
										)
											return;
										run(async () => {
											await adminApi("logout", {});
											setAuthenticated(false);
											setConfig(null);
											setSaved(null);
										});
									}}
								>
									Sign out
								</button>
							</div>
							<form onSubmit={save}>
								<fieldset disabled={busy} className="admin-form-fields">
									<section className="fee-panel admin-section admin-settings">
										<label>
											Academic year
											<input
												type="number"
												min="2020"
												max="2100"
												required
												value={config.settings.academicYear}
												onChange={(event) =>
													edit({
														...config,
														settings: {
															...config.settings,
															academicYear: event.target.value,
														},
													})
												}
											/>
										</label>
										<label>
											Schedule label <span>(optional)</span>
											<input
												maxLength="60"
												placeholder="e.g. 2027 · Term 1"
												value={config.settings.scheduleLabel || ""}
												onChange={(event) =>
													edit({
														...config,
														settings: {
															...config.settings,
															scheduleLabel: event.target.value,
														},
													})
												}
											/>
										</label>
										<p>
											The label identifies a price update. Publishing takes
											effect immediately; it is not scheduled by term or date.
										</p>
									</section>
									<section className="fee-panel admin-section">
										<h2>Increase fees by percentage</h2>
										<p>
											Applies to the current draft. Zero fees stay zero;
											discount percentages stay unchanged.
										</p>
										<div className="admin-increase">
											<label>
												Increase (%)
												<input
													type="number"
													min="0.01"
													max="100"
													step="0.01"
													value={percent}
													onChange={(event) => setPercent(event.target.value)}
												/>
											</label>
											<label>
												Apply to
												<select
													value={scope}
													onChange={(event) => setScope(event.target.value)}
												>
													<option value="tuition">
														{campusLabel} tuition — both rate tables
													</option>
													<option value="resources">
														Resource levies — both campuses
													</option>
													<option value="transport">
														Bus fees — both campuses
													</option>
													<option value="all">All fees — both campuses</option>
												</select>
											</label>
											<label>
												Round to
												<select
													value={rounding}
													onChange={(event) => setRounding(event.target.value)}
												>
													<option value="dollar">Nearest dollar</option>
													<option value="cent">Nearest cent</option>
												</select>
											</label>
											<button
												type="button"
												className="admin-primary"
												onClick={increase}
											>
												Apply increase
											</button>
											{undo && (
												<button
													type="button"
													onClick={() => {
														edit(undo);
														setUndo(null);
													}}
												>
													Undo increase
												</button>
											)}
										</div>
									</section>
									<section className="fee-panel admin-section">
										<div className="admin-section-title">
											<h2>Tuition fees</h2>
											<div
												className="admin-tabs"
												role="group"
												aria-label="Campus"
											>
												{["balaklava", "clare"].map((key) => (
													<button
														type="button"
														key={key}
														aria-pressed={campus === key}
														onClick={() => setCampus(key)}
													>
														{key === "balaklava" ? "Balaklava" : "Clare"}
													</button>
												))}
											</div>
										</div>
										<div
											className="admin-tabs admin-types"
											role="group"
											aria-label="Tuition rate"
										>
											<button
												type="button"
												aria-pressed={type === "standard"}
												onClick={() => setType("standard")}
											>
												Standard fees
											</button>
											<button
												type="button"
												aria-pressed={type === "concession"}
												onClick={() => setType("concession")}
											>
												School Card fees
											</button>
										</div>
										<div className="admin-table-wrap">
											<table>
												<caption>
													{campusLabel} ·{" "}
													{type === "standard" ? "Standard" : "School Card"}{" "}
													tuition (AUD)
												</caption>
												<thead>
													<tr>
														<th scope="col">Year levels</th>
														{[
															"1st child",
															"2nd child",
															"3rd child",
															"4th+ child",
														].map((label) => (
															<th scope="col" key={label}>
																{label}
															</th>
														))}
													</tr>
												</thead>
												<tbody>
													{bands.flatMap((band) => {
														// Preserve individual year rates if a future schedule separates a band.
														const same = band.years.every(
															(year) =>
																JSON.stringify(
																	config.feeStructure.tuition[campus][type][
																		year
																	],
																) ===
																JSON.stringify(
																	config.feeStructure.tuition[campus][type][
																		band.years[0]
																	],
																),
														);
														return (
															same
																? [band]
																: band.years.map((year) => ({
																		label:
																			year === "foundation"
																				? "Foundation"
																				: `Year ${year.slice(4)}`,
																		years: [year],
																	}))
														).map((row) => (
															<tr key={row.label}>
																<th scope="row">{row.label}</th>
																{config.feeStructure.tuition[campus][type][
																	row.years[0]
																].map((value, child) => (
																	<td
																		key={child}
																		data-label={
																			[
																				"1st child",
																				"2nd child",
																				"3rd child",
																				"4th+ child",
																			][child]
																		}
																	>
																		<FeeInput
																			label={`${campusLabel} ${type} ${row.label} child ${child + 1}`}
																			value={value}
																			onChange={(value) =>
																				edit(
																					updateTuition(
																						config,
																						campus,
																						type,
																						row.years,
																						child,
																						value,
																					),
																				)
																			}
																		/>
																	</td>
																))}
															</tr>
														));
													})}
												</tbody>
											</table>
										</div>
										<p className="admin-hint">
											Enter each child rate from the schedule. A zero means no
											tuition charge. Changes to a year band apply to every year
											in that band.
										</p>
									</section>
									<div className="admin-secondary-grid">
										<section className="fee-panel admin-section">
											<h2>Resource levies</h2>
											<p>Per child · shared by both campuses</p>
											{bands.flatMap((band) => {
												const same = band.years.every(
													(year) =>
														config.feeStructure.resources.resourceFees[year] ===
														config.feeStructure.resources.resourceFees[
															band.years[0]
														],
												);
												return (
													same
														? [band]
														: band.years.map((year) => ({
																label:
																	year === "foundation"
																		? "Foundation"
																		: `Year ${year.slice(4)}`,
																years: [year],
															}))
												).map((row) => (
													<label className="admin-rate-row" key={row.label}>
														{row.label}
														<FeeInput
															label={`Resource levy ${row.label}`}
															value={
																config.feeStructure.resources.resourceFees[
																	row.years[0]
																]
															}
															onChange={(value) =>
																edit(updateResource(config, row.years, value))
															}
														/>
													</label>
												));
											})}
										</section>
										<section className="fee-panel admin-section">
											<h2>Bus fees</h2>
											<p>Per child · shared by both campuses</p>
											{["child1", "child2", "child3", "child4"].map(
												(key, index) => (
													<label className="admin-rate-row" key={key}>
														{index === 3
															? "4th and subsequent children"
															: `Child ${index + 1}`}
														<FeeInput
															label={`Bus fee child ${index + 1}`}
															value={config.feeStructure.transport.busFees[key]}
															onChange={(value) => {
																const next = clone(config);
																next.feeStructure.transport.busFees[key] =
																	amount(value);
																edit(next);
															}}
														/>
													</label>
												),
											)}
										</section>
									</div>
									<div className="admin-actions">
										<span>
											{dirty ? "Unsaved changes" : "Draft saved"} · Public fees
											change only when published.
										</span>
										<button
											type="button"
											disabled={!dirty}
											onClick={() => {
												if (
													!dirty ||
													window.confirm("Undo edits made since the last save? The saved draft will be kept.")
												) {
													edit(clone(saved));
													setUndo(null);
												}
											}}
										>
											Undo unsaved edits
										</button>
										<button type="button" onClick={resetDraft}>
											Reset draft to published fees
										</button>
										<button
											className="admin-primary"
											type="submit"
											disabled={!dirty}
										>
											{busy ? "Saving…" : "Save draft"}
										</button>
										<button
											type="button"
											disabled={dirty}
											onClick={() => setPublishReview(true)}
										>
											Publish fees…
										</button>
									</div>
								</fieldset>
							</form>
							{publishReview && (
								<section
									className="fee-panel admin-section admin-publish"
									aria-labelledby="publish-heading"
								>
									<h2 id="publish-heading">
										Publish {config.settings.academicYear} fees?
									</h2>
									<p>
										This replaces the public calculator's current fees for both
										campuses immediately. If these fees are for the Term 4
										release, leave them as a saved draft until then.
									</p>
									<button
										className="admin-primary"
										disabled={busy}
										onClick={() =>
											run(async () => {
												loadEditor(await adminApi("publish", { revision }));
												setNotice(
													"Fees published. The public calculator now uses this schedule.",
												);
											})
										}
									>
										Publish now
									</button>
									<button
										disabled={busy}
										onClick={() => setPublishReview(false)}
									>
										Keep as draft
									</button>
								</section>
							)}
						</>
					)
				)}
			</main>
		</div>
	);
}
