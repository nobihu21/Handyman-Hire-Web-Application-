import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <Navbar expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Handyman Hiring
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={isActive('/')}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/services" className={isActive('/services')}>
              Services
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className={isActive('/about')}>
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className={isActive('/contact')}>
              Contact
            </Nav.Link>
          </Nav>
          <Nav className="auth-buttons">
            {!isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/login" className={isActive('/login')}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className={isActive('/register')}>
                  Register
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to={`/dashboard/${userType}`} 
                  className={`dashboard-btn ${isActive(`/dashboard/${userType}`)}`}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link 
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header; 