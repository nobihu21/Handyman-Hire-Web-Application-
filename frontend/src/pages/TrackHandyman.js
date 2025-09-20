import React from 'react';
import { Container, Card } from 'react-bootstrap';

function TrackHandyman() {
  return (
    <Container className="tracking-container my-5">
      <h2 className="tracking-title mb-4">Track Your Handyman</h2>
      <Card className="map-card">
        <Card.Body>
          <div className="text-center p-5">
            <h4>Handyman Tracking Feature</h4>
            <p className="text-muted">This feature is currently under development and will be available soon.</p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TrackHandyman; 