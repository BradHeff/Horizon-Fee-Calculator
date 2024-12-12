import React from "react";
import Footer from "../Components/Footer/Footer";
import Heading from "../Components/Heading/Heading";

const Layout = (props) => {
  return (
    <div>
      <Heading
        navbar={props.navbar}
        onSetToggle={props.onSetToggle}
        toggle={props.toggle}
      />
      {props.children}
      <Footer />
    </div>
  );
};

export default Layout;
