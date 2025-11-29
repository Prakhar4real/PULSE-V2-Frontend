import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_KEY = process.env.REACT_APP_WEATHER_KEY;

  useEffect(() => {
    // 1. Function to fetch weather by coordinates
    const fetchWeatherByCoords = async (lat, lon) => {
      try {
        // API Call using Latitude & Longitude
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        const response = await axios.get(url);
        setWeather(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("Weather data unavailable");
        setLoading(false);
      }
    };

    // 2. Function to fetch fallback city (if GPS denied)
    const fetchDefaultCity = async () => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=Lucknow&units=metric&appid=${API_KEY}`;
            const response = await axios.get(url);
            setWeather(response.data);
            setLoading(false);
        } catch (err) {
            setError("Weather data unavailable");
            setLoading(false);
        }
    }

    // 3. Ask Browser for Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success! We have coordinates.
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          // Error or Denied -> Fallback to Lucknow
          console.warn("Location access denied. Using default city.");
          fetchDefaultCity();
        }
      );
    } else {
      fetchDefaultCity();
    }
  }, [API_KEY]);

  if (loading) return <div style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Detecting Location...</div>;
  if (error) return <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>;
  if (!weather) return null;

  const iconUrl = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div className="card" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        padding: '15px 25px',
        borderLeft: '4px solid var(--accent)',
        marginBottom: '30px',
        animation: 'fadeIn 0.5s ease-in'
    }}>
      <img src={iconUrl} alt="Weather Icon" style={{ width: '50px', height: '50px' }} />
      
      <div>
        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{Math.round(weather.main.temp)}°C</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
            {weather.weather[0].description} • Humidity: {weather.main.humidity}%
        </p>
      </div>

      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
        <span style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            padding: '5px 12px', 
            borderRadius: '15px', 
            fontSize: '0.8rem', 
            fontWeight: '600' 
        }}>
             {weather.name}
        </span>
      </div>
    </div>
  );
};

export default WeatherWidget;