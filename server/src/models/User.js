import mongoose from 'mongoose';

const TimeRangeSchema = new mongoose.Schema({
    start: String,
    end: String
}, { _id: false });

const AvailabilityRuleSchema = new mongoose.Schema({
    dayOfWeek: Number,
    timeRanges: [TimeRangeSchema]
}, { _id: false });

const UserSchema = new mongoose.Schema({
    role: { type: String, enum: ['patient', 'admin'], required: true },
    name: String,
    email: String,
    phone: String,
    timezone: { type: String, default: 'Asia/Kolkata' },
    availabilityRules: [AvailabilityRuleSchema],
    leadTimeMinHours: String
}, { timestamps: true });

export default mongoose.model('User', UserSchema);