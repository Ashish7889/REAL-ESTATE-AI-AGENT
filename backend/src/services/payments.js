import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function createPaymentLink(params) {
  try {
    const { amount, bookingId, currency = 'INR' } = params;

    if (!amount || !bookingId) {
      throw new Error('Amount and bookingId required');
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    return {
      orderId: order.id,
      amount: amount,
      currency: currency,
      paymentLink: `${process.env.FRONTEND_URL}/payments/${order.id}`,
      keyId: process.env.RAZORPAY_KEY_ID
    };
  } catch (error) {
    console.error('Create payment link error:', error);
    throw error;
  }
}

export async function verifyPayment(paymentId, orderId) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    
    if (payment.order_id === orderId && payment.status === 'captured') {
      return { verified: true, payment };
    }
    
    return { verified: false };
  } catch (error) {
    console.error('Verify payment error:', error);
    return { verified: false, error: error.message };
  }
}

