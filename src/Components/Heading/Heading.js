import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import * as Scroll from "react-scroll";

import Logo from "../../assets/images/favicon.png";
const Links = Scroll.Link;

const Heading = (props) => {
  const [expanded, setExpanded] = useState(false);

  const navToggle = () => {
    setExpanded(expanded ? false : true);
  };

  const closeNav = () => {
    setExpanded(false);
  };
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      expanded={expanded}
      className="shrink"
      fixed="top"
    >
      <Container>
        <Navbar.Brand href="#home">
          <img
            src={Logo}
            alt={Logo}
            className="img-fluid"
            style={{ opacity: "0.8" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          data-bs-toggle="collapse"
          data-bs-target="#responsive-navbar-nav"
          onClick={navToggle}
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Links
              to="home"
              className="nav-link"
              spy={true}
              smooth={true}
              offset={0}
              duration={500}
              onClick={closeNav}
            >
              Home
            </Links>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Heading;
