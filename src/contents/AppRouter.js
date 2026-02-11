import { Component } from "react";
import { connect } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { setB2T, setCampus, setNavbar, setToggle } from "../reducer/action";
import App from "./App";

class AppRouter extends Component {
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
		return (
			<Routes>
				<Route path="/" element={<App {...this.props} />} />
			</Routes>
		);
	}
}

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

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
