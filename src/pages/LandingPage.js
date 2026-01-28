import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'; 
import { FiActivity, FiShield, FiAward, FiArrowRight, FiMap } from 'react-icons/fi';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            {/* --- HERO SECTION --- */}
            <header style={styles.hero}>
                
                

                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>
                        The Future of <br />
                        <span style={styles.gradientText}>Urban Governance</span>
                    </h1>
                    <p style={styles.heroSubtitle}>
                        PULSE bridges the gap between citizens and authorities. 
                        Report incidents, earn XP, and watch your city transform in real-time.
                    </p>
                    
                    {/* UPDATED BUTTONS */}
                    <div style={styles.heroButtons}>
                        {/* 1. Primary Action: Register */}
                        <button onClick={() => navigate('/register')} style={styles.mainCta}>
                            Get Started <FiArrowRight />
                        </button>
                        
                        {/* 2. Secondary Action: Public Map */}
                        <button onClick={() => navigate('/community')} style={styles.secondaryCta}>
                            <FiMap style={{marginRight:'8px'}}/> View Live Map
                        </button>
                    </div>
                </div>

            </header>

            {/* --- FEATURES SECTION --- */}
            <section style={styles.featuresSection}>
                <div style={styles.featureCard}>
                    <div style={styles.iconBox}><FiActivity size={30} color="#2970ff"/></div>
                    <h3>Real-Time Data</h3>
                    <p>Live incident tracking and heatmaps powered by community reports.</p>
                </div>
                <div style={styles.featureCard}>
                    <div style={styles.iconBox}><FiShield size={30} color="#00d68f"/></div>
                    <h3>AI Verification</h3>
                    <p> AI verifies every report to ensure accuracy and trust.</p>
                </div>
                <div style={styles.featureCard}>
                    <div style={styles.iconBox}><FiAward size={30} color="#ffb547"/></div>
                    <h3>Gamified Impact</h3>
                    <p>Earn XP, climb the leaderboard, and get rewarded for being a good citizen.</p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#050509',
        color: 'white',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
    },
    hero: {
        padding: '40px 80px',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, #151621 0%, #050509 100%)',
    },
    
    heroContent: {
        maxWidth: '800px',
        marginTop: '60px',
    },
    heroTitle: {
        fontSize: '4.5rem',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '20px',
    },
    gradientText: {
        background: 'linear-gradient(90deg, #2970ff, #00d68f)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    heroSubtitle: {
        fontSize: '1.2rem',
        color: '#a1a1aa',
        marginBottom: '40px',
        lineHeight: '1.6',
        maxWidth: '600px',
    },
    heroButtons: {
        display: 'flex',
        gap: '20px',
    },
    mainCta: {
        padding: '16px 32px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: '#2970ff',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'transform 0.2s',
    },
    secondaryCta: {
        padding: '16px 32px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        borderRadius: '12px',
        border: '1px solid #333',
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    },
    featuresSection: {
        padding: '80px',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '40px',
        backgroundColor: '#0b0c15',
        flexWrap: 'wrap', 
    },
    featureCard: {
        flex: 1,
        minWidth: '250px',
        padding: '30px',
        backgroundColor: '#151621',
        borderRadius: '20px',
        border: '1px solid #1f2029',
    },
    iconBox: {
        width: '60px',
        height: '60px',
        borderRadius: '15px',
        backgroundColor: '#1f2029',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
    }
};

export default LandingPage;