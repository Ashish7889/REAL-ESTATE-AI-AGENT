import express from 'express';
import Listing from '../models/Listing.js';
import { searchListings, getListingById } from '../services/listings.js';

const router = express.Router();

// Search listings
router.get('/search', async (req, res) => {
  try {
    const filters = {
      area: req.query.area ? parseFloat(req.query.area) : null,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
      propertyType: req.query.propertyType || null,
      location: req.query.location || null,
      nearby: req.query.nearby ? req.query.nearby.split(',') : null
    };

    const listings = await searchListings(filters);
    res.json({ listings, count: listings.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create listing (admin)
router.post('/', async (req, res) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update listing (admin)
router.put('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

