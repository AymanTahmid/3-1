// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust the base URL if needed
});

// Delete a listing
export const deleteListing = (id) => api.delete(`/listing/${id}`);

// Fetch all listings
export const getListings = () => api.get('/listing');

export default api;
