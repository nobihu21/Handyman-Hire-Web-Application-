import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import './Services.css';
import ChatModule from '../components/ChatModule';

function Services() {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [animateCards, setAnimateCards] = useState(false);
  const [problemDescriptions, setProblemDescriptions] = useState({
    electrician: '',
    plumber: ''
  });
  const [showEstimates, setShowEstimates] = useState({
    electrician: false,
    plumber: false
  });
  const [showChat, setShowChat] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  // Initialize animation on component mount
  useEffect(() => {
    setAnimateCards(true);
  }, []);

  // Reset and trigger animation when filter changes
  useEffect(() => {
    setAnimateCards(false);
    const timer = setTimeout(() => {
      setAnimateCards(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [activeFilter]);

  const services = {
    electrician: {
      title: 'Electrician Services',
      icon: '⚡',
      color: '#007bff',
      categories: [
        {
          name: 'AC Installation & Repair',
          description: 'Professional AC installation, maintenance, and repair services',
          price: 'Starting from Rs. 2000'
        },
        {
          name: 'Electrical Wiring',
          description: 'Complete home and office wiring solutions',
          price: 'Starting from Rs. 1500'
        },
        {
          name: 'Fan Installation',
          description: 'Expert ceiling and wall fan installation',
          price: 'Starting from Rs. 800'
        },
        {
          name: 'Light Installation',
          description: 'Modern lighting solutions and fixtures',
          price: 'Starting from Rs. 500'
        },
        {
          name: 'Circuit Repair',
          description: 'Quick and reliable circuit repair services',
          price: 'Starting from Rs. 1000'
        },
        {
          name: 'Power Socket Installation',
          description: 'Safe and secure power socket installations',
          price: 'Starting from Rs. 600'
        }
      ]
    },
    plumber: {
      title: 'Plumber Services',
      icon: '🔧',
      color: '#00a8e8',
      categories: [
        {
          name: 'Pipe Installation',
          description: 'Professional pipe fitting and installation',
          price: 'Starting from Rs. 1500'
        },
        {
          name: 'Drain Cleaning',
          description: 'Advanced drain cleaning and maintenance',
          price: 'Starting from Rs. 1000'
        },
        {
          name: 'Water Tank Installation',
          description: 'Expert water tank installation services',
          price: 'Starting from Rs. 3000'
        },
        {
          name: 'Tap & Faucet Repair',
          description: 'Quick tap and faucet repair solutions',
          price: 'Starting from Rs. 500'
        },
        {
          name: 'Bathroom Fitting',
          description: 'Complete bathroom installation services',
          price: 'Starting from Rs. 2500'
        },
        {
          name: 'Water Heater Installation',
          description: 'Professional water heater setup',
          price: 'Starting from Rs. 2000'
        }
      ]
    }
  };

  const serviceGuidelines = {
    electrician: {
      minFare: 500,
      commonIssues: [
        'No power in specific area',
        'Circuit breaker tripping',
        'Flickering lights',
        'Fan not working',
        'Switch/socket issues'
      ],
      estimateRanges: {
        'AC Issues': '1000-3000',
        'Wiring Work': '1500-5000',
        'Fan Installation': '800-1500',
        'Basic Repairs': '500-1000'
      }
    },
    plumber: {
      minFare: 600,
      commonIssues: [
        'Water leakage',
        'Blocked drain',
        'Low water pressure',
        'Tap/faucet issues',
        'Toilet problems'
      ],
      estimateRanges: {
        'Pipe Repairs': '800-2000',
        'Drain Cleaning': '1000-2500',
        'Tank Work': '2000-5000',
        'Basic Repairs': '600-1200'
      }
    }
  };

  const handleProblemDescription = (serviceType, description) => {
    setProblemDescriptions(prev => ({
      ...prev,
      [serviceType]: description
    }));

    if (description.length > 10) {
      setShowEstimates(prev => ({
        ...prev,
        [serviceType]: true
      }));
    }
  };

  const handleProblemSubmit = (serviceType, description) => {
    if (!description.trim()) {
      alert('Please describe your problem first');
      return;
    }
    setSelectedService({
      type: serviceType,
      category: 'Custom Service',
      description: description
    });
    setShowBooking(true);
  };

  const handleBooking = (serviceType, category) => {
    console.log('Booking clicked:', serviceType, category); // Debug log
    const service = {
      type: serviceType,
      category: category.name,
      description: category.description
    };
    console.log('Setting selected service:', service); // Debug log
    setSelectedService(service);
    console.log('Opening booking modal'); // Debug log
    setShowBooking(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          serviceType: selectedService.type,
          category: selectedService.category,
          description: selectedService.description,
          preferredDate: formData.get('preferredDate'),
          preferredTime: formData.get('preferredTime'),
          address: formData.get('address'),
          city: formData.get('city'),
          pincode: formData.get('pincode'),
          additionalNotes: formData.get('additionalNotes'),
          userId: localStorage.getItem('userId')
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setBookingStatus({
          status: 'success',
          message: 'Booking successful! A handyman will be assigned soon.',
          bookingId: data.bookingId,
          handymanId: data.handymanId,
          handymanName: data.handymanName
        });
        setShowBooking(false);
        setShowChat(true);
      } else {
        setBookingStatus({
          status: 'error',
          message: data.message || 'Failed to create booking'
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingStatus({
        status: 'error',
        message: 'Failed to create booking. Please try again.'
      });
    }
  };

  const filterServices = (filter) => {
    setActiveFilter(filter);
  };

  const getFilteredServices = () => {
    if (activeFilter === 'all') {
      return Object.entries(services);
    }
    return Object.entries(services).filter(([key]) => key === activeFilter);
  };

  return (
    <Container className="services-container my-5">
      <h1 className="text-center mb-5 services-title">Our Professional Services</h1>

      <div className="filter-buttons mb-4">
        <Button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => filterServices('all')}
        >
          All Services
        </Button>
        <Button 
          className={`filter-btn ${activeFilter === 'electrician' ? 'active' : ''}`}
          onClick={() => filterServices('electrician')}
        >
          Electrician
        </Button>
        <Button 
          className={`filter-btn ${activeFilter === 'plumber' ? 'active' : ''}`}
          onClick={() => filterServices('plumber')}
        >
          Plumber
        </Button>
      </div>

      <div className="services-grid">
        {getFilteredServices().map(([key, service]) => (
          <div key={key} className={`service-section ${animateCards ? 'animate' : ''}`}>
            <div className="service-header">
              <span className="service-icon">{service.icon}</span>
              <h2 className="service-title">{service.title}</h2>
            </div>
            <Row>
              {service.categories.map((category, index) => (
                <Col key={index} lg={4} md={6} className="mb-4">
                  <Card 
                    className="service-card"
                    style={{
                      '--card-color': service.color,
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <Card.Body>
                      <Card.Title className="category-title">{category.name}</Card.Title>
                      <Card.Text className="category-description">
                        {category.description}
                      </Card.Text>
                      <div className="price-tag">{category.price}</div>
                      <Button 
                        className="book-btn"
                        onClick={() => handleBooking(key, category)}
                        style={{ 
                          backgroundColor: service.color,
                          color: 'white'
                        }}
                      >
                        Book Now
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Problem Description Box */}
            <div className="problem-description-box mt-5">
              <h3 className="description-section-title">Need Help? Describe Your Problem</h3>
              <div className="description-content">
                <div className="description-left">
                  <h5 className="description-title">
                    Describe Your Issue
                    <span className="min-fare">
                      Minimum Service Charge: Rs. {serviceGuidelines[key].minFare}
                    </span>
                  </h5>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder={`Describe your ${service.title.toLowerCase()} related issue here...`}
                    className="problem-input"
                    value={problemDescriptions[key]}
                    onChange={(e) => handleProblemDescription(key, e.target.value)}
                  />
                  
                  {/* Common Issues */}
                  <div className="common-issues">
                    <h6>Common Issues:</h6>
                    <div className="issues-list">
                      {serviceGuidelines[key].commonIssues.map((issue, idx) => (
                        <span 
                          key={idx} 
                          className="issue-tag"
                          onClick={() => handleProblemDescription(key, issue)}
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="submit-button-wrapper">
                    <Button
                      className="submit-problem-btn"
                      onClick={() => handleProblemSubmit(key, problemDescriptions[key])}
                      style={{ '--btn-color': service.color }}
                      disabled={!problemDescriptions[key].trim()}
                    >
                      <span className="btn-icon">📝</span>
                      Book Service Now
                      <span className="min-fare-note">
                        Starting from Rs. {serviceGuidelines[key].minFare}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Estimated Costs */}
                <div className="description-right">
                  {showEstimates[key] && (
                    <div className="estimate-section">
                      <h6>Estimated Cost Ranges:</h6>
                      <div className="estimate-grid">
                        {Object.entries(serviceGuidelines[key].estimateRanges)
                          .map(([work, range], idx) => (
                            <div key={idx} className="estimate-item">
                              <span className="work-type">{work}</span>
                              <span className="price-range">Rs. {range}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <Modal 
        show={showBooking} 
        onHide={() => setShowBooking(false)} 
        centered 
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Book Your Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedService && (
            <Form onSubmit={handleSubmitBooking}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Service Type</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={selectedService.type.charAt(0).toUpperCase() + selectedService.type.slice(1)} 
                      disabled 
                      className="form-control-plaintext"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={selectedService.category} 
                      disabled 
                      className="form-control-plaintext"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Service Description</Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={3}
                  value={selectedService.description}
                  disabled 
                  className="form-control-plaintext"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Preferred Date <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="date" 
                      name="preferredDate"
                      required 
                      min={new Date().toISOString().split('T')[0]}
                      className="form-control"
                    />
                    <Form.Text className="text-muted">
                      Select a date within the next 7 days
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Preferred Time <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="time" 
                      name="preferredTime"
                      required 
                      className="form-control"
                    />
                    <Form.Text className="text-muted">
                      Available hours: 9:00 AM - 6:00 PM
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Complete Address <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" 
                  name="address"
                  placeholder="Enter your complete address including landmarks"
                  required 
                  className="form-control"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="city"
                      placeholder="Enter your city"
                      required 
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pincode</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="pincode"
                      placeholder="Enter your pincode"
                      required 
                      pattern="[0-9]{6}"
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Additional Notes</Form.Label>
                <Form.Control 
                  as="textarea" 
                  name="additionalNotes"
                  rows={3} 
                  placeholder="Any specific requirements or additional details..."
                  className="form-control"
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit"
                  className="py-2"
                  style={{
                    backgroundColor: selectedService.type === 'electrician' ? '#007bff' : '#00a8e8',
                    border: 'none',
                    borderRadius: '25px',
                    fontWeight: '600'
                  }}
                >
                  Confirm Booking
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowBooking(false)}
                  className="py-2"
                  style={{
                    borderRadius: '25px',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Chat Modal */}
      <Modal 
        show={showChat} 
        onHide={() => setShowChat(false)} 
        centered 
        size="lg"
        className="chat-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chat with Handyman</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingStatus?.status === 'success' && (
            <ChatModule
              bookingId={bookingStatus.bookingId}
              userId={localStorage.getItem('userId')}
              handymanId={bookingStatus.handymanId}
              userName={localStorage.getItem('userName')}
              handymanName={bookingStatus.handymanName}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Status Alert */}
      {bookingStatus && (
        <div 
          className={`alert alert-${bookingStatus.status === 'success' ? 'success' : 'danger'} position-fixed top-0 end-0 m-3`} 
          role="alert"
          style={{ zIndex: 1050 }}
        >
          {bookingStatus.message}
          <button 
            type="button" 
            className="btn-close ms-2" 
            onClick={() => setBookingStatus(null)}
            aria-label="Close"
          ></button>
        </div>
      )}
    </Container>
  );
}

export default Services; 