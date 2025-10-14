import api from './api';

export const ratingService = {
  submitRating: (ratingData) => {
    return api.post('/ratings', ratingData);
  },

  getUserRatings: (params = {}) => {
    return api.get('/ratings/my-ratings', { params });
  },

  deleteRating: (id) => {
    return api.delete(`/ratings/${id}`);
  }
};
