const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store active connections
const connections = new Map();

wss.on('connection', (ws, req) => {
  const bookingId = req.url.split('/').pop();
  
  // Store the connection
  if (!connections.has(bookingId)) {
    connections.set(bookingId, new Set());
  }
  connections.get(bookingId).add(ws);

  console.log(`New connection established for booking ${bookingId}`);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Broadcast message to all connections in the same booking
      connections.get(bookingId).forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    // Remove the connection
    connections.get(bookingId).delete(ws);
    
    // Clean up empty sets
    if (connections.get(bookingId).size === 0) {
      connections.delete(bookingId);
    }
    
    console.log(`Connection closed for booking ${bookingId}`);
  });
});

// Error handling
wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

const PORT = process.env.WS_PORT || 5000;

server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});

module.exports = { wss, server }; 