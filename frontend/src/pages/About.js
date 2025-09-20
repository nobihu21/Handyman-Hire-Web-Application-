import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './About.css';

const About = () => {
  const teamMembers = [
    {
      name: "Hafiz Muhammad Maaz Saif",
      role: "Founder & Lead Developer",
      image: "https://via.placeholder.com/150",
      description: "Passionate about creating innovative solutions that make a difference in people's lives.",
      social: {
        linkedin: "https://linkedin.com/in/maazsaif",
        github: "https://github.com/maazsaif",
        email: "mailto:maazsaif@example.com"
      }
    },
    {
      name: "Ayaz Ahmad",
      role: "Co-Founder & Technical Lead",
      image: "https://via.placeholder.com/150",
      description: "Expert in building scalable applications and leading technical teams.",
      social: {
        linkedin: "https://linkedin.com/in/ayazahmad",
        github: "https://github.com/ayazahmad",
        email: "mailto:ayazahmad@example.com"
      }
    }
  ];

  const features = [
    {
      icon: "fas fa-user-friends",
      title: "User-Friendly Interface",
      description: "Intuitive design that makes booking handyman services effortless"
    },
    {
      icon: "fas fa-calendar-check",
      title: "Real-Time Booking",
      description: "Instant booking and scheduling with real-time availability"
    },
    {
      icon: "fas fa-id-card",
      title: "Verified Profiles",
      description: "Thoroughly vetted handymen with detailed profiles and ratings"
    },
    {
      icon: "fas fa-star",
      title: "Customer Reviews",
      description: "Transparent review system to help you make informed decisions"
    },
    {
      icon: "fas fa-shield-alt",
      title: "Secure Payments",
      description: "Safe and secure payment processing for all transactions"
    },
    {
      icon: "fas fa-headset",
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your needs"
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="hero-content">
                <h1 className="hero-title">About HandymanHire</h1>
                <p className="hero-text">
                  HandymanHire is a revolutionary platform that connects skilled professionals with homeowners 
                  who need reliable handyman services. We understand the challenges of finding trustworthy 
                  service providers, and we're here to make that process simple, secure, and efficient.
                </p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <i className="fas fa-users"></i>
                    <h3>1000+</h3>
                    <p>Happy Customers</p>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-tools"></i>
                    <h3>200+</h3>
                    <p>Expert Handymen</p>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-star"></i>
                    <h3>4.8</h3>
                    <p>Average Rating</p>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-check-circle"></i>
                    <h3>5000+</h3>
                    <p>Services Completed</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image">
                <img src="https://via.placeholder.com/600x400" alt="About HandymanHire" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <h2 className="section-title">Our Key Features</h2>
          <Row>
            {features.map((feature, index) => (
              <Col md={4} key={index}>
                <div className="feature-card">
                  <i className={feature.icon}></i>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <Container>
          <h2 className="section-title">Meet Our Team</h2>
          <Row className="justify-content-center">
            {teamMembers.map((member, index) => (
              <Col md={6} key={index}>
                <Card className="team-card">
                  <div className="team-image">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <Card.Body>
                    <h3>{member.name}</h3>
                    <p className="role">{member.role}</p>
                    <p className="description">{member.description}</p>
                    <div className="social-links">
                      <a href={member.social.linkedin} className="social-link" target="_blank" rel="noopener noreferrer" aria-label={`Visit ${member.name}'s LinkedIn profile`}>
                        <i className="fab fa-linkedin"></i>
                      </a>
                      <a href={member.social.github} className="social-link" target="_blank" rel="noopener noreferrer" aria-label={`Visit ${member.name}'s GitHub profile`}>
                        <i className="fab fa-github"></i>
                      </a>
                      <a href={member.social.email} className="social-link" target="_blank" rel="noopener noreferrer" aria-label={`Email ${member.name}`}>
                        <i className="fas fa-envelope"></i>
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <div className="contact-form-wrapper">
                <h2 className="section-title">Get in Touch</h2>
                <p className="text-center mb-4">Have questions? We'd love to hear from you.</p>
                <form className="contact-form">
                  <div className="form-group">
                    <input type="text" placeholder="Your Name" className="form-control" />
                  </div>
                  <div className="form-group">
                    <input type="email" placeholder="Your Email" className="form-control" />
                  </div>
                  <div className="form-group">
                    <textarea placeholder="Your Message" className="form-control" rows="5"></textarea>
                  </div>
                  <button type="submit" className="submit-btn">Send Message</button>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About; 