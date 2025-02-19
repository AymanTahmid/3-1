// /client/src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get('/api/admin/listings'); 
      // Adjust if your backend route is different
      setListings(res.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/listings/${id}`);
      setListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Admin Dashboard</h1>
      {listings.map((listing) => (
        <div key={listing._id} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
          <h3>{listing.title}</h3>
          <p>{listing.description}</p>
          <button onClick={() => handleDelete(listing._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
