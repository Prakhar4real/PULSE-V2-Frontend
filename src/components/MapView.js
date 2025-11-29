import React, { useContext, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ThemeContext } from '../context/ThemeContext';

// --- ICON FIX ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to Fly to location
const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 13);
        }
    }, [center, map]);
    return null;
};

const MapView = ({ reports }) => {
  const { theme } = useContext(ThemeContext);
  const defaultPosition = [40.7128, -74.0060]; // Fallback (NY)
  const [userLocation, setUserLocation] = useState(null);

  const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const lightTiles = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const handleLocateMe = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
            },
            (error) => {
                console.error("GPS ERROR:", error);
                alert("Location access denied. Please check browser settings.");
            }
        );
    } else {
        alert("GPS not supported.");
    }
  };

  // Try to auto-locate once on load
  useEffect(() => {
    handleLocateMe();
  }, []);

  return (
    <div style={{ 
        position: 'relative',
        border: '1px solid var(--border)', 
        borderRadius: '12px', 
        overflow: 'hidden', 
        marginBottom: '30px',
        boxShadow: 'var(--shadow)'
    }}>
      
      {/* BUTTON IS NOW ALWAYS VISIBLE - NO CONDITIONS */}
      <button 
        onClick={handleLocateMe} 
        style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000, // Keeps it on top of the map
            padding: '8px 12px',
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        }}
      >
        LOCATE ME
      </button>

      <MapContainer 
        center={defaultPosition} 
        zoom={10} 
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url={theme === 'dark' ? darkTiles : lightTiles}
        />

        {/* If we have user location, fly there */}
        {userLocation && <RecenterMap center={userLocation} />}

        {/* 🔵 BLUE DOT (You) */}
        {userLocation && (
            <CircleMarker 
                center={userLocation} 
                pathOptions={{ color: '#ffffff', fillColor: '#2196f3', fillOpacity: 1 }} 
                radius={8}
            >
                <Popup>You are here</Popup>
            </CircleMarker>
        )}

        {/* 📍 REPORT PINS (Incidents) */}
        {reports.map((report) => (
          (report.latitude && report.longitude) && (
            <Marker 
              key={report.id} 
              position={[report.latitude, report.longitude]}
            >
              <Popup>
                <div style={{ color: 'black' }}>
                    <strong>{report.title}</strong><br/>
                    {report.city}<br/>
                    Status: {report.status}
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;