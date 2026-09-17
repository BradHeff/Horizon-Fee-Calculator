import { connect } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { setCampus } from "../reducer/action";
import Layout from "../HOC/Layout";
import { createCampusTheme } from "../theme/horizonTheme";
import Main from "./Main/Main";

const App = ({ campus, onSetCampus }) => (
	<ThemeProvider theme={createCampusTheme(campus)}>
		<Layout campus={campus}>
			<Main campus={campus} onSetCampus={onSetCampus} />
		</Layout>
	</ThemeProvider>
);

export default connect(
	(state) => ({ campus: state.BaseReducer.campus }),
	(dispatch) => ({ onSetCampus: (campus) => dispatch(setCampus(campus)) }),
)(App);
