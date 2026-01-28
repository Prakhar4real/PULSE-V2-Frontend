import React from 'react';
import { FiHeart, FiMail } from 'react-icons/fi';

const ReportIssue = () => {
    return (
        <div style={{minHeight: '100vh', backgroundColor: '#0b0c15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif"}}>
            <div style={{textAlign: 'center', maxWidth: '600px', padding: '40px'}}>
                <FiHeart size={60} color="#ff4d4d" style={{marginBottom: '20px'}} />
                
                <h1 style={{fontSize: '2.5rem', margin: '0 0 20px 0', color: 'white'}}>Thank You, Hunter!</h1>
                
                <p style={{color: '#a1a1aa', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '40px'}}>
                    Finding a bug means you care enough to look closely. We genuinely appreciate your sharp eyes. 
                    Building a smart city is hard, and we can't do it without testers like you.
                </p>
                
                <div style={{backgroundColor: '#151621', padding: '30px', borderRadius: '15px', border: '1px solid #2970ff'}}>
                    <p style={{color: 'white', margin: '0 0 10px 0', fontWeight: 'bold'}}>Send your bug report directly to:</p>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.5rem', color: '#2970ff', fontWeight: 'bold'}}>
                        <FiMail />
                        <a href="mailto:prakhar@pulse.city" style={{color: '#2970ff', textDecoration: 'none'}}>prakhar.dwivedi.7707@gmail.com</a>
                    </div>
                </div>

                <p style={{color: '#666', marginTop: '30px', fontSize: '0.9rem'}}>
                    Please include screenshots and steps to reproduce. We read every email.
                </p>
            </div>
        </div>
    );
};

export default ReportIssue;