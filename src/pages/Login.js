// src/pages/Login.js
import React, { useState } from 'react';
import api from '../services/api'; // Import the helper we just made
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Send the username/password to Django
      const response = await api.post('token/', {
        username: username,
        password: password
      });

      // 2. If it works, Django sends back a "Key" (Token)
      // We save this key in the browser's memory
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      alert("ACCESS GRANTED. Welcome to PULSE.");
      
      // 3. Redirect to the home page
      navigate('/');

    } catch (error) {
      console.error("Login error", error);
      alert("ACCESS DENIED: Wrong username or password.");
    }
  };

  return (
    <div style={{ padding: '50px', backgroundColor: '#1a1a1a', color: '#00ffcc', height: '100vh' }}>
      <h2>>> SYSTEM LOGIN</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label>Password: </label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br />
        <button type="submit">INITIATE SESSION</button>
      </form>
    </div>
  );
};

export default Login;