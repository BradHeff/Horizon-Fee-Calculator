import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { setCampus } from "../reducer/action";
import Layout from "../HOC/Layout";
import { createCampusTheme } from "../theme/horizonTheme";
import FeeConfigService from "../services/FeeConfigService";
import Main from "./Main/Main";

const App = ({ campus, onSetCampus }) => {
	const [status, setStatus] = useState({ loading: true, error: "" });
	const [draftId, setDraftId] = useState("");
	const [retry, setRetry] = useState(0);
	useEffect(() => {
		let active = true;
        const controller = new AbortController();
		let pending = false;
		const refresh = async () => {
			if (pending) return;
			pending = true;
			try {
				const data = await FeeConfigService.loadPublished(draftId, controller.signal);
                if (active) {
                    FeeConfigService.config = data.config;
                    setStatus({loading:false, error:"", adminMaintenance:data.maintenance, drafts:data.drafts || [], preview:data.preview, previewLoading:false});
                    setDraftId(data.preview?.id || "");
                }
			} catch (err) {
				if (active)
					setStatus({
						loading: false,
                        maintenance: err.maintenance === true,
						error:
							"Current fees could not be loaded. Please try again or contact the school office.",
					});
			} finally {
				pending = false;
			}
		};
		refresh();
		const timer = setInterval(refresh, 15000);
		window.addEventListener("focus", refresh);
		return () => {
			active = false;
            controller.abort();
			clearInterval(timer);
			window.removeEventListener("focus", refresh);
		};
	}, [retry, draftId]);
	return (
		<ThemeProvider theme={createCampusTheme(campus)}>
			<Layout campus={campus}>
				{status.loading ? (
					<main className="fee-page">
						<p role="status">Loading current fees…</p>
					</main>
				) : status.maintenance ? (
                    <main className="fee-page"><section className="fee-panel" style={{padding: "32px"}} role="status">
                        <h1>Calculator under Maintenance</h1>
                        <p>Check back in a few minutes.</p>
                        <a href="/admin">Administrator sign in</a>
                    </section></main>
                ) : status.error ? (
					<main className="fee-page">
						<p role="alert">{status.error}</p>
						<button className="fee-add" onClick={() => setRetry(retry + 1)}>
							Try again
						</button>
					</main>
				) : (
					<>
                        {status.adminMaintenance && <div className="fee-page fee-maintenance-notice">
                            <p role="status">Maintenance is on. {status.preview ? `Previewing draft: ${status.preview.name}. These fees are not published.` : "Showing published fees. Only signed-in administrators can use the calculator."}</p>
                            <label className="fee-preview-selector">Fees to test
                                <select value={draftId} onChange={event => {
                                    setStatus(current => ({...current,previewLoading:true}));
                                    setDraftId(event.target.value);
                                }}>
                                    <option value="">Published fees</option>
                                    {(status.drafts || []).map(d => <option key={d.id} value={d.id}>{d.name} · {d.year}</option>)}
                                </select>
                            </label>
                            {status.previewLoading && <p role="status">Loading selected fees…</p>}
                        </div>}
                        <div style={status.previewLoading ? {visibility:"hidden"} : undefined}>
                            <Main campus={campus} onSetCampus={onSetCampus} />
                        </div>
                    </>
				)}
			</Layout>
		</ThemeProvider>
	);
};

export default connect(
	(state) => ({ campus: state.BaseReducer.campus }),
	(dispatch) => ({ onSetCampus: (campus) => dispatch(setCampus(campus)) }),
)(App);
