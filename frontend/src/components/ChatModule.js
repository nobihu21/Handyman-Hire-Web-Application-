import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import './ChatModule.css';

function ChatModule({ bookingId, userId, handymanId, userName, handymanName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(`ws://localhost:5000/chat/${bookingId}`);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    };

    return () => {
      ws.close();
    };
  }, [bookingId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      bookingId,
      senderId: userId,
      receiverId: handymanId,
      content: newMessage,
      timestamp: new Date().toISOString(),
      senderName: userName
    };

    // Send message through WebSocket
    const ws = new WebSocket(`ws://localhost:5000/chat/${bookingId}`);
    ws.onopen = () => {
      ws.send(JSON.stringify(message));
      setNewMessage('');
    };
  };

  return (
    <Card className="chat-module">
      <Card.Header className="chat-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Chat with {handymanName}</h5>
          <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </Card.Header>
      <Card.Body className="chat-body">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.senderId === userId ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <div className="message-sender">{message.senderName}</div>
                <div className="message-text">{message.content}</div>
                <div className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Card.Body>
      <Card.Footer className="chat-footer">
        <Form onSubmit={handleSendMessage}>
          <Row>
            <Col>
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!isConnected}
              />
            </Col>
            <Col xs="auto">
              <Button 
                type="submit" 
                variant="primary"
                disabled={!isConnected || !newMessage.trim()}
              >
                Send
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Footer>
    </Card>
  );
}

export default ChatModule; 