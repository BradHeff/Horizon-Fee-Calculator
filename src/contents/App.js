import { Component } from "react";
// import { Routes, Route, Navigate, useLocation} from 'react-router-dom';
// import { animateScroll as scroller } from 'react-scroll'

import { connect } from "react-redux";
import { setB2T, setCampus, setNavbar, setToggle } from "../reducer/action";

import { ThemeProvider } from "@mui/material/styles";
import CampusSelector from "../Components/CampusSelector/CampusSelector";
import Layout from "../HOC/Layout";
import { createCampusTheme } from "../theme/horizonTheme";
import Main from "./Main/Main";

const mapStateToProps = (state) => {
	return {
		sbar: state.BaseReducer.sbar,
		toggle: state.BaseReducer.toggle,
		show: state.BaseReducer.show,
		campus: state.BaseReducer.campus,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onSetNavbar: (link) => dispatch(setNavbar(link)),
		onSetToggle: (link) => dispatch(setToggle(link)),
		onShowB2T: (link) => dispatch(setB2T(link)),
		onSetCampus: (link) => dispatch(setCampus(link)),
	};
};

class App extends Component {
	componentDidMount() {
		window.addEventListener("scroll", this.Scroller, { passive: true });
	}

	Scroller = () => {
		if (window.scrollY <= 30 && window.scrollY >= 0) {
			this.props.onSetNavbar("");
			this.props.onShowB2T(false);
		} else if (
			(window.scrollY >= 30 && window.scrollY <= 60) ||
			(window.scrollY >= 31 && this.props.navbar === undefined) ||
			(window.scrollY >= 31 && this.props.navbar === "")
		) {
			this.props.onSetNavbar("shrink");
			this.props.onShowB2T(true);
		}
	};

	render() {
		const campusTheme =
			this.props.campus !== null
				? createCampusTheme(this.props.campus)
				: null;

		return (
			<>
				{this.props.campus === null ? (
					<CampusSelector onSelectCampus={this.props.onSetCampus} />
				) : (
					<ThemeProvider theme={campusTheme}>
						<Layout
							navbar={this.props.sbar}
							onSetToggle={this.props.onSetToggle}
							toggle={this.props.toggle}
							campus={this.props.campus}
						>
							<Main
								onSetNavbar={this.props.onSetNavbar}
								show={this.props.show}
								campus={this.props.campus}
								onSetCampus={this.props.onSetCampus}
							/>
						</Layout>
					</ThemeProvider>
				)}
			</>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
