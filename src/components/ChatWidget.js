import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am PULSE AI. How can I assist you?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // 1. Hide Widget on Login/Register Pages (Optional polish)
  const location = useLocation();
  const hideOnRoutes = ['/login', '/register', '/'];
  if (hideOnRoutes.includes(location.pathname)) return null;

  // 2. Safe Auto-Scroll (Inside Box Only)
  const chatContainerRef = useRef(null);
  
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom(); // Scroll when opened
    }
  }, [isOpen, messages]); // Scroll on new message

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('ai/chat/', { message: userMsg.text });
      const botMsg = { sender: 'bot', text: response.data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { sender: 'bot', text: "⚠️ Error: AI Service Unavailable." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', left: '30px', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      
      {/* --- CHAT WINDOW --- */}
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
             <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <FaRobot color="#2970ff" /> PULSE AI 
             </div>
             <button onClick={() => setIsOpen(false)} style={styles.closeBtn}><FaTimes /></button>
          </div>

          <div style={styles.messagesContainer} ref={chatContainerRef}>
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
                        backgroundColor: msg.sender === 'user' ? '#2970ff' : '#1f2029',
                        color: msg.sender === 'user' ? 'white' : '#a1a1aa',
                        border: msg.sender === 'bot' ? '1px solid #333' : 'none',
                    }}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isTyping && <div style={{ fontSize: '0.8rem', color: '#666', marginLeft: '10px' }}>AI is thinking...</div>}
          </div>

          <form onSubmit={handleSend} style={styles.inputArea}>
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask PULSE..."
                style={styles.input}
            />
            <button type="submit" style={styles.sendBtn} disabled={isTyping}>
                <FaPaperPlane />
            </button>
          </form>
        </div>
      )}

      {/* --- TOGGLE BUTTON --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
            width: '60px', height: '60px', borderRadius: '50%', 
            backgroundColor: '#151621', 
            color: '#2970ff', 
            border: '2px solid #2970ff',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(41, 112, 255, 0.4)',
            transition: 'all 0.3s ease',
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)'
        }}
      >
        {isOpen ? <FaTimes size={24} /> : <FaRobot size={28} />}
      </button>
    </div>
  );
};

const styles = {
    chatWindow: {
        width: '320px', height: '450px', marginBottom: '20px', 
        display: 'flex', flexDirection: 'column',
        backgroundColor: '#0b0c15', borderRadius: '15px',
        border: '1px solid #1f2029', boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
    },
    header: {
        padding: '15px', backgroundColor: '#151621', color: 'white', fontWeight: 'bold', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2970ff'
    },
    closeBtn: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' },
    messagesContainer: {
        flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#0b0c15'
    },
    inputArea: {
        padding: '10px', borderTop: '1px solid #1f2029', backgroundColor: '#151621', display: 'flex', gap: '10px'
    },
    input: {
        flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #333', outline: 'none', backgroundColor: '#0b0c15', color: 'white'
    },
    sendBtn: {
        background: 'none', border: 'none', cursor: 'pointer', color: '#2970ff', fontSize: '1.2rem'
    }
};

export default ChatWidget;