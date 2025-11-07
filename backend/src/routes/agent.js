import express from 'express';
import { generateResponse } from '../services/llm.js';
import { generateTTS } from '../services/tts.js';
import MemoryService from '../services/memory.js';
import Listing from '../models/Listing.js';
import Booking from '../models/Booking.js';
import { searchListings } from '../services/listings.js';
import { createBooking } from '../services/bookings.js';
import { createPaymentLink } from '../services/payments.js';
import { createCalendarEvent } from '../services/calendar.js';
import { sendNotification } from '../services/notifications.js';

const router = express.Router();
const memoryService = new MemoryService();

// Main agent endpoint
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId, userId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId required' });
    }

    // Get memory context
    const shortTerm = await memoryService.getShortTermMemory(sessionId);
    const longTerm = userId ? await memoryService.getLongTermMemory(userId) : {};
    const memoryContext = memoryService.formatMemoryForLLM(shortTerm, longTerm);

    // Generate LLM response
    const llmResponse = await generateResponse(message, memoryContext);

    // Execute actions based on intent
    const actions = [];
    
    if (llmResponse.intent === 'search' && llmResponse.parameters) {
      const results = await searchListings(llmResponse.parameters);
      actions.push({ type: 'search_results', payload: results });
    }

    if (llmResponse.intent === 'book' && llmResponse.parameters && !llmResponse.needs_confirmation) {
      const booking = await createBooking(llmResponse.parameters, userId);
      if (booking) {
        actions.push({ type: 'booking_created', payload: booking });
        
        // Create calendar event
        const calendarEvent = await createCalendarEvent(booking);
        if (calendarEvent) {
          actions.push({ type: 'calendar_created', payload: calendarEvent });
        }
        
        // Send confirmation
        await sendNotification({
          type: 'email',
          to: booking.user.email,
          subject: 'Site Visit Confirmed',
          body: `Your site visit is confirmed for ${booking.visitDate} at ${booking.visitTime}`
        });
      }
    }

    if (llmResponse.intent === 'pay' && llmResponse.parameters) {
      const paymentLink = await createPaymentLink(llmResponse.parameters);
      if (paymentLink) {
        actions.push({ type: 'payment_link', payload: paymentLink });
      }
    }

    // Generate TTS
    const audioData = await generateTTS(llmResponse.text);

    // Update memory
    await memoryService.addShortTermMemory(sessionId, {
      userMessage: message,
      assistantResponse: llmResponse.text,
      timestamp: new Date().toISOString()
    });

    // Update long-term preferences if detected
    if (llmResponse.parameters && userId) {
      const preferences = {};
      if (llmResponse.parameters.area) preferences.preferredArea = llmResponse.parameters.area;
      if (llmResponse.parameters.maxPrice) preferences.maxBudget = llmResponse.parameters.maxPrice;
      if (llmResponse.parameters.propertyType) preferences.propertyType = llmResponse.parameters.propertyType;
      
      if (Object.keys(preferences).length > 0) {
        await memoryService.updateLongTermMemory(userId, preferences);
      }
    }

    // Return response
    res.json({
      text: llmResponse.text,
      fallback_text: llmResponse.fallback_text || llmResponse.text,
      audio: audioData,
      intent: llmResponse.intent,
      actions: actions,
      needs_confirmation: llmResponse.needs_confirmation || false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agent error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      message: error.message 
    });
  }
});

export default router;

