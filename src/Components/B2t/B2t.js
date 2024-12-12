import React from "react";
import * as Scroll from "react-scroll";

const Links = Scroll.Link;

const B2t = (props) => {
  return (
    <Links
      to="home"
      className={`scroll-top ${props.show ? "show" : ""}`}
      spy={true}
      smooth={true}
      offset={0}
      duration={500}
    >
      <i className="lni lni-chevron-up"></i>
    </Links>
  );
};

export default B2t;
