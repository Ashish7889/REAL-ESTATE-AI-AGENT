import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';

export async function createBooking(params, userId) {
  try {
    const { listingId, visitDate, visitTime, user } = params;

    if (!listingId || !visitDate || !visitTime || !user) {
      throw new Error('Missing required booking parameters');
    }

    // Check listing availability
    const listing = await Listing.findById(listingId);
    if (!listing || listing.availability.status !== 'available') {
      throw new Error('Listing not available');
    }

    // Create booking
    const booking = new Booking({
      listing: listingId,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      visitDate: new Date(visitDate),
      visitTime: visitTime,
      status: 'confirmed'
    });

    await booking.save();
    return booking.toObject();
  } catch (error) {
    console.error('Create booking error:', error);
    throw error;
  }
}

export async function getBookingById(id) {
  try {
    return await Booking.findById(id).populate('listing').lean();
  } catch (error) {
    console.error('Get booking error:', error);
    return null;
  }
}

