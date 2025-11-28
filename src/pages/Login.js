import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('token/', {
        username: username,
        password: password
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      navigate('/');
    } catch (error) {
      console.error("Login error", error);
      alert("Invalid Credentials");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="card" style={{ width: '350px' }}>
        
        {/* Title */}
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-primary)' }}>Welcome Back</h2>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
            Log In
          </button>
        </form>

        {/* --- THE LINK IS HERE --- */}
        <div style={{ marginTop: '25px', textAlign: 'center', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>New to PULSE?</p>
          <button 
            onClick={() => navigate('/register')} 
            style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--accent)', 
                cursor: 'pointer', 
                fontWeight: '600', 
                fontSize: '1rem' 
            }}
          >
            Create an Account &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;