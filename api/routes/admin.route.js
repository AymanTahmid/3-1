// /api/routes/admin.route.js
import { Router } from 'express';
import { deleteListing, getListings } from '../controllers/listing.controller.js';

const router = Router();

// GET all listings
router.get('/listings', getListings);

// DELETE a listing by id
router.delete('/listings/:id', deleteListing);

export default router;
