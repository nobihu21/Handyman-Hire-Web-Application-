import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const socialLinks = [
    {
      icon: 'fa-brands fa-facebook-f',
      link: 'https://facebook.com',
      color: '#1877F2',
      label: 'Facebook'
    },
    {
      icon: 'fa-brands fa-instagram',
      link: 'https://instagram.com',
      color: '#E4405F',
      label: 'Instagram'
    },
    {
      icon: 'fa-brands fa-twitter',
      link: 'https://twitter.com',
      color: '#1DA1F2',
      label: 'Twitter'
    },
    {
      icon: 'fa-solid fa-envelope',
      link: 'mailto:info@handymanhire.com',
      color: '#EA4335',
      label: 'Email'
    }
  ];

  return (
    <footer className="footer-wrapper">
      <Container>
        <Row>
          <Col md={4}>
            <div className="footer-section">
              <h5 className="footer-heading">About Us</h5>
              <p className="footer-text">
                We are dedicated to providing quality handyman services to our customers.
                Our team of skilled professionals is committed to delivering excellence
                in every project we undertake.
              </p>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ '--hover-color': social.color }}
                    aria-label={social.label}
                  >
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="footer-section">
              <h5 className="footer-heading">Quick Links</h5>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
          </Col>
          <Col md={4}>
            <div className="footer-section">
              <h5 className="footer-heading">Contact Info</h5>
              <ul className="footer-contact">
                <li>
                  <i className="fa-solid fa-phone"></i>
                  <a href="tel:+923166252830">+92 316 6252830</a>
                </li>
                <li>
                  <i className="fa-solid fa-envelope"></i>
                  <a href="mailto:info@handymanhire.com">info@handymanhire.com</a>
                </li>
                <li>
                  <i className="fa-solid fa-location-dot"></i>
                  <span>Multan, Pakistan</span>
                </li>
                <li>
                  <i className="fa-solid fa-clock"></i>
                  <span>24/7 Available</span>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <div className="footer-bottom">
              <p className="copyright">
                &copy; {new Date().getFullYear()} HandymanHire. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 