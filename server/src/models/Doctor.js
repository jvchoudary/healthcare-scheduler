import mongoose from 'mongoose';

const TimeRangeSchema = new mongoose.Schema({
    start: String,
    end: String
}, { _id: false });

const AvailabilityRuleSchema = new mongoose.Schema({
    day: Number,
    timeRanges: [TimeRangeSchema]
}, { _id: false });

const DoctorSchema = new mongoose.Schema({
    name: String,
    specialty: String,
    email: String,
    phone: String,
    timezone: { type: String, default: 'Asia/Kolkata' },
    appointmentDurationMin: { type: Number, default: 30 },
    bufferMin: { type: Number, default: 10 },
    maxDailyAppointments: { type: Number, default: 16 },
    availabilityRules: [AvailabilityRuleSchema],
    preferences: {
        avoidBackToBack: { type: Boolean, default: true },
        prefersMornings: { type: Boolean, default: true }
    }
}, { timestamps: true });

export default mongoose.model('Doctor', DoctorSchema);