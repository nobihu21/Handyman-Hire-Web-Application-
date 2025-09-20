import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import Slider from 'react-slick';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear'
  };

  const sliderImages = [
    {
      url: 'https://images.unsplash.com/photo-1574359411659-15573a68aaae?ixlib=rb-4.0.3',
      title: 'Professional Handyman Services',
      subtitle: 'Expert solutions for all your home maintenance needs'
    },
    {
      url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3',
      title: 'Skilled & Verified Professionals',
      subtitle: 'Trust our experienced handymen for quality service'
    },
    {
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3',
      title: 'Book Services Online',
      subtitle: 'Easy scheduling at your convenience'
    }
  ];

  const services = [
    {
      title: 'Electrician Services',
      description: 'Professional electrical services for your home and office',
      icon: '⚡',
      color: '#007bff',
      features: [
        'AC Installation & Repair',
        'Electrical Wiring',
        'Fan Installation',
        'Light Installation',
        'Circuit Repair'
      ]
    },
    {
      title: 'Plumber Services',
      description: 'Expert plumbing solutions for all your needs',
      icon: '🔧',
      color: '#00a8e8',
      features: [
        'Pipe Repairs',
        'Drain Cleaning',
        'Water Tank Installation',
        'Tap & Faucet Repair',
        'Bathroom Fitting'
      ]
    }
  ];

  const testimonials = [
    {
      name: 'Ahmed Khan',
      role: 'Homeowner',
      text: 'I am extremely satisfied with the service. The electrician was professional, punctual, and solved the issue quickly. Highly recommended!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3'
    },
    {
      name: 'Sara Ali',
      role: 'Business Owner',
      text: 'Very reliable and punctual service. The plumber was knowledgeable and fixed our office plumbing issues efficiently. Will definitely use again!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3'
    },
    {
      name: 'Muhammad Hassan',
      role: 'Property Manager',
      text: 'Excellent work quality and reasonable prices. The carpenter did an amazing job with our furniture repairs. Great attention to detail!',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3'
    }
  ];

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: 30.1575,
    lng: 71.5249
  };

  const getActionButton = () => {
    if (!userType) {
      return (
        <Button className="book-now-btn" onClick={() => navigate('/login')}>
          Get Started
        </Button>
      );
    } else if (userType === 'customer') {
      return (
        <Button className="book-now-btn" onClick={() => navigate('/services')}>
          Book Now
        </Button>
      );
    } else {
      return (
        <Button className="book-now-btn" onClick={() => navigate('/dashboard/handyman')}>
          View Dashboard
        </Button>
      );
    }
  };

  return (
    <div className="home">
      {/* Hero Section with Slider */}
      <div className="hero-slider">
        <Slider {...sliderSettings}>
          {sliderImages.map((slide, index) => (
            <div key={index}>
              <div
                className="hero-slide"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${slide.url})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="hero-content">
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  {getActionButton()}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Services Section */}
      <section className="home-services-section">
        <Container>
          <h2 className="section-title text-center mb-5">Our Services</h2>
          <Row>
            {services.map((service, index) => (
              <Col key={index} md={6} className="mb-4">
                <Card 
                  className="home-service-card h-100"
                  style={{
                    '--card-color': service.color
                  }}
                >
                  <Card.Body>
                    <div className="service-icon-wrapper">
                      <span className="service-icon" style={{ color: service.color }}>
                        {service.icon}
                      </span>
                    </div>
                    <Card.Title className="service-title text-center mb-4">
                      {service.title}
                    </Card.Title>
                    <Card.Text className="service-description text-center mb-4">
                      {service.description}
                    </Card.Text>
                    <div className="service-features">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="feature-item">
                          <span className="feature-icon" style={{ color: service.color }}>✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="service-btn mt-4"
                      onClick={() => navigate('/services')}
                      style={{
                        '--btn-color': service.color
                      }}
                    >
                      View All Services
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Container>
          <h2 className="section-title">What Our Customers Say</h2>
          <Row>
            {testimonials.map((testimonial, index) => (
              <Col key={index} md={4}>
                <Card className="testimonial-card">
                  <Card.Body>
                    <Card.Text className="testimonial-text">{testimonial.text}</Card.Text>
                    <div className="testimonial-author-box">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="testimonial-image"
                      />
                      <div className="testimonial-info">
                        <h5 className="testimonial-author">{testimonial.name}</h5>
                        <p className="testimonial-role">{testimonial.role}</p>
                        <div className="rating">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <Container>
          <h2 className="section-title">Service Area</h2>
          <div className="map-container">
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
              />
            </LoadScript>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default Home; 