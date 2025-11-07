# How to Get Indian Accent Voice for Miss Riverwood

## Current Setup
The current voice (Rachel) is multilingual but may sound American. To get an authentic Indian accent, you need to use an Indian voice from ElevenLabs Voice Library.

## Steps to Find Indian Voice:

1. **Visit ElevenLabs Voice Library:**
   - Go to: https://elevenlabs.io/voice-library
   - Or: https://elevenlabs.io/app/voice-library

2. **Search for Indian Voices:**
   - Search for: "Indian", "Ayesha", "Monika", "Alekhya", "Sravani"
   - Filter by: Female, Customer Service, Professional
   - Look for voices tagged with "Indian" or "Indian English"

3. **Test the Voice:**
   - Click on a voice you like
   - Listen to the sample
   - Make sure it sounds Indian and soft/gentle

4. **Get the Voice ID:**
   - Once you find a voice you like, click on it
   - Look for the voice ID (it's usually in the URL or voice settings)
   - Copy the voice ID

5. **Update the .env file:**
   - Open `server/.env`
   - Replace `ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM`
   - With: `ELEVENLABS_VOICE_ID=YOUR_INDIAN_VOICE_ID_HERE`

6. **Restart the server:**
   ```bash
   cd server
   npm start
   ```

## Alternative: Create Custom Indian Voice

If you can't find a suitable voice:

1. **Use Voice Design:**
   - Go to ElevenLabs Voice Design tool
   - Set: Female, Middle-aged, Indian accent
   - Generate a custom voice
   - Use that voice ID

2. **Use Voice Cloning:**
   - If you have a sample of an Indian female voice you like
   - Use ElevenLabs voice cloning feature
   - Create a custom voice clone

## Recommended Indian Voices to Try:

- **Ayesha** - Energetic Indian Voice
- **Monika Sogam** - Indian English accent
- **Alekhya** - Indian Middle-Aged Woman
- **Sravani** - Talkative Indian Woman

## Current Settings (Optimized for Indian Accent):

- Model: `eleven_multilingual_v2` (best for Indian English and Hinglish)
- Stability: 0.5 (natural variation)
- Similarity: 0.9 (very human-like)
- Style: 0.2 (soft, gentle, humble)

These settings will work well once you use an Indian voice ID!

