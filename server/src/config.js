import dotenv from 'dotenv';
dotenv.config();

export const config = {
    mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/healthcare_scheduler',
    port: process.env.PORT || 4000,
    twilioSid: process.env.TWILIO_SID || '',
    twilioToken: process.env.TWILIO_TOKEN || '',
    twilioFrom: process.env.TWILIO_FROM || '',
    claude_apiKey: process.env.CLAUDE_API_KEY || '',
    claude_apiUrl: process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages',
    claude_model: process.env.CLAUDE_MODEL || 'claude-opus-4-5-20251101'
};