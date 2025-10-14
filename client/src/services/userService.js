import api from './api';

export const userService = {
  getAllUsers: (params = {}) => {
    return api.get('/users', { params });
  },

  getUserById: (id) => {
    return api.get(`/users/${id}`);
  },

  createUser: (userData) => {
    return api.post('/users', userData);
  },

  updateUser: (id, userData) => {
    return api.put(`/users/${id}`, userData);
  },

  deleteUser: (id) => {
    return api.delete(`/users/${id}`);
  },

  getDashboardStats: () => {
    return api.get('/users/dashboard/stats');
  }
};
