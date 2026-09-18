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
	const [retry, setRetry] = useState(0);
	useEffect(() => {
		let active = true;
		let pending = false;
		const refresh = async () => {
			if (pending) return;
			pending = true;
			try {
				await FeeConfigService.loadPublished();
				if (active) setStatus({ loading: false, error: "" });
			} catch {
				if (active)
					setStatus({
						loading: false,
						error:
							"Current fees could not be loaded. Please try again or contact the school office.",
					});
			} finally {
				pending = false;
			}
		};
		refresh();
		const timer = setInterval(refresh, 60000);
		window.addEventListener("focus", refresh);
		return () => {
			active = false;
			clearInterval(timer);
			window.removeEventListener("focus", refresh);
		};
	}, [retry]);
	return (
		<ThemeProvider theme={createCampusTheme(campus)}>
			<Layout campus={campus}>
				{status.loading ? (
					<main className="fee-page">
						<p role="status">Loading current fees…</p>
					</main>
				) : status.error ? (
					<main className="fee-page">
						<p role="alert">{status.error}</p>
						<button className="fee-add" onClick={() => setRetry(retry + 1)}>
							Try again
						</button>
					</main>
				) : (
					<Main campus={campus} onSetCampus={onSetCampus} />
				)}
			</Layout>
		</ThemeProvider>
	);
};

export default connect(
	(state) => ({ campus: state.BaseReducer.campus }),
	(dispatch) => ({ onSetCampus: (campus) => dispatch(setCampus(campus)) }),
)(App);
