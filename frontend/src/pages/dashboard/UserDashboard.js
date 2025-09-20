import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';

function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    fetchBookings();
    fetchProfile();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/bookings/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setBookings(data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setProfile(data);
        setEditedProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editedProfile)
      });

      if (response.ok) {
        setProfile(editedProfile);
        setShowEditProfile(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          fetchBookings();
        }
      } catch (err) {
        console.error('Error canceling booking:', err);
      }
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">User Dashboard</h2>
      
      <Row>
        {/* Profile Section */}
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Profile</h4>
                <Button variant="primary" size="sm" onClick={() => setShowEditProfile(true)}>
                  Edit Profile
                </Button>
              </div>
              {profile && (
                <div>
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone:</strong> {profile.phone}</p>
                  <p><strong>Address:</strong> {profile.address}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Bookings Section */}
        <Col md={8}>
          <Card>
            <Card.Body>
              <h4 className="mb-4">Booking History</h4>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.service}</td>
                      <td>{booking.category}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                      <td>{booking.status}</td>
                      <td>
                        {booking.status === 'pending' && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
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

      {/* Edit Profile Modal */}
      <Modal show={showEditProfile} onHide={() => setShowEditProfile(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleProfileUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editedProfile.name || ''}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                value={editedProfile.phone || ''}
                onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={editedProfile.address || ''}
                onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                required
              />
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default UserDashboard; 