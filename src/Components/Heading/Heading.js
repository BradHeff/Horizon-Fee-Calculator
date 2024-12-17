import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import Logo from "../../assets/images/favicon.png";

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
        <Navbar.Brand
          href={
            props.campus === 0
              ? "https://balaklava.horizon.sa.edu.au/"
              : "https://clare.horizon.sa.edu.au/"
          }
        >
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
            <a
              href={
                props.campus === 0
                  ? "https://balaklava.horizon.sa.edu.au/"
                  : "https://clare.horizon.sa.edu.au/"
              }
              className="nav-link"
              onClick={closeNav}
            >
              Home
            </a>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Heading;
