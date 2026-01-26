import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiAward } from 'react-icons/fi';
import api from '../services/api';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('access');
                if (token) {
                    const res = await api.get('user/profile/', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);
                }
            } catch (e) {
                console.error("Nav Load Error", e);
            }
        };
        fetchUser();
    }, [location]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.brand} onClick={() => navigate('/dashboard')}>
                <span style={{color: '#2970ff'}}>●</span> PULSE
            </div>

            <div style={styles.menu}>
                
                <span style={styles.link} onClick={() => navigate('/community')}>Community</span>
                <span style={styles.link} onClick={() => navigate('/missions')}>Missions</span>
                
                {user && (
                    <div style={styles.xpBadge}>
                        <FiAward color="#ffb547" />
                        <span style={{fontWeight: 'bold', color: '#ffb547'}}>
                            {user.username} | {user.points} XP
                        </span>
                    </div>
                )}

                <button onClick={handleLogout} style={styles.logoutBtn}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#0b0c15', borderBottom: '1px solid #1f2029', color: 'white' },
    brand: { fontSize: '1.5rem', fontWeight: '800', cursor: 'pointer', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '10px' },
    menu: { display: 'flex', alignItems: 'center', gap: '25px' },
    link: { cursor: 'pointer', color: '#8b8d9d', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.3s' },
    xpBadge: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#151621', padding: '8px 16px', borderRadius: '20px', border: '1px solid #2a2b3d' },
    logoutBtn: { backgroundColor: '#1f2029', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }
};

export default Navbar;