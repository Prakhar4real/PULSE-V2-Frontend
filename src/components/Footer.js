import React from 'react';
import { FiInstagram, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';
import { FaGooglePlay, FaApple } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    
    const token = localStorage.getItem('access');

    const socialLinks = {
        linkedin: "https://www.linkedin.com/in/workprakhardwivedi/", 
        github: "https://github.com/Prakhar4real",
        twitter: "https://twitter.com",
        instagram: "https://instagram.com"
    };

    return (
        <footer style={styles.footerContainer} className="footer-container-main">
            <style>
                {`
                    /* Text Link Hover */
                    .footer-link {
                        color: #888;
                        text-decoration: none;
                        font-size: 0.95rem;
                        transition: all 0.2s ease;
                        display: block; 
                        width: fit-content; 
                        margin-bottom: 12px;
                        cursor: pointer;
                    }
                    .footer-link:hover {
                        color: #2970ff;
                        text-shadow: 0 0 10px rgba(41, 112, 255, 0.6);
                        transform: translateX(5px); 
                    }

                    /* Icon Hover Effect */
                    .social-btn {
                        color: #888;
                        font-size: 1.5rem;
                        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-decoration: none;
                    }
                    .social-btn:hover {
                        color: white; 
                        transform: translateY(-5px) scale(1.1);
                        filter: drop-shadow(0 0 8px #2970ff);
                    }

                    .store-btn {
                        transition: all 0.3s ease;
                        border: 1px solid #333;
                    }
                    .store-btn:hover {
                        border-color: #2970ff;
                        box-shadow: 0 0 15px rgba(41, 112, 255, 0.2);
                        transform: translateY(-2px);
                    }

                    /* 
                       MOBILE OVERRIDE 
                        */
                    @media (max-width: 768px) {
                        /* 1. Reset Padding */
                        .footer-container-main {
                            padding: 40px 20px !important;
                        }

                        /* 2. Stack Content Vertically */
                        .footer-content-wrapper {
                            flex-direction: column !important;
                            gap: 40px !important;
                        }

                        /* 3. Brand Section Full Width */
                        .footer-brand-section {
                            width: 100% !important;
                            max-width: 100% !important;
                            flex: none !important;
                            text-align: left !important;
                        }
                        
                        /* 4. MAKE LINKS 2-COLUMN GRID */
                        .footer-links-container {
                            width: 100% !important;
                            justify-content: flex-start !important;
                            gap: 30px !important;
                            display: grid !important;
                            grid-template-columns: 1fr 1fr !important; /* The 2-Column Magic */
                        }

                        .footer-link-column {
                            min-width: 0 !important; /* Allow shrinking */
                        }

                        /* 5. Bottom Bar Stack */
                        .footer-bottom-bar {
                            flex-direction: column-reverse !important; /* Copyright at bottom */
                            gap: 20px !important;
                            text-align: center !important;
                            margin-top: 40px !important;
                        }

                        .footer-social-icons {
                            width: 100% !important;
                            justify-content: center !important;
                        }
                    }
                `}
            </style>

            <div style={styles.contentWrapper} className="footer-content-wrapper">
                
                {/* 1. BRAND SECTION */}
                <div style={styles.brandSection} className="footer-brand-section">
                    <h1 style={styles.logo}>PULSE<span style={{color: '#2970ff'}}>.</span></h1>
                    <p style={styles.description}>
                        PULSE isn't just a platform; it's a digital revolution for urban governance. 
                        We bridge the gap between citizens and authorities through real-time data.
                    </p>
                    <div style={styles.downloadButtons}>
                        <button className="store-btn" style={styles.storeBtn}>
                            <FaGooglePlay size={20} />
                            <div style={{textAlign: 'left'}}>
                                <span style={{fontSize: '0.6rem', display: 'block'}}>GET IT ON</span>
                                <span style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Google Play</span>
                            </div>
                        </button>
                        <button className="store-btn" style={styles.storeBtn}>
                            <FaApple size={24} />
                            <div style={{textAlign: 'left'}}>
                                <span style={{fontSize: '0.6rem', display: 'block'}}>Download on the</span>
                                <span style={{fontSize: '0.9rem', fontWeight: 'bold'}}>App Store</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* 2. LINKS SECTION */}
                <div style={styles.linksContainer} className="footer-links-container">
                    <div style={styles.linkColumn} className="footer-link-column">
                        <h4 style={styles.linkHeader}>Product</h4>
                        
                        {token ? (
                            <>
                                <Link to="/dashboard" className="footer-link">Command Center</Link>
                                <Link to="/missions" className="footer-link">Daily Missions</Link>
                                <Link to="/community" className="footer-link">Community Feed</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="footer-link">Create Account</Link>
                                <Link to="/community" className="footer-link">Live City Map</Link>
                                <Link to="/login" className="footer-link">Login</Link>
                            </>
                        )}
                        
                        <Link 
                            to="/report-issue" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="footer-link" 
                            style={{color: '#2970ff', fontWeight: 'bold'}}
                        >
                            Report Issue
                        </Link>
                    </div>

                    <div style={styles.linkColumn} className="footer-link-column">
                        <h4 style={styles.linkHeader}>Resources</h4>
                        <Link to="/docs/safety-guidelines" target="_blank" className="footer-link">Safety Guidelines</Link>
                        <Link to="/docs/api-documentation" target="_blank" className="footer-link">API Documentation</Link>
                        <Link to="/docs/city-partnerships" target="_blank" className="footer-link">City Partnerships</Link>
                        <Link to="/docs/help-center" target="_blank" className="footer-link">Help Center</Link>
                    </div>

                    <div style={styles.linkColumn} className="footer-link-column">
                        <h4 style={styles.linkHeader}>Legal</h4>
                        <Link to="/docs/privacy-policy" target="_blank" className="footer-link">Privacy Policy</Link>
                        <Link to="/docs/terms-of-service" target="_blank" className="footer-link">Terms of Service</Link>
                        <Link to="/docs/cookie-policy" target="_blank" className="footer-link">Cookie Policy</Link>
                        <Link to="/docs/gdpr-compliance" target="_blank" className="footer-link">GDPR Compliance</Link>
                    </div>
                </div>

            </div>

            {/* BOTTOM BAR */}
            <div style={styles.bottomBar} className="footer-bottom-bar">
                <p style={{margin: 0, color: '#666', fontSize: '0.85rem'}}>© 2026 PULSE Smart City Initiative. All rights reserved.</p>
                <div style={styles.socialIcons} className="footer-social-icons">
                    <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="social-btn"><FiTwitter /></a>
                    <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="social-btn"><FiInstagram /></a>
                    <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="social-btn"><FiLinkedin /></a>
                    <a href={socialLinks.github} target="_blank" rel="noreferrer" className="social-btn"><FiGithub /></a>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footerContainer: {
        backgroundColor: '#050509', 
        color: 'white',
        padding: '80px 60px 30px 60px', 
        borderTop: '1px solid #1f2029',
        fontFamily: "'Inter', sans-serif",
    },
    contentWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start', 
        gap: '40px',
        width: '100%', 
    },
    brandSection: {
        flex: '1.5', 
        minWidth: '300px',
        maxWidth: '600px',
    },
    logo: {
        fontSize: '3rem',
        fontWeight: '900',
        margin: '0 0 20px 0',
        letterSpacing: '-1px',
        color: 'white', 
    },
    description: {
        color: '#a1a1aa',
        fontSize: '1.1rem',
        lineHeight: '1.6',
        marginBottom: '35px',
        maxWidth: '90%',
        textAlign: 'left',
    },
    downloadButtons: {
        display: 'flex',
        gap: '15px',
    },
    storeBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#151621',
        borderRadius: '10px',
        padding: '10px 20px',
        color: 'white',
        cursor: 'pointer',
    },
    linksContainer: {
        display: 'flex',
        gap: '80px', 
        flex: '2',
        justifyContent: 'flex-end', 
        flexWrap: 'wrap', 
        alignItems: 'flex-start', 
    },
    linkColumn: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '140px', 
    },
    linkHeader: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: 'white',
        letterSpacing: '0.5px',
    },
    bottomBar: {
        marginTop: '80px',
        paddingTop: '30px',
        borderTop: '1px solid #1f2029',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
    },
    socialIcons: {
        display: 'flex',
        gap: '25px',
    },
};

export default Footer;