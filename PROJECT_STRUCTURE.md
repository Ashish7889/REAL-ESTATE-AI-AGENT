# Riverwood Real Estate Platform - Project Structure

```
riverwood-platform/
├── frontend/                    # Next.js Frontend
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Homepage with listings
│   │   ├── listings/
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Listing detail
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── listings/
│   │   │   ├── bookings/
│   │   │   └── leads/
│   │   └── api/                # Next.js API routes (proxy)
│   ├── components/
│   │   ├── VoiceChatWidget.tsx # Main voice/chat widget
│   │   ├── ListingCard.tsx
│   │   ├── BookingForm.tsx
│   │   ├── PaymentButton.tsx
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── ListingEditor.tsx
│   │       └── ConstructionProgress.tsx
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   ├── memory.ts           # Memory management
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   └── next.config.js
│
├── backend/                     # Node.js Backend
│   ├── src/
│   │   ├── index.js            # Express server
│   │   ├── routes/
│   │   │   ├── listings.js
│   │   │   ├── bookings.js
│   │   │   ├── payments.js
│   │   │   ├── agent.js        # AI agent endpoint
│   │   │   └── admin.js
│   │   ├── services/
│   │   │   ├── llm.js          # LLM integration
│   │   │   ├── tts.js          # TTS integration
│   │   │   ├── memory.js       # Memory management
│   │   │   ├── calendar.js     # Google Calendar
│   │   │   ├── notifications.js # Twilio + SendGrid
│   │   │   └── payments.js      # Razorpay integration
│   │   ├── models/
│   │   │   ├── Listing.js
│   │   │   ├── Booking.js
│   │   │   └── User.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── memory.js
│   │   └── utils/
│   │       ├── intentExtraction.js
│   │       └── validators.js
│   ├── package.json
│   └── .env.example
│
├── shared/                      # Shared types/utilities
│   └── types.js
│
├── docs/
│   ├── DEPLOYMENT.md
│   ├── API.md
│   └── USER_FLOWS.md
│
├── .gitignore
└── README.md
```

