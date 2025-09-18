import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './App.css';
import ChatBox from './components/ChatBox';

const App: React.FC = () => {
  return (
    <div className="App d-flex flex-column">
      <Navbar bg="primary" variant="dark" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand className="fw-bold">
            🤖 Google ADK Chat Demo
          </Navbar.Brand>
          <span className="text-white-50 small">
            Custom frontend for Google ADK • Safe for demos
          </span>
        </Container>
      </Navbar>

      <main className="flex-grow-1 d-flex">
        <ChatBox
          initialConfig={{
            appName: 'adk-chat-demo',
            userId: 'demo-user-' + Math.random().toString(36).substr(2, 9),
            model: 'gemini-1.5-flash',
            temperature: 0.7,
            maxTokens: 800,
          }}
        />
      </main>

      <footer className="py-2 text-center text-muted small border-top">
        <Container>
          Built for MAS curriculum • Replace simulator with secured ADK backend when ready
        </Container>
      </footer>
    </div>
  );
};

export default App;