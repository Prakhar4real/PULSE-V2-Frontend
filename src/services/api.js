// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // This connects to your Django Backend
});

export default api;