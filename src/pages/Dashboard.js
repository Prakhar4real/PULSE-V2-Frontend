import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Destroy the "Key" (Delete from storage)
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // 2. Redirect back to Login
    navigate('/login');
  };

  return (
    <div style={{ padding: '50px', backgroundColor: '#0a0a0a', color: '#00ffcc', height: '100vh' }}>
      <h1>>> COMMAND CENTER</h1>
      <p>STATUS: ONLINE</p>
      <p>USER: ADMINISTRATOR</p>
      
      <div style={{ marginTop: '50px', border: '1px solid #333', padding: '20px' }}>
        <h3>CITY METRICS</h3>
        <p>No reports loaded yet...</p>
      </div>

      <button 
        onClick={handleLogout}
        style={{ marginTop: '30px', padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        TERMINATE SESSION (LOGOUT)
      </button>
    </div>
  );
};

export default Dashboard;