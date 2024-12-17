import React,{Component} from "react";
// import { Routes, Route, Navigate, useLocation} from 'react-router-dom';
// import { animateScroll as scroller } from 'react-scroll'

import "../assets/css/campus-selector.css"; // Add this line
import {setB2T,setCampus,setNavbar,setToggle} from "../reducer/action";

import {connect} from "react-redux";

import Layout from "../HOC/Layout";
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
    return (
      <>
      {this.props.campus === null? (
        <CampusSelector onSelectCampus={this.props.onSetCampus} />
      ): (
        <Layout
          navbar={this.props.sbar}
          onSetToggle={this.props.onSetToggle}
          toggle={this.props.toggle}
        >
          <Main onSetNavbar={this.props.onSetNavbar} show={this.props.show} campus={this.props.campus}/>
        </Layout>
      )}</>
    );
  }
}
const CampusSelector = ({ onSelectCampus }) => (
  <div className="campus-selector">
    <h1 className="campus-selector__title">Select Your Campus</h1>
    <div className="campus-selector__options">
      <div 
        className="campus-selector__option"
        onClick={() => onSelectCampus(0)}
      >
        <h2>Balaklva Campus</h2>
        <p>Select this option if you're enrolling at our Horizon Christian School Balaklva campus.</p>
      </div>
      <div 
        className="campus-selector__option"
        onClick={() => onSelectCampus(1)}
      >
        <h2>Clare Campus</h2>
        <p>Select this option if you're enrolling at our Clare Valley Horizon Christian School campus.</p>
      </div>
    </div>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(App);
