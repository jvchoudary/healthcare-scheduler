import dotenv from 'dotenv';
dotenv.config();

export const config = {
    mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/healthcare_scheduler',
    port: process.env.PORT || 4000,
    twilioSid: process.env.TWILIO_SID || '',
    twilioToken: process.env.TWILIO_TOKEN || '',
    twilioFrom: process.env.TWILIO_FROM || '',
    // For a real AI provider, swap mock with actual key
    claudeApiKey: process.env.CLAUDE_API_KEY || ''
};