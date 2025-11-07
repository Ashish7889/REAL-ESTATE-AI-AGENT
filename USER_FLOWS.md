# User Flow Examples - Riverwood Platform

## Example Flow 1: Search → Book → Pay → Calendar

### User Journey

**User:** "Find 150 sq m plot near park under 35 lakhs and book visit tomorrow 11 AM"

**Step 1: Intent Extraction**
```json
{
  "intent": "search",
  "parameters": {
    "area": 150,
    "maxPrice": 3500000,
    "nearby": ["park"],
    "propertyType": "plot"
  }
}
```

**Step 2: Search Listings**
- Backend queries MongoDB
- Filters: area 135-165 sq.m, price ≤ 35L, nearby includes "park"
- Returns top 3 matches

**Step 3: Agent Response**
```
"Main aapke liye 3 plots mil gaye hain. Sabse achha wala 150 sq.m ka hai, park ke paas, 32 lakhs mein. 
Kal 11 AM pe visit book karun?"
```

**User:** "Haan, book kar do"

**Step 4: Create Booking**
- Creates booking record
- Status: "confirmed"
- Visit date: tomorrow, 11 AM

**Step 5: Create Calendar Event**
- Google Calendar API creates event
- Sends invite to user email
- Sets reminders (24h before, 30min before)

**Step 6: Send Confirmation**
- Email via SendGrid: "Your site visit is confirmed..."
- SMS via Twilio: "Site visit confirmed for tomorrow 11 AM"

**Step 7: Agent Response**
```
"Booking confirm ho gaya! Main aapko email aur SMS bhej diya hai. 
Calendar mein bhi add ho gaya. Token amount pay karna hai?"
```

**User:** "Haan, token amount kitna hai?"

**Step 8: Payment Link**
- Agent: "Token amount 50,000 rupees hai"
- Creates Razorpay payment link
- Sends link via message

**User:** [Clicks link, pays]

**Step 9: Webhook Processing**
- Razorpay webhook received
- Updates booking: paymentStatus = "paid"
- Sends confirmation email/SMS

**Step 10: Follow-up Scheduled**
- Agent schedules follow-up for day after visit
- Reminder: "How was your site visit?"

---

## Example Flow 2: Memory-Based Personalization

**First Interaction:**
**User:** "I like plots near schools"

**Agent:** 
- Saves preference: `{ preferredNearby: ["school"], propertyType: "plot" }`
- Stores in long-term memory (Redis, 30 days TTL)

**Second Interaction (Next Day):**
**User:** "Show me properties"

**Agent:**
- Retrieves long-term memory
- Context: "User prefers plots near schools"
- Searches with filters: propertyType="plot", nearby includes "school"
- Response: "Aapko school ke paas plots pasand hain, main aapke liye 5 options laaya hoon..."

---

## Example Flow 3: Construction Updates

**User:** "Site pe kya progress hai?"

**Agent:**
- Checks listing construction status
- Retrieves latest update from database
- Response: "Site pe cement flooring 60% complete hua hai, aur clubhouse ka frame ban raha hai. 
  Aapko detailed update email mein bhej du?"

**User:** "Haan bhej do"

**Agent:**
- Generates PDF with construction photos and progress
- Sends via SendGrid email
- Response: "Email bhej diya! Photos aur detailed progress report check karein."

---

## Technical Flow Diagram

```
User Input (Voice/Text)
    ↓
VoiceChatWidget (Frontend)
    ↓
POST /api/agent/message
    ↓
[Get Memory Context]
    ↓
LLM Service (OpenAI GPT-4o-mini)
    ↓
[Extract Intent & Parameters]
    ↓
[Execute Actions]
    ├─→ Search Listings
    ├─→ Create Booking
    ├─→ Create Payment Link
    ├─→ Create Calendar Event
    └─→ Send Notifications
    ↓
TTS Service (ElevenLabs)
    ↓
[Update Memory]
    ↓
Return Response (Text + Audio + Actions)
    ↓
Frontend (Display + Play Audio)
```

---

## Memory Flow

### Short-Term Memory (Last 5 Interactions)
```
Session: session_1234567890
Key: memory:short:session_1234567890
TTL: 1 hour
Value: [
  {
    userMessage: "Find 150 sq m plot",
    assistantResponse: "Main aapke liye 3 plots...",
    timestamp: "2024-01-15T10:00:00Z"
  },
  ...
]
```

### Long-Term Memory (User Preferences)
```
User: user_abc123
Key: memory:long:user_abc123
TTL: 30 days
Value: {
  preferredArea: 150,
  maxBudget: 3500000,
  propertyType: "plot",
  preferredNearby: ["park", "school"],
  updatedAt: "2024-01-15T10:05:00Z"
}
```

---

## Error Handling Flow

**Scenario:** Payment fails

1. User clicks payment link
2. Payment fails (insufficient funds)
3. Razorpay webhook: `payment.failed`
4. Backend updates booking: `paymentStatus = "failed"`
5. Agent sends message: "Payment fail ho gaya. Kya aap dobara try karna chahte hain?"
6. Creates new payment link if user confirms

---

## Confirmation Flow

**Agent always confirms before:**
- Creating bookings
- Sending payment links
- Sending documents
- Scheduling calendar events

**Example:**
```
User: "Book visit tomorrow"
Agent: "Kal 11 AM pe visit book karun? Confirm karein?"
User: "Haan"
Agent: [Creates booking]
```

