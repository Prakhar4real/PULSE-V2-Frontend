import React from 'react';
import { FiTarget, FiShield, FiStar, FiUser, FiAward, FiTrendingUp } from 'react-icons/fi';

const RanksRewards = () => {
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}><FiAward color="#ffb547" />Ranks & Rewards</h1>
                <p style={styles.subtitle}>
                    Your civic engagement directly impacts your community. Level up by completing missions and reporting issues to unlock recognition and exclusive community shoutouts.
                </p>

                <hr style={styles.divider} />

                <h2 style={styles.sectionTitle}>The Reward System</h2>
                <div style={styles.rewardsBox}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>
                        <strong style={{ color: '#00d68f' }}>Top Citizen of the Week:</strong> The user who earns the most XP in a 7-day period receives a dedicated shoutout on the PULSE community dashboard and our social channels.
                    </p>
                    <p style={{ margin: 0, fontSize: '1.1rem' }}>
                        <strong style={{ color: '#2970ff' }}>City Guardian of the Month:</strong> The absolute top contributor of the month receives official recognition as the City Guardian, showcasing their unmatched dedication to urban improvement.
                    </p>
                </div>

                <hr style={styles.divider} />

                <h2 style={styles.sectionTitle}><FiTrendingUp /> Rank Progression Tier List</h2>
                
                <div style={styles.tierList}>
                    {/* Tier 1 */}
                    <div style={styles.tierCard}>
                        <div style={{...styles.iconWrapper, border: '2px solid #8b8d9d', color: '#8b8d9d'}}><FiUser size={24} /></div>
                        <div style={styles.tierInfo}>
                            <h3 style={styles.tierName}>Citizen <span style={{ color: '#888', fontSize: '0.9rem' }}>(0+ XP)</span></h3>
                            <p style={styles.tierDesc}>You have joined the initiative. Start reporting verified issues to gain XP and climb the ranks.</p>
                        </div>
                    </div>

                    {/* Tier 2 */}
                    <div style={styles.tierCard}>
                        <div style={{...styles.iconWrapper, border: '2px solid #00d68f', color: '#00d68f'}}><FiTarget size={24} /></div>
                        <div style={styles.tierInfo}>
                            <h3 style={styles.tierName}>Scout <span style={{ color: '#888', fontSize: '0.9rem' }}>(100+ XP)</span></h3>
                            <p style={styles.tierDesc}>You are actively keeping your city safe. Your reports are verified and creating real physical impact.</p>
                        </div>
                    </div>

                    {/* Tier 3 */}
                    <div style={styles.tierCard}>
                        <div style={{...styles.iconWrapper, border: '2px solid #2970ff', color: '#2970ff'}}><FiShield size={24} /></div>
                        <div style={styles.tierInfo}>
                            <h3 style={styles.tierName}>Guardian <span style={{ color: '#888', fontSize: '0.9rem' }}>(300+ XP)</span></h3>
                            <p style={styles.tierDesc}>A recognized pillar of the community. You actively seek out missions and ensure structural integrity.</p>
                        </div>
                    </div>

                    {/* Tier 4 */}
                    <div style={styles.tierCard}>
                        <div style={{...styles.iconWrapper, border: '2px solid #ffd700', color: '#ffd700'}}><FiStar size={24} /></div>
                        <div style={styles.tierInfo}>
                            <h3 style={styles.tierName}>Hero <span style={{ color: '#888', fontSize: '0.9rem' }}>(500+ XP)</span></h3>
                            <p style={styles.tierDesc}>The highest honor. You are a driving force behind your city's infrastructure and environmental health.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0b0c15',
        color: 'white',
        padding: '40px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        fontFamily: "'Inter', sans-serif"
    },
    card: {
        backgroundColor: '#151621',
        borderRadius: '15px',
        padding: '40px',
        maxWidth: '800px',
        width: '100%',
        border: '1px solid #2a2b3d',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    },
    title: {
        fontSize: '2.5rem',
        margin: '0 0 15px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    subtitle: {
        fontSize: '1.1rem',
        color: '#a1a1aa',
        lineHeight: '1.6',
        margin: '0 0 30px 0'
    },
    divider: {
        border: 'none',
        borderBottom: '1px solid #2a2b3d',
        margin: '30px 0'
    },
    sectionTitle: {
        fontSize: '1.8rem',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    rewardsBox: {
        backgroundColor: '#1f2029',
        padding: '25px',
        borderRadius: '12px',
        borderLeft: '4px solid #ffb547'
    },
    tierList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    tierCard: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1f2029',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #2a2b3d'
    },
    iconWrapper: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#252525',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '20px',
        flexShrink: 0
    },
    tierInfo: {
        flex: 1
    },
    tierName: {
        margin: '0 0 5px 0',
        fontSize: '1.4rem'
    },
    tierDesc: {
        margin: 0,
        color: '#a1a1aa',
        lineHeight: '1.4'
    }
};

export default RanksRewards;