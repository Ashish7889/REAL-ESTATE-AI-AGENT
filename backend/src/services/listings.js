import Listing from '../models/Listing.js';

export async function searchListings(filters) {
  try {
    const query = { 'availability.status': 'available' };

    if (filters.area) {
      query.area = { $gte: filters.area * 0.9, $lte: filters.area * 1.1 }; // ±10% tolerance
    }

    if (filters.maxPrice) {
      query.price = { $lte: filters.maxPrice };
    }

    if (filters.propertyType) {
      query.propertyType = filters.propertyType;
    }

    if (filters.location) {
      query['location.city'] = new RegExp(filters.location, 'i');
    }

    if (filters.nearby) {
      query['location.nearby'] = { $in: filters.nearby };
    }

    const listings = await Listing.find(query)
      .sort({ price: 1 })
      .limit(10)
      .lean();

    return listings;
  } catch (error) {
    console.error('Search listings error:', error);
    return [];
  }
}

export async function getListingById(id) {
  try {
    return await Listing.findById(id).lean();
  } catch (error) {
    console.error('Get listing error:', error);
    return null;
  }
}

