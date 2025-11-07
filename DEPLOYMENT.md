# Deployment Guide - Riverwood Real Estate Platform

## Infrastructure Cost Estimate

### Monthly Costs (Moderate Usage - 1000 users/month)

| Service | Plan | Cost (USD) |
|---------|------|-----------|
| **Frontend (Vercel)** | Pro | $20 |
| **Backend (Render/Railway)** | Standard | $25 |
| **MongoDB Atlas** | M10 Cluster | $57 |
| **Redis (Upstash)** | Free/Pro | $0-10 |
| **OpenAI API** | Pay-as-you-go | $10-20 |
| **ElevenLabs** | Starter | $5 |
| **Razorpay** | Transaction fees | 2% per transaction |
| **Twilio** | Pay-as-you-go | $5-10 |
| **SendGrid** | Essentials | $15 |
| **Total** | | **$137-162/month** |

### Latency Targets

- **LLM Response**: < 2s
- **TTS Generation**: < 1s
- **Total End-to-End**: < 3s
- **Database Queries**: < 100ms
- **Payment Processing**: < 500ms

---

## Deployment Steps

### 1. Frontend (Vercel)

```bash
cd frontend
npm install
npm run build

# Deploy to Vercel
vercel --prod
```

**Environment Variables (Vercel):**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### 2. Backend (Render/Railway)

```bash
cd backend
npm install

# Set environment variables in Render/Railway dashboard
# Copy from backend/.env.example
```

**Required Environment Variables:**
- `MONGODB_URI`
- `REDIS_URL`
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `SENDGRID_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `FRONTEND_URL`

### 3. MongoDB Atlas Setup

1. Create cluster at https://cloud.mongodb.com
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for Render)
4. Get connection string
5. Update `MONGODB_URI` in backend env

### 4. Redis Setup (Upstash)

1. Create account at https://upstash.com
2. Create Redis database
3. Copy `REDIS_URL`
4. Update in backend env

### 5. Google Calendar API

1. Go to Google Cloud Console
2. Enable Calendar API
3. Create OAuth 2.0 credentials
4. Set redirect URI: `https://your-backend.com/api/auth/google/callback`
5. Get refresh token (one-time setup)
6. Update env variables

### 6. Razorpay Setup

1. Create account at https://razorpay.com
2. Get API keys from dashboard
3. Set webhook URL: `https://your-backend.com/api/payments/webhook`
4. Update env variables

### 7. Twilio Setup

1. Create account at https://twilio.com
2. Get phone number
3. Get Account SID and Auth Token
4. Update env variables

### 8. SendGrid Setup

1. Create account at https://sendgrid.com
2. Verify sender email
3. Get API key
4. Update env variables

---

## Testing Instructions

### 1. Test Voice Chat

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm run dev

# Open http://localhost:3000
# Click voice chat widget
# Say: "Find 150 sq m plot under 35 lakhs"
```

### 2. Test Booking Flow

```
User: "Find 150 sq m plot < ₹35L and book visit tomorrow 11 AM"
Agent: [Searches listings, shows results, asks confirmation]
User: "Yes"
Agent: [Creates booking, calendar event, sends confirmation]
```

### 3. Test Payment Flow

```
User: "I want to pay token amount"
Agent: [Creates payment link, sends via message]
User: [Clicks link, pays]
Webhook: [Updates booking status]
```

### 4. Test Memory

```
User: "I like plots near parks"
Agent: [Saves preference]
User: "Show me properties"
Agent: [Uses saved preference, shows plots near parks]
```

---

## Monitoring & Maintenance

### Key Metrics to Monitor

1. **Response Latency**: Should be < 3s
2. **API Error Rate**: Should be < 1%
3. **Payment Success Rate**: Should be > 95%
4. **Memory Usage**: Redis should be < 80%
5. **Database Connections**: MongoDB should be < 80%

### Logging

- Backend logs: Check Render/Railway logs
- Frontend errors: Check Vercel logs
- API errors: Monitor `/api/health` endpoint

### Scaling Considerations

- **Horizontal Scaling**: Add more backend instances
- **Database**: Upgrade MongoDB cluster tier
- **Caching**: Increase Redis memory
- **CDN**: Use Vercel's CDN for static assets

---

## Security Checklist

- [ ] All API keys in environment variables
- [ ] HTTPS enabled on all services
- [ ] CORS configured properly
- [ ] Payment webhooks verified with signatures
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] JWT tokens for authentication
- [ ] Database connection strings secured

---

## Support & Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   - Check REDIS_URL format
   - Verify Upstash database is active

2. **MongoDB Connection Failed**
   - Check MONGODB_URI format
   - Verify IP whitelist includes Render IPs

3. **TTS Not Working**
   - Verify ElevenLabs API key
   - Check API quota/limits

4. **Payment Webhook Not Received**
   - Verify webhook URL in Razorpay dashboard
   - Check backend logs for incoming requests

---

## Production Checklist

- [ ] All environment variables set
- [ ] Database backups enabled
- [ ] Monitoring set up
- [ ] Error tracking (Sentry) configured
- [ ] Analytics (Google Analytics) added
- [ ] SSL certificates valid
- [ ] Domain configured
- [ ] Email templates tested
- [ ] SMS templates tested
- [ ] Payment flow tested end-to-end
- [ ] Calendar integration tested
- [ ] Memory system tested
- [ ] Admin dashboard accessible

