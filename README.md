# TTS Assistant - AI Realtor Voice Agent

An AI-powered voice assistant for real estate agencies that handles incoming calls, qualifies leads, and saves customer information. Built with Twilio, OpenAI's Realtime API, and Fastify.

## Features

- 🎤 **Real-time Voice AI** - Natural conversations powered by OpenAI GPT-4o Realtime API
- 🌐 **Bilingual Support** - Seamlessly switches between English and Spanish
- 📞 **Twilio Integration** - Works with your existing phone number
- 📊 **Lead Management** - Automatically saves qualified leads to CSV
- 🔒 **Secure** - Enterprise-grade encryption for voice data
- ⚡ **Low Latency** - <300ms response times

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Twilio account with a phone number
- OpenAI API key with Realtime API access
- ngrok or similar for local development

## Installation

1. Clone the repository:
```bash
git clone https://github.com/DrCiroSmith/tts-assistant.git
cd tts-assistant
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd src/frontend
npm install
cd ../..
```

4. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

5. Fill in your environment variables:
```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
OPENAI_API_KEY=sk-...
PORT=3000
DOMAIN=your-ngrok-domain.ngrok-free.app
```

## Running the Application

### Development Mode

Start the backend server with hot-reload:
```bash
npm run dev
```

Start the frontend development server:
```bash
cd src/frontend
npm run dev
```

### Production Mode

Build and run:
```bash
npm run build
npm start
```

Build the frontend:
```bash
npm run build:frontend
```

## Setting Up Twilio

1. Log in to your [Twilio Console](https://console.twilio.com/)
2. Go to Phone Numbers → Manage → Active numbers
3. Select your phone number
4. Under Voice Configuration:
   - Set "A CALL COMES IN" webhook to: `https://your-domain/incoming-call`
   - Method: POST

## Project Structure

```
tts-assistant/
├── src/
│   ├── frontend/          # React frontend application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── NavBar.tsx
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── VoiceOrb.tsx
│   │   │   │   ├── FeatureSection.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── App.tsx
│   │   └── package.json
│   ├── routes/
│   │   └── call.ts        # Twilio webhook handlers
│   ├── services/
│   │   ├── stream.ts      # OpenAI Realtime API integration
│   │   └── excelService.ts # Lead storage service
│   ├── prompts.ts         # AI system prompts
│   └── server.ts          # Fastify server entry point
├── test/
│   └── save_lead.ts       # Lead storage tests
├── leads.csv              # Saved leads database
├── package.json
├── tsconfig.json
└── .env.example
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/incoming-call` | POST | Twilio webhook for incoming calls |
| `/gather-language` | POST | Language selection handler (1=English, 2=Spanish) |
| `/media-stream` | WebSocket | Real-time audio stream for AI conversation |

## Call Flow

1. Caller dials your Twilio number
2. They hear: "Hello. For English, press 1. Para Español, presione el número 2."
3. Based on selection, they're connected to the AI assistant
4. The AI:
   - Greets them and confirms they're interested in Miami properties
   - Asks if they have time to chat
   - Collects their name, property interest (buy/rent/invest), and budget
   - Saves the lead information
   - Lets them know a senior agent will call back

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm run build:frontend` | Build the frontend application |
| `npm run lint` | Run TypeScript type checking |
| `npm run test` | Run tests |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `PORT` | Server port (default: 3000) |
| `DOMAIN` | Your public domain for webhooks |

## License

ISC
