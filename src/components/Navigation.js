import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

const Navigation = () => {
  const currentDate = "2025-06-21 04:31:05";
  const currentUser = "JPKrishna28";

  return (
    <Navbar bg="white" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="fas fa-shield-alt me-2"></i>
          Audio Threat Detector
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              <i className="fas fa-home me-1"></i> Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/history">
              <i className="fas fa-history me-1"></i> History
            </Nav.Link>

          </Nav>
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="user-dropdown" className="d-flex align-items-center">
              <i className="fas fa-user-circle me-2"></i>
              <span>{currentUser}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item disabled>
                <i className="fas fa-clock me-2"></i> {currentDate}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#">
                <i className="fas fa-cog me-2"></i> Settings
              </Dropdown.Item>
              <Dropdown.Item href="#">
                <i className="fas fa-sign-out-alt me-2"></i> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;