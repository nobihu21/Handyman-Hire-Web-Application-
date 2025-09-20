import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    // For demo purposes, show success message
    setSuccess('Thank you for your message. We will get back to you soon!');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Address',
      content: 'Multan, Pakistan',
      animation: 'slide-right'
    },
    {
      icon: '📧',
      title: 'Email',
      content: 'info@handyman.com',
      link: 'mailto:info@handyman.com',
      animation: 'slide-up'
    },
    {
      icon: '📱',
      title: 'Phone',
      content: '+92 316 6252830',
      link: 'tel:+923166252830',
      animation: 'slide-up'
    },
    {
      icon: '⏰',
      title: 'Availability',
      content: 'Working 24/7',
      animation: 'slide-left'
    }
  ];

  const socialLinks = [
    {
      icon: 'bi bi-whatsapp',
      name: 'WhatsApp',
      link: 'https://wa.me/923166252830',
      color: '#25D366'
    },
    {
      icon: 'bi bi-facebook',
      name: 'Facebook',
      link: '#',
      color: '#1877F2'
    },
    {
      icon: 'bi bi-instagram',
      name: 'Instagram',
      link: '#',
      color: '#E4405F'
    }
  ];

  return (
    <div className="contact-page">
      <Container className="my-5">
        <div className="contact-header text-center mb-5">
          <h1 className="display-4">Get in Touch</h1>
          <p className="lead">We're here to help you 24/7. Reach out to us anytime!</p>
        </div>

        <Row className="g-4">
          <Col lg={5}>
            <div className="contact-info-wrapper">
              <div className="info-cards">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className={`info-card ${info.animation}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="info-icon">{info.icon}</span>
                    <div className="info-content">
                      <h4>{info.title}</h4>
                      {info.link ? (
                        <a href={info.link} className="info-text">
                          {info.content}
                        </a>
                      ) : (
                        <p className="info-text">{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="social-links-wrapper">
                <h3>Connect With Us</h3>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={index}
                      href={social.link}
                      className="social-link"
                      style={{ '--hover-color': social.color }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className={social.icon}></i>
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Col>

          <Col lg={7}>
            <Card className="contact-form-card">
              <Card.Body className="p-4">
                <h3 className="form-title">Send us a Message</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit} className="contact-form">
                  <Form.Group className="form-group">
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your Name"
                      className={focusedField === 'name' ? 'focused' : ''}
                      required
                    />
                    <span className="focus-border"></span>
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your Email"
                      className={focusedField === 'email' ? 'focused' : ''}
                      required
                    />
                    <span className="focus-border"></span>
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Subject"
                      className={focusedField === 'subject' ? 'focused' : ''}
                      required
                    />
                    <span className="focus-border"></span>
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your Message"
                      className={focusedField === 'message' ? 'focused' : ''}
                      required
                    />
                    <span className="focus-border"></span>
                  </Form.Group>

                  <Button type="submit" className="submit-btn">
                    <span className="btn-text">Send Message</span>
                    <span className="btn-icon">
                      <i className="bi bi-send"></i>
                    </span>
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact; 