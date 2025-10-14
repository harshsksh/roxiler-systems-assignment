import api from './api';

export const storeService = {
  getAllStores: (params = {}) => {
    return api.get('/stores', { params });
  },

  getStoreById: (id) => {
    return api.get(`/stores/${id}`);
  },

  createStore: (storeData) => {
    return api.post('/stores', storeData);
  },

  updateStore: (id, storeData) => {
    return api.put(`/stores/${id}`, storeData);
  },

  deleteStore: (id) => {
    return api.delete(`/stores/${id}`);
  },

  getStoreRatings: (id, params = {}) => {
    return api.get(`/stores/${id}/ratings`, { params });
  }
};
