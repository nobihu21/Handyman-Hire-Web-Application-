import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ButtonGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cnic: '',
    userType: 'customer',
    address: '',
    // Additional fields for handyman
    serviceArea: '',
    specialization: '',
    experience: '',
    hourlyRate: '',
    availability: '',
    skills: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserTypeChange = (type) => {
    setFormData({
      ...formData,
      userType: type
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="register-card">
              <Card.Body className="p-4">
                <h2 className="register-title">Create Account</h2>
                
                <div className="user-type-selector">
                  <ButtonGroup>
                    <Button
                      variant="outline-primary"
                      className={`user-type-btn ${formData.userType === 'customer' ? 'active' : ''}`}
                      onClick={() => handleUserTypeChange('customer')}
                    >
                      Customer
                    </Button>
                    <Button
                      variant="outline-primary"
                      className={`user-type-btn ${formData.userType === 'handyman' ? 'active' : ''}`}
                      onClick={() => handleUserTypeChange('handyman')}
                    >
                      Handyman
                    </Button>
                  </ButtonGroup>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  {formData.userType === 'customer' ? (
                    <div className="form-section active">
                      <div className="form-section-title">Personal Information</div>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter your full name"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>CNIC</Form.Label>
                            <Form.Control
                              type="text"
                              name="cnic"
                              value={formData.cnic}
                              onChange={handleChange}
                              placeholder="Enter your CNIC (e.g., 12345-1234567-1)"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Enter your email"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="Enter your phone number"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              placeholder="Enter your complete address"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Enter your password"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder="Confirm your password"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  ) : (
                    <>
                      <div className="form-section active">
                        <div className="form-section-title">Personal Information</div>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Full Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>CNIC</Form.Label>
                              <Form.Control
                                type="text"
                                name="cnic"
                                value={formData.cnic}
                                onChange={handleChange}
                                placeholder="Enter your CNIC (e.g., 12345-1234567-1)"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Email address</Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Phone Number</Form.Label>
                              <Form.Control
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label>Address</Form.Label>
                              <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your complete address"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Password</Form.Label>
                              <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Confirm Password</Form.Label>
                              <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>

                      <div className="form-section active">
                        <div className="form-section-title">Professional Information</div>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Service Area</Form.Label>
                              <Form.Control
                                type="text"
                                name="serviceArea"
                                value={formData.serviceArea}
                                onChange={handleChange}
                                placeholder="Enter your service area"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Specialization</Form.Label>
                              <Form.Control
                                type="text"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                placeholder="Enter your specialization"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Experience (years)</Form.Label>
                              <Form.Control
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="Years of experience"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Hourly Rate ($)</Form.Label>
                              <Form.Control
                                type="number"
                                name="hourlyRate"
                                value={formData.hourlyRate}
                                onChange={handleChange}
                                placeholder="Your hourly rate"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label>Skills</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="List your skills (e.g., Plumbing, Electrical, Carpentry)"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label>Availability</Form.Label>
                              <Form.Control
                                type="text"
                                name="availability"
                                value={formData.availability}
                                onChange={handleChange}
                                placeholder="Your working hours (e.g., Mon-Fri 9AM-5PM)"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    </>
                  )}

                  <div className="d-grid mt-4">
                    <Button variant="primary" type="submit" className="register-btn">
                      Create Account
                    </Button>
                  </div>
                </Form>

                <div className="login-link-section">
                  <p className="login-text">
                    Already have an account? {' '}
                    <Link to="/login" className="login-link">
                      Login here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register; 