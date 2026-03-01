import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat'; 
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { FiWind, FiSun, FiMapPin, FiUser, FiCrosshair, FiClock, FiExternalLink } from 'react-icons/fi'; 
import '../styles/DashboardNew.css';

// --- HELPER FUNCTIONS ---
const getUserIdFromToken = () => {
    const token = localStorage.getItem('access');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user_id; 
    } catch (e) { return null; }
};

const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `https://pulse-v2-backend.onrender.com${path}`;
};

const parseCoords = (report) => {
    const lat = parseFloat(report.latitude);
    const lng = parseFloat(report.longitude);
    if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) return [lat, lng];
    return null; 
};

const generateCaseId = (id) => {
    if (!id) return 'PENDING';
    const uniquePart = (id + 10000).toString(16).toUpperCase(); 
    return `CASE-${uniquePart}`;
};

const shouldShowMarker = (report) => {
    if (report.status !== 'resolved') return true;
    const resolvedDate = new Date(report.updated_at || report.created_at);
    const now = new Date();
    const diffInHours = (now - resolvedDate) / (1000 * 60 * 60);
    return diffInHours < 12;
};

// --- MAP COMPONENTS ---

const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center && center.lat && center.lng) {
            map.flyTo([center.lat, center.lng], 15, { animate: true, duration: 1.5 });
        }
    }, [center, map]);
    return null;
};


const AutoFitBounds = ({ reports, disabled }) => {
    const map = useMap();
    useEffect(() => {
        if (disabled) return; 

        const visibleReports = reports.filter(shouldShowMarker);
        const validCoords = visibleReports.map(r => parseCoords(r)).filter(c => c !== null);
        
        if (validCoords.length > 0) {
            const bounds = L.latLngBounds(validCoords);
            map.fitBounds(bounds, { padding: [80, 80] });
        }
    }, [reports, map, disabled]); // Add disabled dependency
    return null;
};

const TrafficHeatmap = ({ reports }) => {
    const map = useMap();
    useEffect(() => {
        const trafficPoints = reports
            .filter(r => {
                if (!shouldShowMarker(r)) return false;
                const isTrafficCategory = r.category && r.category.toLowerCase() === 'traffic';
                const isTrafficTitle = r.title && r.title.toLowerCase().includes('traffic');
                return isTrafficCategory || isTrafficTitle;
            })
            .map(r => parseCoords(r))
            .filter(c => c !== null)
            .map(c => [...c, 1.0]);

        if (trafficPoints.length > 0) {
            const heat = L.heatLayer(trafficPoints, { radius: 40, blur: 25, maxZoom: 15, gradient: { 0.4: '#ffd700', 0.65: '#ff8c00', 1.0: '#ff0000' } }).addTo(map);
            return () => { map.removeLayer(heat); };
        }
    }, [reports, map]);
    return null;
};

const getMarkerIcon = (status) => {
    let color = '#ffb547'; 
    let glowColor = 'rgba(255, 181, 71, 0.6)';
    if (status === 'verified') { color = '#007bff'; glowColor = 'rgba(0, 123, 255, 0.6)'; } 
    if (status === 'resolved') { color = '#00d68f'; glowColor = 'rgba(0, 214, 143, 0.2)'; } 

    return L.divIcon({
        className: 'pro-pin-container',
        html: `<div class="pro-pin-glow" style="background: ${glowColor}"></div>
               <div class="pro-pin-core" style="background: ${color}"><div class="pro-pin-center"></div></div>`,
        iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -15]
    });
};

const UserLocationDot = ({ userLocation }) => {
    if (!userLocation) return null;
    return (
        <>
            <CircleMarker center={userLocation} radius={25} pathOptions={{ color: 'transparent', fillColor: '#2970ff', fillOpacity: 0.2 }} />
            <CircleMarker center={userLocation} radius={8} pathOptions={{ color: 'white', weight: 2, fillColor: '#2970ff', fillOpacity: 1 }}>
                <Popup>You are here</Popup>
            </CircleMarker>
        </>
    );
};

// --- MAIN DASHBOARD ---
const Dashboard = () => {
    const navigate = useNavigate();
    const [mapCenter, setMapCenter] = useState({ lat: 26.8467, lng: 80.9462 }); 
    const [userLocation, setUserLocation] = useState(null); 
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [globalReports, setGlobalReports] = useState([]); 
    const [leaderboard, setLeaderboard] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState({ temp: '--', aqi: '--', aqiStatus: 'Syncing...' });
    const [locationName, setLocationName] = useState('Locating...');

    
    const [manualFocus, setManualFocus] = useState(false);

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        // 1. Disable Auto-Fit so it doesn't zoom back out
        setManualFocus(true);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const newUserLoc = { lat: latitude, lng: longitude };
                
                setUserLocation(newUserLoc); 
                setMapCenter(newUserLoc); // Triggers RecenterMap
                
                fetchRealWeather(latitude, longitude);
            }, 
            (err) => {
                console.error("GPS Error:", err);
                alert("Location access denied.");
            }, 
            { enableHighAccuracy: true }
        );
    };

    useEffect(() => { fetchAllData(); }, []); // Removed handleLocateMe from initial load to stop race conditions

    const fetchAllData = async () => {
        const token = localStorage.getItem('access');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        setLoading(true);
        try {
            const realUserId = getUserIdFromToken();
            const userRes = await api.get('user/profile/', config);
            setUser(userRes.data);
            const reportRes = await api.get('reports/', config);
            const allData = reportRes.data;
            setGlobalReports(allData); 
            const myReports = allData.filter(r => {
                if (realUserId && r.user == realUserId) return true;
                return false;
            });
            setReports(myReports.sort((a, b) => b.id - a.id)); 
            const lbRes = await api.get('leaderboard/', config);
            setLeaderboard(lbRes.data);
            
            // Initial Locate (Only runs once safely)
            handleLocateMe();

        } catch (e) { console.error("Data Load Failed", e); }
        setLoading(false);
    };

    const fetchRealWeather = async (lat, lon) => {
        try {
            const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const address = geoRes.data.address;
            const city = address.city || address.town || address.village || "Lucknow";
            setLocationName(city);

            const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const aqiRes = await axios.get(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`);
            
            setWeather({ 
                temp: Math.round(weatherRes.data.current_weather.temperature), 
                aqi: aqiRes.data.current.us_aqi, 
                aqiStatus: aqiRes.data.current.us_aqi > 100 ? "Unhealthy" : "Good" 
            });
        } catch (e) { 
            console.error("Weather Error", e);
            setWeather({ temp: 28, aqi: 110, aqiStatus: "Offline" });
        }
    };

    const getStatusCounts = () => {
        const stats = { resolved: 0, verified: 0, pending: 0 };
        globalReports.forEach(r => { 
            const status = r.status ? r.status.toLowerCase() : 'pending';
            if (stats[status] !== undefined) stats[status]++;
            else stats.pending++;
        });
        return [
            { name: 'Resolved', value: stats.resolved, color: '#00d68f' },
            { name: 'Verified', value: stats.verified, color: '#007bff' },
            { name: 'Pending',  value: stats.pending,  color: '#ffb547' },
        ].filter(item => item.value > 0);
    };

    const statusData = getStatusCounts();
    const getStatusColor = (s) => (s === 'resolved' ? '#00d68f' : s === 'verified' ? '#007bff' : '#ffb547');
    const getAqiColor = (aqi) => (aqi <= 50 ? '#00d68f' : aqi <= 100 ? '#ffb547' : '#ff3b3b');
    const mapReports = reports.filter(r => parseCoords(r) !== null && shouldShowMarker(r));
    const recentReports = reports.slice(0, 4);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: '#151621',
                    border: '1px solid #2970ff',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.8)',
                    zIndex: 1000
                }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                        <span style={{ 
                            display: 'inline-block', width: '10px', height: '10px', 
                            backgroundColor: payload[0].payload.fill, borderRadius: '50%', marginRight: '8px' 
                        }}></span>
                        {payload[0].name}: <span style={{ color: '#2970ff', marginLeft: '5px' }}>{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) return <div style={{color: 'white', padding: 40}}>Loading Command Center...</div>;

    return (
        <div className="dashboard-grid">
            <div className="main-content">
                <div className="map-section" style={{ 
                    position: 'relative', overflow: 'hidden', borderRadius: '16px', 
                    border: '2px solid #2970ff', boxShadow: '0 0 20px rgba(41, 112, 255, 0.3)' 
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundImage: 'linear-gradient(rgba(41, 112, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(41, 112, 255, 0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 400, boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
                    }}></div>
                    
                    <div style={{position: 'absolute', top: 20, left: 20, zIndex: 999}}>
                        <h2 style={{margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)', color: 'white'}}>Command Center</h2>
                        <span style={{color: '#00d68f', fontSize: '0.9rem', fontWeight: 'bold'}}>● Live Monitoring</span>
                    </div>

                    <button 
                        onClick={handleLocateMe}
                        style={{
                            position: 'absolute', top: 20, right: 20, zIndex: 999,
                            background: '#2970ff', color: 'white', border: 'none',
                            padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                        }}
                    >
                        <FiCrosshair /> Locate Me
                    </button>

                    <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                        
                        {/* PASSING 'disabled' PROP TO STOP CONFLICT */}
                        <AutoFitBounds reports={mapReports} disabled={manualFocus} />
                        
                        <RecenterMap center={mapCenter} />
                        <UserLocationDot userLocation={userLocation} />
                        <TrafficHeatmap reports={mapReports} /> 
                        {mapReports.map((report) => (
                            <Marker key={report.id} position={parseCoords(report)} icon={getMarkerIcon(report.status)}>
                                <Popup><strong>{report.title}</strong><br/>{report.status}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                
                <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                        <h3 style={{color: '#8b8d9d', margin: 0}}>My Recent Reports</h3>
                        <span style={{color: '#2970ff', cursor: 'pointer', fontSize: '0.9rem'}} onClick={() => navigate('/history')}>View Full History →</span>
                    </div>
                    
                    {recentReports.length > 0 ? (
                        <div className="reports-section">
                            {recentReports.map((report) => {
                                const hasCoords = parseCoords(report) !== null;
                                return (
                                    <div key={report.id} className="flip-card">
                                        <div className="flip-card-inner">
                                            {/* --- FRONT OF CARD --- */}
                                            <div className="flip-card-front">
                                                <div className="status-tag" style={{backgroundColor: getStatusColor(report.status), zIndex: 2}}>
                                                    {report.status}
                                                </div>

                                                <div style={{
                                                    position: 'absolute', top: 10, left: 10, zIndex: 2, 
                                                    backgroundColor: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px',
                                                    fontSize: '0.65rem', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                                                    backdropFilter: 'blur(4px)'
                                                }}>
                                                    {generateCaseId(report.id)}
                                                </div>
                                                
                                                <div style={{height: '120px', overflow: 'hidden', borderBottom: '1px solid #2a2b3d', position:'relative'}}>
                                                    <img 
                                                        src={getImageUrl(report.image)} 
                                                        alt="Report" 
                                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                    />
                                                </div>

                                                <div style={{padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                    <h4 style={{margin: '0 0 5px 0', fontSize: '1rem', color: 'white'}}>{report.title}</h4>
                                                    <div style={{display: 'flex', alignItems: 'center', color: hasCoords ? '#8b8d9d' : '#ff4d4d', fontSize: '0.8rem'}}>
                                                        <FiMapPin style={{marginRight: 5}}/> 
                                                        {hasCoords ? (report.location || locationName) : "No GPS Data"}
                                                    </div>
                                                </div>
                                                
                                                {report.feedback && (
                                                    <div style={{position: 'absolute', bottom: 10, right: 10, fontSize: '0.7rem', color: '#2970ff', opacity: 0.8}}>
                                                        ⟳ VIEW INTEL
                                                    </div>
                                                )}
                                            </div>

                                            {/* --- BACK OF CARD --- */}
                                            <div className="flip-card-back">
                                                <div className="terminal-header">
                                                    // {generateCaseId(report.id)}
                                                </div>
                                                
                                                {report.feedback ? (
                                                    <>
                                                        <p className="feedback-text">
                                                            <span style={{color: '#00d68f'}}>{">"} ADMIN:</span> {report.feedback}
                                                        </p>
                                                        {report.resolved_image && (
                                                            <div style={{position:'relative', marginTop:'10px'}}>
                                                                <img 
                                                                    src={getImageUrl(report.resolved_image)} 
                                                                    alt="Fix Proof" 
                                                                    className="resolved-img-preview"
                                                                />
                                                                 <a 
                                                                    href={getImageUrl(report.resolved_image)} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    style={{
                                                                        position: 'absolute', bottom: 5, right: 5,
                                                                        color: '#00d68f', textDecoration: 'none',
                                                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                                                        padding: '2px 8px', borderRadius: '4px',
                                                                        fontSize: '0.65rem', border: '1px solid #00d68f'
                                                                    }}
                                                                >
                                                                    View Proof
                                                                </a>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div style={{textAlign: 'center', opacity: 0.5, marginTop: '20px'}}>
                                                        <FiClock size={30} />
                                                        <p>Awaiting Admin Review...</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{padding: '40px', textAlign: 'center', color: '#666', border: '1px dashed #333', borderRadius: '12px'}}>
                            <p>You haven't submitted any reports yet.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="sidebar">
                <div className="sidebar-card">
                    <div className="profile-card-header" style={{display:'flex', alignItems:'center', gap:'15px'}}>
                         <div style={{
                            width: '50px', height: '50px', borderRadius: '50%', 
                            backgroundColor: '#2a2b3d', overflow: 'hidden', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px solid #2970ff'
                        }}>
                            {user && user.profile_picture ? (
                                <img src={getImageUrl(user.profile_picture)} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                            ) : (
                                <FiUser size={24} color="#8b8d9d"/>
                            )}
                        </div>
                        <div><h3 style={{margin: 0}}>{user ? user.username : "Guest"}</h3></div>
                    </div>
                    <button className="view-profile-btn" onClick={() => navigate('/user/profile')}>View Profile</button>
                </div>

                <div className="sidebar-card">
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Air Quality</span><FiWind color={getAqiColor(weather.aqi)}/></div>
                    <div className="aqi-container">
                        <div style={{width: '120px', height: '60px', background: `linear-gradient(90deg, ${getAqiColor(weather.aqi)} 0%, #333 100%)`, borderRadius: '100px 100px 0 0', margin: '0 auto'}}></div>
                        <div className="aqi-value" style={{color: getAqiColor(weather.aqi)}}>{weather.aqi}</div>
                    </div>
                </div>

                <div className="sidebar-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                            <span style={{color: '#8b8d9d', fontSize: '0.9rem'}}>{locationName}</span>
                            <h2 style={{fontSize: '3rem', margin: '5px 0'}}>{weather.temp}°C</h2>
                        </div>
                        <FiSun size={40} color="#ffb547"/>
                    </div>
                </div>

                <button onClick={() => navigate('/new-report')} style={{
                    background: '#2970ff', color: 'white', padding: '15px', 
                    borderRadius: '12px', width: '100%', border: 'none', cursor: 'pointer', margin: '20px 0', fontWeight: 'bold', fontSize: '1rem'
                }}>
                    + Report New Incident
                </button>

                <div className="sidebar-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                         <h4 style={{margin: 0}}>Top Contributors</h4>
                         <span style={{fontSize: '0.8rem', color: '#2970ff', cursor: 'pointer'}} onClick={() => navigate('/missions')}>View All</span>
                    </div>
                    {leaderboard.slice(0, 3).map((u, index) => (
                        <div key={index} className="leader-row" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #2a2b3d'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0}}>
                                <span style={{color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32', fontWeight: 'bold', width: '15px'}}>#{index + 1}</span>
                                <div style={{width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#2a2b3d', flexShrink: 0}}>
                                    {u.profile_picture ? (
                                        <img src={getImageUrl(u.profile_picture)} alt="pfp" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                    ) : (
                                        <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}><FiUser size={14} color="#888"/></div>
                                    )}
                                </div>
                                <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px', fontWeight: '500'}}>{u.username}</span>
                            </div>
                            <span style={{color: '#00d68f', fontSize: '0.9rem', fontWeight: 'bold'}}>{u.points} XP</span>
                        </div>
                    ))}
                </div>

                <div className="sidebar-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                        <span style={{fontWeight: 'bold', color: '#e0e0e0'}}>System Status</span>
                        <span style={{fontSize: '0.8rem', color: '#8b8d9d'}}>
                            {globalReports.length} Total
                        </span>
                    </div>
                    
                    <div style={{height: '140px', position: 'relative'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} position={{ x: 170, y: 50 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            textAlign: 'center', pointerEvents: 'none'
                        }}>
                            <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#fff'}}>
                                {Math.round((statusData.find(d => d.name === 'Resolved')?.value || 0) / (globalReports.length || 1) * 100)}%
                            </div>
                            <div style={{fontSize: '0.6rem', color: '#8b8d9d', textTransform: 'uppercase', letterSpacing: '1px'}}>
                                Efficiency
                            </div>
                        </div>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '5px'}}>
                        {statusData.map((item) => (
                            <div key={item.name} style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#aaa'}}>
                                <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color}}></div>
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    locateBtn: { position: 'absolute', top: 20, right: 20, zIndex: 1000, background: '#2970ff', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }
};

export default Dashboard;