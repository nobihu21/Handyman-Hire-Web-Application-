import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './HandymanDashboard.css';

function HandymanDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editedProfile, setEditedProfile] = useState({});
  const [location, setLocation] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    skills: '',
    experience: '',
    hourlyRate: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if user is handyman
    const userType = localStorage.getItem('userType');
    if (userType !== 'handyman') {
      navigate('/login');
      return;
    }

    fetchJobs();
    fetchProfile();
    fetchBookings();
    startLocationTracking();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/handyman/jobs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setJobs(data);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/profile/${localStorage.getItem('userId')}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name,
        phone: data.phone,
        address: data.address,
        skills: data.skills.join(', '),
        experience: data.experience,
        hourlyRate: data.hourlyRate
      });
      setEditedProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/handyman/${localStorage.getItem('userId')}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const startLocationTracking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(newLocation);
          updateLocation(newLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const updateLocation = async (location) => {
    try {
      await fetch('http://localhost:8000/api/handyman/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(location)
      });
    } catch (err) {
      console.error('Error updating location:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:8000/api/users/profile/${localStorage.getItem('userId')}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(',').map(skill => skill.trim())
        })
      });

      if (response.ok) {
        setSuccess('Profile updated successfully');
        setEditMode(false);
        fetchProfile();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/jobs/${selectedJob.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: e.target.status.value })
      });

      if (response.ok) {
        fetchJobs();
        setShowUpdateStatus(false);
      }
    } catch (err) {
      console.error('Error updating job status:', err);
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="handyman-dashboard">
      <h1 className="dashboard-title">Handyman Dashboard</h1>

      <Row>
        <Col md={4}>
          <Card className="profile-card">
            <Card.Body>
              <h3>Profile</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {editMode ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Skills (comma-separated)</Form.Label>
                    <Form.Control
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Experience</Form.Label>
                    <Form.Control
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Hourly Rate</Form.Label>
                    <Form.Control
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">Save Changes</Button>
                    <Button variant="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
                  </div>
                </Form>
              ) : (
                <>
                  <div className="profile-info">
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Phone:</strong> {profile.phone}</p>
                    <p><strong>Address:</strong> {profile.address}</p>
                    <p><strong>Skills:</strong> {profile.skills.join(', ')}</p>
                    <p><strong>Experience:</strong> {profile.experience}</p>
                    <p><strong>Rating:</strong> {profile.rating}</p>
                  </div>
                  <Button variant="primary" onClick={() => setEditMode(true)}>Edit Profile</Button>
                </>
              )}
            </Card.Body>
          </Card>

          {location && (
            <Card className="mb-4">
              <Card.Body>
                <h4 className="mb-3">Current Location</h4>
                <p><strong>Latitude:</strong> {location.lat}</p>
                <p><strong>Longitude:</strong> {location.lng}</p>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={8}>
          <Card>
            <Card.Body>
              <h3>My Bookings</h3>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.customer.name}</td>
                      <td>{booking.service}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                      <td>{booking.status}</td>
                      <td>
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              className="me-2"
                              onClick={() => handleBookingStatus(booking._id, 'accepted')}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleBookingStatus(booking._id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {booking.status === 'accepted' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleBookingStatus(booking._id, 'completed')}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Update Status Modal */}
      <Modal show={showUpdateStatus} onHide={() => setShowUpdateStatus(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Job Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleStatusUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" defaultValue={selectedJob?.status}>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Update Status
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default HandymanDashboard; 