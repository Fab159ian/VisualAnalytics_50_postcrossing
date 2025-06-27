import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const fetchPostcards = () => api.get('/postcards');
export const fetchSimilar = (id) => api.get(`/postcards/${id}/similar`);
export const fetchTags = () => api.get('/tags');

export default api;
