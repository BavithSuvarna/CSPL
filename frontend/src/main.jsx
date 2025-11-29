// frontend/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';


// in frontend/src/main.jsx (near top, before creating app)
import axios from 'axios';
axios.defaults.withCredentials = false; // we use header token, not cookies

// attach admin token if present
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers['x-admin-token'] = token;
  return config;
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);