import express from 'express';
import Listing from '../models/Listing.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// Get all listings (admin)
router.get('/listings', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings (admin)
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('listing')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update construction progress
router.put('/listings/:id/construction', async (req, res) => {
  try {
    const { progress, description } = req.body;
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        'construction.progress': progress,
        $push: {
          'construction.updates': {
            date: new Date(),
            description: description,
            progress: progress
          }
        },
        updatedAt: new Date()
      },
      { new: true }
    );
    res.json(listing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get lead pipeline
router.get('/leads', async (req, res) => {
  try {
    const leads = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          bookings: { $push: '$$ROOT' }
        }
      }
    ]);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

