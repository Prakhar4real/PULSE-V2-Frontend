import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat'; 
import { LineChart, Line, ResponsiveContainer, XAxis } from 'recharts'; 
import { FiWind, FiSun, FiMapPin, FiUser, FiCrosshair } from 'react-icons/fi'; 
import { FaRobot } from 'react-icons/fa'; 
import '../styles/DashboardNew.css';

// --- HELPER: GET IMAGE URL ---
const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://127.0.0.1:8000${path}`;
};

// --- STABLE COORDS ---
const getStableCoords = (report) => {
    if (report.latitude && report.longitude) {
        return [parseFloat(report.latitude), parseFloat(report.longitude)];
    }
    return [0, 0]; 
};

// --- DYNAMIC PINS ---
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

// --- 3. BLUE DOT---
const UserLocationDot = ({ userLocation }) => {
    const map = useMap();
    const hasFlown = React.useRef(false); 

    useEffect(() => {
        if (userLocation && !hasFlown.current) {
            map.flyTo(userLocation, 14, { animate: true, duration: 2 });
            hasFlown.current = true; 
        }
    }, [userLocation, map]);

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

// --- LOCATE BTN ---
const LocateButton = ({ onLocate }) => (
    <button onClick={onLocate} style={styles.locateBtn}><FiCrosshair /> Locate Me</button>
);

// --- HEATMAP ---
const TrafficHeatmap = ({ reports }) => {
    const map = useMap();
    useEffect(() => {
        const trafficPoints = reports
            .filter(r => r.latitude && r.longitude && !isNaN(r.latitude) && ((r.category && r.category.toLowerCase() === 'traffic') || r.title.toLowerCase().includes('traffic')))
            .map(r => [parseFloat(r.latitude), parseFloat(r.longitude), 1.0]);

        if (trafficPoints.length > 0) {
            const heat = L.heatLayer(trafficPoints, { radius: 40, blur: 25, maxZoom: 15, gradient: { 0.4: '#ffd700', 0.65: '#ff8c00', 1.0: '#ff0000' } }).addTo(map);
            return () => { map.removeLayer(heat); };
        }
    }, [reports, map]);
    return null;
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [mapCenter, setMapCenter] = useState({ lat: 26.8467, lng: 80.9462 }); 
    const [userLocation, setUserLocation] = useState(null); 
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState({ temp: '--', aqi: '--', aqiStatus: 'Loading...' });
    const [locationName, setLocationName] = useState('Detecting City...');
    const [trafficData, setTrafficData] = useState([]);

    const handleLocateMe = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            const newUserLoc = { lat: latitude, lng: longitude };
            setUserLocation(newUserLoc); setMapCenter(newUserLoc);
            fetchRealWeather(latitude, longitude);
        }, (err) => console.error(err), { enableHighAccuracy: true });
    };

    useEffect(() => {
        fetchAllData();
        fetchTrafficStats();
        handleLocateMe();
    }, []);

    
    const fetchAllData = async () => {
        const token = localStorage.getItem('access');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        setLoading(true);

        try {
            const userRes = await api.get('user/profile/', config);
            setUser(userRes.data);
        } catch (e) { console.error("User Load Failed", e); }

        try {
            const reportRes = await api.get('reports/', config);
            setReports(reportRes.data);
        } catch (e) { console.error("Reports Load Failed", e); }

        try {
            const lbRes = await api.get('leaderboard/', config);
            setLeaderboard(lbRes.data);
        } catch (e) { console.error("Leaderboard Load Failed", e); }

        setLoading(false);
    };

    const fetchTrafficStats = async () => {
        try {
            const token = localStorage.getItem('access');
            const res = await api.get('traffic-stats/', { headers: { Authorization: `Bearer ${token}` } });
            setTrafficData(res.data);
        } catch (error) {
            setTrafficData([{ time: '10am', flow: 10 }, { time: '12pm', flow: 20 }, { time: '2pm', flow: 15 }, { time: '4pm', flow: 40 }]);
        }
    };

    const fetchRealWeather = async (lat, lon) => {
        try {
            const geoRes = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            setLocationName(geoRes.data.city || "Lucknow");
            const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const aqiRes = await axios.get(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`);
            setWeather({ temp: Math.round(weatherRes.data.current_weather.temperature), aqi: aqiRes.data.current.us_aqi, aqiStatus: aqiRes.data.current.us_aqi > 100 ? "Unhealthy" : "Good" });
        } catch (e) { setWeather({ temp: 25, aqi: 150, aqiStatus: "Offline Mode" }); }
    };

    const getStatusColor = (s) => (s === 'resolved' ? '#00d68f' : s === 'verified' ? '#007bff' : '#ffb547');
    const getAqiColor = (aqi) => (aqi <= 50 ? '#00d68f' : aqi <= 100 ? '#ffb547' : '#ff3b3b');

   
    const validMapReports = reports.filter(r => r.latitude && r.longitude && !isNaN(r.latitude));

    if (loading) return <div style={{color: 'white', padding: 40}}>Loading Command Center...</div>;

    return (
        <div className="dashboard-grid" style={{position: 'relative'}}>

            <div className="main-content">
                <div className="map-section">
                    <div style={{position: 'absolute', top: 20, left: 20, zIndex: 999}}>
                        <h2 style={{margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)', color: 'white'}}>Command Center</h2>
                        <span style={{color: '#00d68f', fontSize: '0.9rem', fontWeight: 'bold'}}>● Live Monitoring</span>
                    </div>
                    
                    <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                        <LocateButton onLocate={handleLocateMe} />
                        <UserLocationDot userLocation={userLocation} />
                        <TrafficHeatmap reports={reports} />
                        
                        {validMapReports.map((report) => (
                            <Marker key={report.id} position={getStableCoords(report)} icon={getMarkerIcon(report.status)}>
                                <Popup><strong>{report.title}</strong><br/>{report.status}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                <div>
                    <h3 style={{color: '#8b8d9d', marginBottom: '10px'}}>Live Citizen Reports ({reports.length})</h3>
                    <div className="reports-section">
                        {reports.map((report) => (
                            <div key={report.id} className="report-card-modern">
                                <div className="status-tag" style={{backgroundColor: getStatusColor(report.status)}}>{report.status}</div>
                                <img src={getImageUrl(report.image)} alt="Report" className="report-img-modern" />
                                <h4 style={{margin: '10px 0', fontSize: '1rem'}}>{report.title}</h4>
                                <div style={{display: 'flex', alignItems: 'center', color: '#8b8d9d', fontSize: '0.8rem'}}>
                                    <FiMapPin style={{marginRight: 5}}/> {report.location || locationName}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="sidebar">
                
                {/* 1. USER PROFILE */}
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

                {/* 2. AIR QUALITY */}
                <div className="sidebar-card">
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Air Quality</span><FiWind color={getAqiColor(weather.aqi)}/></div>
                    <div className="aqi-container">
                        <div style={{width: '120px', height: '60px', background: `linear-gradient(90deg, ${getAqiColor(weather.aqi)} 0%, #333 100%)`, borderRadius: '100px 100px 0 0', margin: '0 auto'}}></div>
                        <div className="aqi-value" style={{color: getAqiColor(weather.aqi)}}>{weather.aqi}</div>
                    </div>
                </div>

                {/* 3. WEATHER */}
                <div className="sidebar-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                            <span style={{color: '#8b8d9d', fontSize: '0.9rem'}}>{locationName}</span>
                            <h2 style={{fontSize: '3rem', margin: '5px 0'}}>{weather.temp}°C</h2>
                        </div>
                        <FiSun size={40} color="#ffb547"/>
                    </div>
                </div>

                {/* ✅ REPORT BUTTON */}
                <button 
                    onClick={() => navigate('/new-report')} 
                    style={{
                        background: '#2970ff', color: 'white', padding: '15px', 
                        borderRadius: '12px', width: '100%', border: 'none', 
                        cursor: 'pointer', margin: '20px 0', fontWeight: 'bold', fontSize: '1rem'
                    }}
                >
                    + Report New Incident
                </button>

                {/* 4. TOP CONTRIBUTORS */}
                <div className="sidebar-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                         <h4 style={{margin: 0}}>Top Contributors</h4>
                         <span style={{fontSize: '0.8rem', color: '#2970ff', cursor: 'pointer'}} onClick={() => navigate('/missions')}>View All</span>
                    </div>
                    {leaderboard.length > 0 ? leaderboard.slice(0, 3).map((u, index) => (
                        <div key={index} className="leader-row" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #2a2b3d'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0}}>
                                <span style={{
                                    color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32', 
                                    fontWeight: 'bold', width: '15px'
                                }}>#{index + 1}</span>

                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', 
                                    backgroundColor: '#2a2b3d', flexShrink: 0
                                }}>
                                    {u.profile_picture ? (
                                        <img src={getImageUrl(u.profile_picture)} alt="pfp" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                    ) : (
                                        <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                            <FiUser size={14} color="#888"/>
                                        </div>
                                    )}
                                </div>

                                <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px', fontWeight: '500'}}>
                                    {u.username}
                                </span>
                            </div>
                            <span style={{color: '#00d68f', fontSize: '0.9rem', fontWeight: 'bold'}}>{u.points} XP</span>
                        </div>
                    )) : <p style={{color: '#555', fontSize: '0.8rem'}}>No data yet</p>}
                </div>

                {/* 5. TRAFFIC FLOW */}
                <div className="sidebar-card">
                    <span>Traffic Flow (Reports)</span>
                    <div style={{height: '100px'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trafficData}>
                                <Line type="monotone" dataKey="flow" stroke="#2970ff" strokeWidth={3} dot={false} />
                                <XAxis dataKey="time" hide />
                            </LineChart>
                        </ResponsiveContainer>
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