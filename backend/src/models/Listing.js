import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  propertyType: { 
    type: String, 
    enum: ['plot', 'apartment', 'villa', 'commercial'],
    required: true 
  },
  area: { type: Number, required: true }, // in sq.m
  price: { type: Number, required: true },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    nearby: [String] // e.g., ["park", "school", "hospital"]
  },
  images: [String],
  features: [String],
  availability: {
    status: { type: String, enum: ['available', 'booked', 'sold'], default: 'available' },
    availableFrom: Date
  },
  construction: {
    status: { type: String, enum: ['planning', 'in-progress', 'completed'], default: 'planning' },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    updates: [{
      date: Date,
      description: String,
      progress: Number
    }]
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Listing', listingSchema);

