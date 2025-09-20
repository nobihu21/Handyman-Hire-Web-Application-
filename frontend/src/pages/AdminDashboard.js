import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Dummy data
  const stats = {
    totalUsers: 150,
    totalHandymen: 45,
    activeBookings: 28,
    completedBookings: 120
  };

  const recentBookings = [
    { id: 1, customer: 'John Doe', service: 'Electrical Repair', handyman: 'Mike Smith', status: 'In Progress', date: '2024-03-15' },
    { id: 2, customer: 'Jane Smith', service: 'Plumbing', handyman: 'Tom Wilson', status: 'Completed', date: '2024-03-14' },
    { id: 3, customer: 'Bob Johnson', service: 'AC Installation', handyman: 'Sarah Brown', status: 'Pending', date: '2024-03-13' }
  ];

  const handymen = [
    { id: 1, name: 'Mike Smith', service: 'Electrician', rating: 4.8, status: 'Available' },
    { id: 2, name: 'Tom Wilson', service: 'Plumber', rating: 4.5, status: 'Busy' },
    { id: 3, name: 'Sarah Brown', service: 'Electrician', rating: 4.9, status: 'Available' }
  ];

  return (
    <Container fluid className="admin-dashboard">
      <Row>
        <Col md={3} className="sidebar">
          <div className="admin-profile">
            <div className="admin-avatar">
              <i className="fas fa-user-shield"></i>
            </div>
            <h4>Admin Panel</h4>
          </div>
          <div className="admin-menu">
            <button 
              className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-chart-line"></i> Overview
            </button>
            <button 
              className={`menu-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <i className="fas fa-calendar-check"></i> Bookings
            </button>
            <button 
              className={`menu-item ${activeTab === 'handymen' ? 'active' : ''}`}
              onClick={() => setActiveTab('handymen')}
            >
              <i className="fas fa-tools"></i> Handymen
            </button>
            <button 
              className={`menu-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="fas fa-users"></i> Users
            </button>
          </div>
        </Col>
        <Col md={9} className="main-content">
          <div className="dashboard-header">
            <h2>Dashboard Overview</h2>
            <div className="date-filter">
              <Button variant="outline-primary">Today</Button>
              <Button variant="outline-primary">This Week</Button>
              <Button variant="outline-primary">This Month</Button>
            </div>
          </div>

          <Row className="stats-cards">
            <Col md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <h6>Total Users</h6>
                  <h3>{stats.totalUsers}</h3>
                  <p className="trend positive">+12% from last month</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <h6>Total Handymen</h6>
                  <h3>{stats.totalHandymen}</h3>
                  <p className="trend positive">+5% from last month</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <h6>Active Bookings</h6>
                  <h3>{stats.activeBookings}</h3>
                  <p className="trend neutral">Same as last week</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <h6>Completed Bookings</h6>
                  <h3>{stats.completedBookings}</h3>
                  <p className="trend positive">+8% from last month</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={8}>
              <Card className="recent-bookings">
                <Card.Header>
                  <h5>Recent Bookings</h5>
                </Card.Header>
                <Card.Body>
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Handyman</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map(booking => (
                        <tr key={booking.id}>
                          <td>#{booking.id}</td>
                          <td>{booking.customer}</td>
                          <td>{booking.service}</td>
                          <td>{booking.handyman}</td>
                          <td>
                            <Badge bg={
                              booking.status === 'Completed' ? 'success' :
                              booking.status === 'In Progress' ? 'primary' : 'warning'
                            }>
                              {booking.status}
                            </Badge>
                          </td>
                          <td>{booking.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="handymen-list">
                <Card.Header>
                  <h5>Top Handymen</h5>
                </Card.Header>
                <Card.Body>
                  {handymen.map(handyman => (
                    <div key={handyman.id} className="handyman-item">
                      <div className="handyman-info">
                        <h6>{handyman.name}</h6>
                        <p>{handyman.service}</p>
                      </div>
                      <div className="handyman-status">
                        <Badge bg={handyman.status === 'Available' ? 'success' : 'warning'}>
                          {handyman.status}
                        </Badge>
                        <div className="rating">
                          <i className="fas fa-star"></i> {handyman.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard; 