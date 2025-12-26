import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Types.ObjectId, ref: 'Doctor', required: true },
    type: { type: String, enum: ['consult', 'followup', 'telehealth'], default: 'consult' },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'canceled', 'completed'], default: 'scheduled' },
    notes: String
}, { timestamps: true });

AppointmentSchema.index({ doctorId: 1, start: 1, end: 1 });

export default mongoose.model('Appointment', AppointmentSchema);