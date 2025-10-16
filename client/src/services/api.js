import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // List of public endpoints that don't require authentication
    const publicEndpoints = [
      '/auth/login',
      '/auth/register',
      '/stores'
    ];
    
    // Check if the current request is to a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url.startsWith(endpoint)
    );
    
    // Add Authorization header for all requests except public endpoints
    if (!isPublicEndpoint && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
