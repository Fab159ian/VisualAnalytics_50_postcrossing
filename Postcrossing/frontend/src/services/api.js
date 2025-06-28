import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Postcard endpoints
export const fetchRandomPostcard = () => api.get('/get-postcard/');
export const fetchSimilarPostcards = (id, limit = 10) => api.get(`/similar-postcards/${id}/?limit=${limit}`);
// Params are red, green, blue, saturation, limit(optional)
export const fetchColorSimilarPostcards = (params) => api.get('/color-similar/', { params });

//TODO: if some more specific logic and database queries are needed for visualization, 
//      we can add them here and in the backend

// Tag endpoints
export const fetchTags = () => api.get('/tags/');

// Postcard filtering using ViewSet (filter, search, ordering)
export const fetchPostcards = (filters = {}) => {
  const params = new URLSearchParams();
  
  // Add all filter parameters
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Handle multiple values (like multiple tags)
      value.forEach(v => params.append(key, v));
    } else if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });
  
  return api.get(`/postcards/?${params.toString()}`);
};

// Convenience functions for common filtering patterns
export const fetchPostcardsByTags = (tagNames, additionalFilters = {}) => {
  return fetchPostcards({
    'tags__name': tagNames,
    ...additionalFilters
  });
};

export const fetchPostcardsByTag = (tagName, additionalFilters = {}) => {
  return fetchPostcards({
    'tags__name': tagName,
    ...additionalFilters
  });
};

// REST API endpoints (through the ViewSet)
export const fetchAllPostcards = () => api.get('/postcards/');
export const fetchPostcard = (id) => api.get(`/postcards/${id}/`);
export const createPostcard = (data) => api.post('/postcards/', data);
export const updatePostcard = (id, data) => api.put(`/postcards/${id}/`, data);
export const deletePostcard = (id) => api.delete(`/postcards/${id}/`);

export default api;
