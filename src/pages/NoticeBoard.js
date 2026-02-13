import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiBell, FiCalendar, FiAlertCircle } from 'react-icons/fi';

const NoticeBoard = () => { 
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const token = localStorage.getItem('access');
            const res = await api.get('notices/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotices(res.data);
        } catch (error) {
            console.error("Failed to fetch notices", error);
            setNotices([
                { id: 1, title: "Severe Weather Warning", content: "Heavy rainfall expected in Gomti Nagar area. Please avoid underpasses.", is_pinned: true, created_at: "2026-01-26T10:00:00", author_name: "City Admin" },
                { id: 2, title: "Metro Line Maintenance", content: "The Red Line will be closed this Sunday for scheduled repairs.", is_pinned: false, created_at: "2026-01-25T09:30:00", author_name: "Transport Dept" },
                { id: 3, title: "New Recycling Guidelines", content: "Separate wet and dry waste starting next month to earn extra XP.", is_pinned: false, created_at: "2026-01-24T14:15:00", author_name: "Sanitation Dept" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const pinnedNotices = notices.filter(n => n.is_pinned);
    const regularNotices = notices.filter(n => !n.is_pinned);

    return (
        <div style={styles.container} className="notice-container">
            <div style={styles.header}>
                <h1 style={{margin: 0}} className="notice-title">Official <span style={{color: '#2970ff'}}>Notice Board</span></h1>
                <p style={{color: '#8b8d9d', marginTop: '5px'}}>Updates, Alerts & News from City Administration</p>
            </div>

            <div style={styles.content}>
                {loading ? <p style={{textAlign:'center', color:'#666'}}>Loading updates...</p> : (
                    <>
                        {/*PINNED / URGENT SECTION*/}
                        {pinnedNotices.length > 0 && (
                            <div style={{marginBottom: '40px'}}>
                                <h3 style={styles.sectionTitle}><FiAlertCircle color="#ffb547"/> Important Alerts</h3>
                                <div style={styles.grid} className="pinned-grid">
                                    {pinnedNotices.map(notice => (
                                        <div key={notice.id} style={styles.pinnedCard}>
                                            <div style={styles.pinnedBadge}>PINNED</div>
                                            <h2 style={styles.cardTitle}>{notice.title}</h2>
                                            <p style={styles.cardBody}>{notice.content}</p>
                                            <div style={styles.cardFooter}>
                                                <span style={styles.author}> {notice.author_name || "Admin"}</span>
                                                <span style={styles.date}><FiCalendar /> {formatDate(notice.created_at)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/*REGULAR NOTICES */}
                        <div>
                            <h3 style={styles.sectionTitle}><FiBell color="#2970ff"/> Recent Updates</h3>
                            <div style={styles.listContainer}>
                                {regularNotices.map(notice => (
                                    <div key={notice.id} style={styles.regularCard} className="regular-card">
                                        <div style={{flex: 1}}>
                                            <h3 style={styles.regularTitle}>{notice.title}</h3>
                                            <p style={styles.regularBody}>{notice.content}</p>
                                        </div>
                                        <div style={styles.regularMeta} className="regular-meta">
                                            <span style={styles.date}>{formatDate(notice.created_at)}</span>
                                            <span style={styles.tag}>Official</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/*MOBILE RESPONSIVENESS INJECTED HERE */}
            <style>{`
                @media (max-width: 768px) {
                    .notice-container { padding: 20px 15px !important; }
                    .notice-title { fontSize: 2rem !important; }
                    .pinned-grid { grid-template-columns: 1fr !important; }
                    
                    .regular-card { 
                        flex-direction: column !important; 
                        align-items: flex-start !important; 
                        gap: 15px; 
                    }
                    .regular-meta { 
                        width: 100%; 
                        flex-direction: row !important; 
                        justify-content: space-between; 
                        align-items: center !important; 
                    }
                }
            `}</style>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#050509', color: 'white', padding: '40px 20px' },
    header: { textAlign: 'center', marginBottom: '50px' },
    content: { maxWidth: '900px', margin: '0 auto' },
    
    sectionTitle: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', color: '#8b8d9d', marginBottom: '20px', borderBottom: '1px solid #1f2029', paddingBottom: '10px' },
    
    grid: { display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' },
    
    pinnedCard: { 
        backgroundColor: 'rgba(255, 181, 71, 0.05)', 
        border: '1px solid #ffb547', 
        borderRadius: '15px', 
        padding: '25px', 
        position: 'relative' 
    },
    pinnedBadge: {
        position: 'absolute', top: '20px', right: '20px',
        backgroundColor: '#ffb547', color: 'black',
        fontSize: '0.7rem', fontWeight: 'bold',
        padding: '4px 8px', borderRadius: '4px'
    },
    cardTitle: { marginTop: 0, color: '#ffb547', fontSize: '1.5rem' },
    cardBody: { fontSize: '1.1rem', lineHeight: '1.6', color: '#e0e0e0' },
    cardFooter: { marginTop: '20px', display: 'flex', gap: '20px', fontSize: '0.9rem', color: '#8b8d9d' },

    listContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
    regularCard: {
        backgroundColor: '#151621',
        border: '1px solid #2a2b3d',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'transform 0.2s',
    },
    regularTitle: { margin: '0 0 8px 0', fontSize: '1.1rem', color: 'white' },
    regularBody: { margin: 0, color: '#8b8d9d', fontSize: '0.95rem' },
    regularMeta: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px', minWidth: '100px', textAlign: 'right' },
    
    author: { fontWeight: 'bold', color: 'white' },
    date: { display: 'flex', alignItems: 'center', gap: '5px' },
    tag: { fontSize: '0.7rem', backgroundColor: '#2a2b3d', padding: '2px 8px', borderRadius: '4px', color: '#2970ff' }
};

export default NoticeBoard;