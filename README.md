# Riverwood Real Estate Platform

A Zillow-level real estate platform with autonomous AI voice agent that automates the entire user journey from discovery to booking, payments, calendar management, and follow-ups.

## 🚀 Features

- **Voice + Chat First**: Support for voice input (Hindi/Hinglish + English) and text input
- **Full Automation**: AI agent handles search, booking, payments, calendar, notifications
- **Memory System**: Short-term (last 5 interactions) and long-term (user preferences) memory
- **Human-like TTS**: ElevenLabs integration for natural voice responses
- **Payment Integration**: Razorpay for Indian market
- **Calendar Integration**: Google Calendar for automatic event creation
- **Notifications**: Email (SendGrid) and SMS (Twilio) confirmations
- **Admin Dashboard**: Manage listings, bookings, leads, construction progress

## 📁 Project Structure

```
riverwood-platform/
├── frontend/          # Next.js frontend
├── backend/           # Node.js/Express backend
├── docs/              # Documentation
└── README.md
```

See `PROJECT_STRUCTURE.md` for detailed structure.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB, Redis
- **LLM**: OpenAI GPT-4o-mini
- **TTS**: ElevenLabs
- **Payments**: Razorpay
- **Calendar**: Google Calendar API
- **Notifications**: Twilio (SMS), SendGrid (Email)
- **Hosting**: Vercel (frontend), Render/Railway (backend)

## 📦 Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with API URL
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)

See `backend/.env.example` for all required variables:

- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string
- `OPENAI_API_KEY` - OpenAI API key
- `ELEVENLABS_API_KEY` - ElevenLabs API key
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay secret
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `SENDGRID_API_KEY` - SendGrid API key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🎯 Example User Flow

**User:** "Find 150 sq m plot near park under 35 lakhs and book visit tomorrow 11 AM"

1. Agent extracts intent and parameters
2. Searches listings matching criteria
3. Shows top matches
4. Asks for confirmation
5. On confirmation:
   - Creates booking
   - Creates Google Calendar event
   - Sends email/SMS confirmation
   - Offers payment link for token amount

See `USER_FLOWS.md` for detailed flow examples.

## 📊 Infrastructure Cost

**Estimated Monthly Cost: $137-162**

- Frontend (Vercel Pro): $20
- Backend (Render Standard): $25
- MongoDB Atlas (M10): $57
- Redis (Upstash): $0-10
- OpenAI API: $10-20
- ElevenLabs: $5
- Twilio: $5-10
- SendGrid: $15

See `DEPLOYMENT.md` for detailed cost breakdown.

## ⚡ Performance Targets

- **LLM Response**: < 2s
- **TTS Generation**: < 1s
- **End-to-End Latency**: < 3s
- **Database Queries**: < 100ms

## 🚀 Deployment

See `DEPLOYMENT.md` for complete deployment guide.

### Quick Deploy

1. **Frontend (Vercel)**
   ```bash
   cd frontend
   vercel --prod
   ```

2. **Backend (Render)**
   - Connect GitHub repo
   - Set environment variables
   - Deploy

3. **Database (MongoDB Atlas)**
   - Create cluster
   - Whitelist Render IPs
   - Get connection string

## 🧪 Testing

```bash
# Test voice chat
# Open http://localhost:3000
# Click voice widget
# Say: "Find 150 sq m plot under 35 lakhs"

# Test booking flow
# Say: "Book visit tomorrow 11 AM"
# Confirm booking
# Check email/SMS confirmation

# Test payment
# Say: "I want to pay token amount"
# Click payment link
# Complete payment
```

## 📚 Documentation

- `PROJECT_STRUCTURE.md` - Project organization
- `USER_FLOWS.md` - User flow examples
- `DEPLOYMENT.md` - Deployment guide and costs
- `API.md` - API documentation (coming soon)

## 🔒 Security

- All API keys in environment variables
- HTTPS enabled
- CORS configured
- Payment webhooks verified
- Input validation on all endpoints
- JWT authentication (for admin)

## 🤝 Contributing

This is a production-ready scaffold. Customize as needed for your requirements.

## 📝 License

Proprietary - Riverwood Projects LLP

## 📞 Support

For queries: radhika.goyal@riverwoodindia.com

---

**Built with ❤️ for Riverwood Projects LLP**
