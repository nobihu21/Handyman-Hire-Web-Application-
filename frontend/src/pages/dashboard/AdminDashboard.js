import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [handymen, setHandymen] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHandymen: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0
  });
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    // Check if user is admin
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      navigate('/login');
      return;
    }

    fetchUsers();
    fetchHandymen();
    fetchBookings();
    fetchStats();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users/admin/all', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
        setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchHandymen = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/handymen', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setHandymen(data);
      }
    } catch (err) {
      console.error('Error fetching handymen:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/bookings/admin/all', {
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

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleVerifyHandyman = async (handymanId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/handymen/${handymanId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchHandymen();
      }
    } catch (err) {
      console.error('Error verifying handyman:', err);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/users/${userId}/block`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Error blocking user:', err);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchBookings(); // Refresh bookings
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  return (
    <Container className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="users" title="Users">
          <Card>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.phone}</td>
                      <td>
                        <Button variant="info" size="sm" className="me-2">View</Button>
                        <Button variant="danger" size="sm">Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="bookings" title="Bookings">
          <Card>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Handyman</th>
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
                      <td>{booking.handyman.name}</td>
                      <td>{booking.service}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                      <td>
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                          className="form-select form-select-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <Button variant="info" size="sm">View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <h5>Total Users</h5>
              <h2>{stats.totalUsers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <h5>Total Handymen</h5>
              <h2>{stats.totalHandymen}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <h5>Total Bookings</h5>
              <h2>{stats.totalBookings}</h2>
              <div className="small text-muted">
                Completed: {stats.completedBookings} | Pending: {stats.pendingBookings}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Handymen Management */}
      <Card className="mb-4">
        <Card.Body>
          <h4 className="mb-4">Handymen Management</h4>
          <Table responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Services</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {handymen.map((handyman) => (
                <tr key={handyman.id}>
                  <td>{handyman.name}</td>
                  <td>{handyman.email}</td>
                  <td>{handyman.phone}</td>
                  <td>{handyman.services?.join(', ')}</td>
                  <td>
                    <Badge bg={handyman.verified ? 'success' : 'warning'}>
                      {handyman.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </td>
                  <td>
                    {!handyman.verified && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleVerifyHandyman(handyman.id)}
                      >
                        Verify
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* User Details Modal */}
      <Modal show={showUserDetails} onHide={() => setShowUserDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Address:</strong> {selectedUser.address}</p>
              <p><strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedUser.blocked ? 'Blocked' : 'Active'}</p>
              
              <h5 className="mt-4">Recent Bookings</h5>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter(booking => booking.user_id === selectedUser.id)
                    .slice(0, 5)
                    .map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.service}</td>
                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                        <td>{booking.status}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminDashboard; 