import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { FiActivity, FiShield, FiAward, FiArrowRight, FiMap } from 'react-icons/fi';

const LandingPage = () => {
    const navigate = useNavigate();

    // HIGH-PERFORMANCE ANIMATION ENGINE
    useEffect(() => {
        let time = 0;
        let lastScrollY = window.scrollY;
        let scrollTimeout;
        const edgeElement = document.getElementById('dynamic-pulse');

        if (!edgeElement) return;

        const animationLoop = () => {
            // 1. Idle auto-color shifting (changes permanently even when not scrolling)
            time += 0.01;

            // 2. Scroll Velocity tracking
            const currentScrollY = window.scrollY;
            const scrollDelta = Math.abs(currentScrollY - lastScrollY);

            if (scrollDelta > 0) {
                // User is scrolling --> instantly accelerate color shifting based on speed
                time += scrollDelta * 0.03;

                // Change pulse animation speed to be hyper-fast
                edgeElement.style.animationDuration = '0.4s';

                // Reset back to idle breathing speed 150ms after scrolling stops
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    edgeElement.style.animationDuration = '3s';
                }, 150);
            }
            lastScrollY = currentScrollY;

            // 3. Sine wave interpolation (goes smoothly from 0 to 1 to 0)
            const factor = (Math.sin(time) + 1) / 2;

            // Interpolate from Blue (41, 112, 255) to Green (0, 214, 143)
            const r = Math.round(41 + (0 - 41) * factor);
            const g = Math.round(112 + (214 - 112) * factor);
            const b = Math.round(255 + (143 - 255) * factor);

            // Inject color directly into CSS for 60FPS mobile-optimized performance
            edgeElement.style.setProperty('--dynamic-color', `${r}, ${g}, ${b}`);

            requestAnimationFrame(animationLoop);
        };

        const animId = requestAnimationFrame(animationLoop);

        return () => {
            cancelAnimationFrame(animId);
            clearTimeout(scrollTimeout);
        };
    }, []);

    const galleryImages = [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=800&q=80"
    ];

    return (
        <div style={styles.container} className="landing-container">



            {/* PULSATING EDGES */}
            <div
                id="dynamic-pulse"
                className="pulsating-edges"
                style={{
                    boxShadow: `inset 44px 0px 110px -33px rgba(var(--dynamic-color, 41, 112, 255), 0.55), inset -44px 0px 110px -33px rgba(var(--dynamic-color, 41, 112, 255), 0.55)`
                }}
            />

            {/* HERO SECTION */}
            <header style={styles.hero} className="hero-section">

                {/* AMBIENT BACKGROUND GALLERY */}
                <div className="bg-gallery">
                    <div className="bg-gallery-track">
                        {[...galleryImages, ...galleryImages].map((img, index) => (
                            <img key={index} src={img} alt="civic background" className="gallery-img" />
                        ))}
                    </div>
                </div>

                {/* HERO CONTENT */}
                <div style={styles.heroContent} className="hero-content">
                    <h1 style={styles.heroTitle} className="hero-title animate-fade-in">
                        Cities Work Better<br />
                        <span style={styles.gradientText}>When Citizens Are Heard.</span>
                    </h1>
                    <p style={styles.heroSubtitle} className="hero-subtitle animate-fade-in-delayed">
                        PULSE enables transparent, real-time collaboration between citizens and authorities.
                    </p>

                    {/* BUTTONS */}
                    <div style={styles.heroButtons} className="hero-buttons animate-fade-in-delayed-more">
                        <button onClick={() => navigate('/register')} style={styles.mainCta} className="cta-btn primary-cta">
                            Get Started <FiArrowRight />
                        </button>

                        <button onClick={() => navigate('/community')} style={styles.secondaryCta} className="cta-btn secondary">
                            <FiMap style={{ marginRight: '8px' }} /> View Live Map
                        </button>
                    </div>
                </div>
            </header>

            {/* FEATURES SECTION */}
            <section style={styles.featuresSection} className="features-section">
                <div style={styles.featureCard} className="feature-card interactive-card">
                    <div style={styles.iconBox} className="icon-box"><FiActivity size={30} color="#2970ff" /></div>
                    <h3>Real-Time Data</h3>
                    <p>Live incident reporting and geospatial visualization powered by community input.</p>
                </div>
                <div style={styles.featureCard} className="feature-card interactive-card">
                    <div style={styles.iconBox} className="icon-box"><FiShield size={30} color="#00d68f" /></div>
                    <h3>AI Verification</h3>
                    <p> AI ensure accuracy, reduce misuse, and build trust in public reporting.</p>
                </div>
                <div style={styles.featureCard} className="feature-card interactive-card">
                    <div style={styles.iconBox} className="icon-box"><FiAward size={30} color="#ffb547" /></div>
                    <h3>Community Contribution</h3>
                    <p>Designed to promote meaningful civic involvement through measurable participation.</p>
                </div>
            </section>

            <Footer />

            {/* EMBEDDED STYLES & ANIMATIONS */}
            <style>{`
                html, body {
                    overflow-x: hidden;
                    width: 100%;
                    margin: 0; padding: 0;
                    box-sizing: border-box;
                    background-color: #050509; 
                }
                *, *:before, *:after { box-sizing: inherit; }

                /* --- DYNAMIC PULSATING EDGES --- */
                .pulsating-edges {
                    position: absolute;
                    top: 0; bottom: 0; left: 0; right: 0;
                    pointer-events: none; 
                    z-index: 10;
                    /* Base idle breathing speed. JavaScript modifies this dynamically */
                    animation: pulse-breathe 3s infinite alternate ease-in-out;
                }
                @keyframes pulse-breathe {
                    0% { opacity: 0.3; }
                    100% { opacity: 0.8; }
                }

                .bg-gallery {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    overflow: hidden;
                    z-index: 0;
                    opacity: 0.08; 
                    mix-blend-mode: luminosity; 
                    pointer-events: none;
                }
                .bg-gallery::after {
                    content: ''; position: absolute; top:0; left:0; right:0; bottom:0;
                    background: radial-gradient(circle, transparent 20%, #050509 90%);
                }
                .bg-gallery-track {
                    display: flex;
                    width: max-content;
                    height: 100%;
                    animation: slide-gallery 90s linear infinite;
                }
                .gallery-img { height: 100%; width: 50vw; object-fit: cover; }
                @keyframes slide-gallery {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); } 
                }

                .interactive-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
                .interactive-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 30px rgba(41, 112, 255, 0.15);
                    border-color: #2970ff;
                }
                .primary-cta:hover {
                    box-shadow: 0 0 25px rgba(41, 112, 255, 0.5);
                    transform: scale(1.02);
                }
                .secondary:hover { background-color: rgba(255,255,255,0.1) !important; }

                .animate-fade-in { animation: fadeInUp 0.8s ease forwards; }
                .animate-fade-in-delayed { opacity: 0; animation: fadeInUp 0.8s ease 0.2s forwards; }
                .animate-fade-in-delayed-more { opacity: 0; animation: fadeInUp 0.8s ease 0.4s forwards; }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* --- MOBILE RESPONSIVENESS FIXES --- */
                @media (max-width: 768px) {
                    .landing-container { width: 100vw !important; overflow-x: hidden !important; }
                    
                    /* Adjusted navbar for mobile - keeps it top right! */
                    .navbar { padding: 20px 24px !important; }

                    .hero-section {
                        padding: 80px 24px 60px 24px !important; 
                        min-height: auto !important;
                        align-items: center !important;
                        text-align: center !important;
                    }
                    .hero-content { margin-top: 0 !important; width: 100% !important; z-index: 5; }
                    .hero-title { font-size: 2.4rem !important; line-height: 1.2 !important; margin-bottom: 16px !important; }
                    .hero-subtitle { font-size: 1rem !important; margin-bottom: 32px !important; padding: 0 10px !important; }
                    .hero-buttons { flex-direction: column !important; width: 100% !important; gap: 12px !important; }
                    .cta-btn { width: 100% !important; justify-content: center !important; padding: 18px !important; }
                    
                    .bg-gallery { opacity: 0.04; }
                    
                    .features-section {
                        display: flex !important;
                        flex-direction: column;
                        padding: 40px 24px !important; 
                        gap: 16px;
                    }
                    .feature-card {
                        width: 100% !important; min-width: 0 !important; margin: 0 !important;
                        text-align: left !important; align-items: flex-start !important;
                        padding: 24px; height: auto;
                    }
                }
            `}</style>
        </div>
    );
};

// DESKTOP STYLES
const styles = {
    container: {
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#050509',
        color: 'white',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
    },

    hero: {
        position: 'relative',
        padding: '40px 80px',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'transparent',
    },
    heroContent: {
        maxWidth: '800px',
        marginTop: '60px',
        position: 'relative',
        zIndex: 5,
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
        transition: 'all 0.3s ease',
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
        transition: 'all 0.3s ease',
    },
    featuresSection: {
        position: 'relative',
        zIndex: 5,
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