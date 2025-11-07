import express from 'express';
import { createPaymentLink, verifyPayment } from '../services/payments.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// Create payment link
router.post('/create', async (req, res) => {
  try {
    const { amount, bookingId } = req.body;
    const paymentLink = await createPaymentLink({ amount, bookingId });
    res.json(paymentLink);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Payment webhook (Razorpay)
router.post('/webhook', async (req, res) => {
  try {
    const { event, payload } = req.body;

    if (event === 'payment.captured') {
      const { payment } = payload;
      const bookingId = payment.notes?.bookingId;

      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          'payment.paymentStatus': 'paid',
          'payment.razorpayPaymentId': payment.id,
          'payment.razorpayOrderId': payment.order_id
        });
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;
    const result = await verifyPayment(paymentId, orderId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

