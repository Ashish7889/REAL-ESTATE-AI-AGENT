import express from 'express';
import { createBooking, getBookingById } from '../services/bookings.js';

const router = express.Router();

// Create booking
router.post('/', async (req, res) => {
  try {
    const booking = await createBooking(req.body, req.user?.id);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

