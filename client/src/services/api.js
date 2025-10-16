import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    const publicEndpoints = [
      '/auth/login',
      '/auth/register'
    ];
    
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url.startsWith(endpoint)
    );
    
    const isPublicStoreList = config.url === '/stores' && config.method.toLowerCase() === 'get';
    
    if (!isPublicEndpoint && !isPublicStoreList && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
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
