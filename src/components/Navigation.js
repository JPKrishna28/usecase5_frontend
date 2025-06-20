import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="fas fa-shield-alt me-2"></i>
          Audio Threat Detector
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              <i className="fas fa-home me-1"></i>Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/history">
              <i className="fas fa-history me-1"></i>History
            </Nav.Link>
            <Nav.Link as={NavLink} to="/upload">
              <i className="fas fa-upload me-1"></i>Upload
            </Nav.Link>
          </Nav>
          <div className="d-flex text-light">
            <i className="fas fa-user-circle me-1"></i>
            <span className="me-3">JPKrishna28</span>
            <i className="fas fa-clock me-1"></i>
            <span>{new Date().toLocaleString()}</span>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;