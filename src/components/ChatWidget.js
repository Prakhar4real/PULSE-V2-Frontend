import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am PULSE AI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Auto-scroll to bottom of chat
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // 2. Send to Django Backend (Gemini AI)
      const response = await api.post('ai/chat/', { message: input });
      
      // 3. Add Bot Response
      const botMsg = { sender: 'bot', text: response.data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { sender: 'bot', text: "Error: Neural link offline. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
      
      {/* --- CHAT WINDOW (Only visible if isOpen is true) --- */}
      {isOpen && (
        <div className="card" style={{ 
            width: '320px', 
            height: '450px', 
            marginBottom: '20px', 
            display: 'flex', 
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            animation: 'fadeIn 0.2s ease-out'
        }}>
          
          {/* Header */}
          <div style={{ padding: '15px', backgroundColor: 'var(--accent)', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <span></span> PULSE AI 
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: 'var(--bg-secondary)' }}>
            {messages.map((msg, index) => (
                <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '10px'
                }}>
                    <div style={{
                        maxWidth: '80%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        backgroundColor: msg.sender === 'user' ? 'var(--accent)' : 'var(--bg-card)',
                        color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                        border: msg.sender === 'bot' ? '1px solid var(--border)' : 'none',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isTyping && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '10px', fontStyle: 'italic' }}>AI is thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: '10px', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', display: 'flex' }}>
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            />
            <button type="submit" style={{ marginLeft: '10px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                ➤
            </button>
          </form>
        </div>
      )}

      {/* --- TOGGLE BUTTON (Robot Icon with Pulse) --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
            width: '60px', height: '60px', borderRadius: '50%', 
            backgroundColor: 'var(--bg-card)', 
            color: 'var(--accent)', 
            border: '2px solid var(--accent)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            // The Pulsing Animation:
            animation: isOpen ? 'none' : 'pulse-glow 2s infinite'
        }}
      >
        {isOpen ? (
            // Close Icon (X)
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>✕</span>
        ) : (
            // ROBOT SVG ICON
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <circle cx="12" cy="16" r="2"></circle>
                <path d="M12 11V7"></path>
                <path d="M7 7h10"></path>
                <path d="M12 7V3"></path>
            </svg>
        )}
      </button>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
            0% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(0, 122, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0); }
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;