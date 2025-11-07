import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  visitDate: { type: Date, required: true },
  visitTime: { type: String, required: true }, // e.g., "11:00 AM"
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment: {
    tokenAmount: Number,
    paymentId: String,
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    razorpayOrderId: String,
    razorpayPaymentId: String
  },
  calendar: {
    eventId: String,
    calendarLink: String
  },
  reminders: [{
    type: { type: String, enum: ['email', 'sms'] },
    sentAt: Date,
    status: String
  }],
  followUp: {
    scheduled: Boolean,
    scheduledAt: Date,
    completed: Boolean
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);

