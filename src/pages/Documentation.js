import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const docContent = {
    // RESOURCES
    "safety-guidelines": {
        title: "Safety Guidelines",
        content: "At PULSE, citizen safety is paramount. When reporting incidents, never put yourself in harm's way. Do not attempt to intervene in criminal activities or dangerous traffic situations. Use the app discreetly and from a safe distance. Your role is to observe and report, not to enforce."
    },
    "api-documentation": {
        title: "API Documentation",
        content: "The PULSE Public API allows developers to access anonymized city data for research and app development. Endpoints include /v1/reports (GET) and /v1/stats (GET). Authentication is required via OAuth2. Contact developer-support@pulse.city for API keys and rate limit details."
    },
    "city-partnerships": {
        title: "City Partnerships",
        content: "PULSE partners with municipal corporations to streamline urban governance. Our partners gain access to the 'Command Center' dashboard, high-priority alerts, and heatmaps. If you represent a city council or municipal body, please reach out to partnerships@pulse.city to schedule a demo."
    },
    "help-center": {
        title: "Help Center",
        content: "Need help? 1. To report an issue, use the '+' button on the dashboard. 2. To edit your profile, go to Settings. 3. XP points are awarded within 24 hours of report verification. For account deletion requests or bug reports, please visit the 'Report Issue' page."
    },

    // LEGAL
    "privacy-policy": {
        title: "Privacy Policy",
        content: "Your privacy is our core value. PULSE collects location data only when you actively submit a report. We do not track background location. All personal data (Name, Phone) is encrypted using AES-256 standards. We never sell your data to third-party advertisers."
    },
    "terms-of-service": {
        title: "Terms of Service",
        content: "By using PULSE, you agree to submit truthful and accurate information. Misuse of the platform, including spamming fake reports or harassment, will result in an immediate permanent ban. PULSE is a facilitation tool and is not legally liable for the resolution of reported incidents."
    },
    "cookie-policy": {
        title: "Cookie Policy",
        content: "We use essential cookies to keep you logged in and functional cookies to remember your map preferences. We do not use tracking pixels or third-party advertising cookies. You can manage your cookie preferences in your browser settings."
    },
    "gdpr-compliance": {
        title: "GDPR Compliance",
        content: "PULSE adheres to GDPR standards. You have the 'Right to be Forgotten'. If you wish to download a copy of all data we hold about you, or request total deletion, please contact our Data Protection Officer at privacy@pulse.city."
    }
};

const Documentation = () => {
    const { type } = useParams(); // Grabs the URL parameter
    const data = docContent[type] || { title: "Not Found", content: "Document not found." };
    const navigate = useNavigate();

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#0b0c15', color: 'white', padding: '40px', fontFamily: "'Inter', sans-serif"}}>
            <div style={{maxWidth: '800px', margin: '0 auto'}}>
                <button onClick={() => window.close()} style={{background: 'none', border: 'none', color: '#2970ff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 30, fontSize: '1rem'}}>
                    <FiArrowLeft /> Close Tab
                </button>
                
                <h1 style={{fontSize: '3rem', marginBottom: '20px', color: 'white'}}>{data.title}</h1>
                <div style={{height: '2px', width: '60px', backgroundColor: '#2970ff', marginBottom: '40px'}}></div>
                
                <p style={{fontSize: '1.2rem', lineHeight: '1.8', color: '#ccc'}}>
                    {data.content}
                </p>

                <div style={{marginTop: '60px', padding: '20px', backgroundColor: '#151621', borderRadius: '10px', border: '1px solid #333'}}>
                    <p style={{margin: 0, color: '#888', fontSize: '0.9rem'}}>Last updated: January 26, 2026</p>
                </div>
            </div>
        </div>
    );
};

export default Documentation;