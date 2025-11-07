'use client';

import VoiceChatWidget from '../components/VoiceChatWidget';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/listings/search`);
      setListings(response.data.listings || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Riverwood Projects</h1>
          <p className="text-gray-600">Find your dream property</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Featured Properties</h2>
          
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No listings found. Use the voice assistant to search!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing: any) => (
                <div key={listing._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {listing.images?.[0] && (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{listing.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{(listing.price / 100000).toFixed(2)}L
                      </span>
                      <span className="text-sm text-gray-500">
                        {listing.area} sq.m
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Voice Chat Widget */}
      <VoiceChatWidget />
    </div>
  );
}

