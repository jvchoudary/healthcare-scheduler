import mongoose from 'mongoose';

const PreferencesSchema = new mongoose.Schema({
    days: [Number], // 0-6
    timeRanges: [{ start: String, end: String }],
    notes: String
}, { _id: false });

const UserSchema = new mongoose.Schema({
    role: { type: String, enum: ['patient', 'admin'], required: true },
    name: String,
    email: String,
    phone: String,
    timezone: { type: String, default: 'Asia/Kolkata' },
    preferences: PreferencesSchema
}, { timestamps: true });

export default mongoose.model('User', UserSchema);