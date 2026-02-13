import React, { useState, useEffect } from 'react';
import { FiMonitor, FiSmartphone, FiX } from 'react-icons/fi';

const MobileWarning = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if screen is mobile width (< 900px)
        const checkMobile = () => {
            if (window.innerWidth < 900) {
                // Check if user has already dismissed it this session
                const hasDismissed = sessionStorage.getItem('mobileWarningDismissed');
                if (!hasDismissed) {
                    setIsVisible(true);
                }
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('mobileWarningDismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.card}>
                <div style={styles.iconWrapper}>
                    <FiMonitor size={40} color="#2970ff" />
                </div>
                
                <h2 style={styles.title}>Desktop Experience Recommended</h2>
                
                <p style={styles.text}>
                    PULSE is a complex "Command Center" dashboard designed for large screens (atleast for now).
                </p>
                <p style={styles.subText}>
                    For the best experience, please open this on your <strong>Laptop or PC</strong>.
                </p>

                <button onClick={handleDismiss} style={styles.button}>
                    <span style={{marginRight: '8px'}}>I understand, continue anyway</span>
                    <FiSmartphone />
                </button>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(5, 5, 9, 0.95)', 
        backdropFilter: 'blur(8px)',
        zIndex: 9999, 
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: '20px'
    },
    card: {
        backgroundColor: '#151621',
        border: '1px solid #2970ff',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 0 40px rgba(41, 112, 255, 0.2)'
    },
    iconWrapper: {
        backgroundColor: 'rgba(41, 112, 255, 0.1)',
        width: '80px', height: '80px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px auto'
    },
    title: { margin: '0 0 15px 0', fontSize: '1.5rem', color: 'white' },
    text: { color: '#e0e0e0', fontSize: '1rem', lineHeight: '1.5', marginBottom: '10px' },
    subText: { color: '#8b8d9d', fontSize: '0.9rem', marginBottom: '30px' },
    button: {
        background: 'transparent',
        border: '1px solid #333',
        color: '#888',
        padding: '12px 20px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%',
        transition: 'all 0.2s'
    }
};

export default MobileWarning;