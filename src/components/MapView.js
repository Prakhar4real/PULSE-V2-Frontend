import React, { useContext } from 'react'; // <--- Import useContext
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ThemeContext } from '../context/ThemeContext'; // <--- Import the Brain

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
// ----------------

const MapView = ({ reports }) => {
  const { theme } = useContext(ThemeContext); // <--- Listen to Global Theme
  const defaultPosition = [40.7128, -74.0060]; // Default: NY
  
  // Define Tiles
  const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const lightTiles = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div style={{ 
        border: '1px solid var(--border)', 
        borderRadius: '12px', 
        overflow: 'hidden', 
        marginBottom: '30px',
        boxShadow: 'var(--shadow)'
    }}>
      <MapContainer 
        center={defaultPosition} 
        zoom={10} 
        style={{ height: '400px', width: '100%' }}
      >
        {/* Automatically switch tiles based on Global Theme */}
        <TileLayer
          attribution='&copy; CARTO'
          url={theme === 'dark' ? darkTiles : lightTiles}
        />

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