import React, { Component } from "react";
// import { Routes, Route, Navigate, useLocation} from 'react-router-dom';
// import { animateScroll as scroller } from 'react-scroll'

import { setB2T, setNavbar, setToggle } from "../reducer/action";

import { connect } from "react-redux";

import Layout from "../HOC/Layout";
import Main from "./Main/Main";

const mapStateToProps = (state) => {
  return {
    navbar: state.BaseReducer.navbar,
    toggle: state.BaseReducer.toggle,
    show: state.BaseReducer.show,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetNavbar: (link) => dispatch(setNavbar(link)),
    onSetToggle: (link) => dispatch(setToggle(link)),
    onShowB2T: (link) => dispatch(setB2T(link)),
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
    return (
      <Layout
        navbar={this.props.navbar}
        onSetToggle={this.props.onSetToggle}
        toggle={this.props.toggle}
      >
        <Main onSetNavbar={this.props.onSetNavbar} show={this.props.show} />
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
