import React from 'react';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin, FiBox, FiSmartphone } from 'react-icons/fi';
import '../styles/Footer.css'; 

const Footer = () => {
    return (
        <footer className="footer-container">
            {/* TOP SECTION */}
            <div className="footer-content">
                
                {/* COLUMN 1: BRANDING */}
                <div className="footer-brand">
                    <h2 className="footer-logo">PULSE<span style={{color: '#2970ff'}}>.</span></h2>
                    <p className="footer-desc">
                        Empowering citizens to build smarter, safer cities. 
                        Report incidents, earn XP, and make a difference today.
                    </p>
                    <div className="app-badges">
                        <button className="store-btn">
                            <FiSmartphone size={20}/>
                            <div className="store-text">
                                <span>Get it on</span>
                                <strong>Google Play</strong>
                            </div>
                        </button>
                        <button className="store-btn">
                            <FiBox size={20}/>
                            <div className="store-text">
                                <span>Download on the</span>
                                <strong>App Store</strong>
                            </div>
                        </button>
                    </div>
                </div>

                {/* COLUMN 2: PRODUCT */}
                <div className="footer-links">
                    <h4>Product</h4>
                    <a href="/dashboard">Command Center</a>
                    <a href="/missions">Daily Missions</a>
                    <a href="/leaderboard">Leaderboard</a>
                    <a href="/new-report">Report Issue</a>
                </div>

                {/* COLUMN 3: RESOURCES */}
                <div className="footer-links">
                    <h4>Resources</h4>
                    <a href="#">Safety Guidelines</a>
                    <a href="#">API Documentation</a>
                    <a href="#">City Partnerships</a>
                    <a href="#">Help Center</a>
                </div>

                {/* COLUMN 4: LEGAL */}
                <div className="footer-links">
                    <h4>Legal</h4>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Cookie Policy</a>
                    <a href="#">GDPR Compliance</a>
                </div>
            </div>

            {/* DIVIDER LINE */}
            <div className="footer-divider"></div>

            {/* BOTTOM SECTION */}
            <div className="footer-bottom">
                <p>&copy; 2026 PULSE Smart City Initiative. All rights reserved.</p>
                
                <div className="social-icons">
                    <a href="#" className="social-link"><FiGithub /></a>
                    <a href="#" className="social-link"><FiTwitter /></a>
                    <a href="#" className="social-link"><FiLinkedin /></a>
                    <a href="#" className="social-link"><FiInstagram /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;