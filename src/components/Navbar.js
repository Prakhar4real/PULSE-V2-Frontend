import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem('access_token'); 

  useEffect(() => {
    if (token) {
        api.get('user/profile/')
           .then(response => setUserData(response.data))
           .catch(() => setUserData(null));
    } else {
        setUserData(null);
    }
  }, [token, location]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUserData(null);
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 40px',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div 
        onClick={() => navigate('/')} 
        style={{ fontSize: '1.2rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <span style={{ color: 'var(--accent)' }}>●</span> PULSE
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        
        {/* --- IF NOT LOGGED IN: SHOW LOGIN/SIGNUP --- */}
        {!token && (
            <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                    onClick={() => navigate('/login')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '600' }}
                >
                    Log In
                </button>
                <button 
                    onClick={() => navigate('/register')}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                    Sign Up
                </button>
            </div>
        )}

        {/* --- IF LOGGED IN: SHOW BADGE & LOGOUT --- */}
        {token && userData && (
            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: 'var(--bg-secondary)', padding: '6px 12px',
                borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600',
                border: '1px solid var(--border)'
            }}>
                <span role="img" aria-label="trophy">🏆</span> 
                <span>{userData.level}</span>
                <span style={{ color: 'var(--accent)' }}>|</span>
                <span>{userData.points} XP</span>
            </div>
        )}

        <button 
          onClick={toggleTheme}
          style={{ background: 'none', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {token && (
          <button 
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '500' }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;