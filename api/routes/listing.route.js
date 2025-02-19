import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Create a new listing (protected by token)
router.post('/create', verifyToken, createListing);

// Delete a listing (protected by token and admin role)
router.delete('/delete/:id', verifyToken,  deleteListing); // Only admins can delete listings

// Update a listing (protected by token)
router.post('/update/:id', verifyToken, updateListing);

// Get a specific listing
router.get('/get/:id', getListing);

// Get all listings
router.get('/get', getListings);

export default router;
