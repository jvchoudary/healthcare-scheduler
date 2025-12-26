import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config.js';
import availabilityRoutes from './routes/availability.js';
import appointmentRoutes from './routes/appointments.js';
import Doctor from './models/Doctor.js';
import User from './models/User.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/slots', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);

app.post('/api/health', (req, res) => res.json({ ok: true }));

async function seed() {
    const existingDoctors = await Doctor.countDocuments();
    const existingPatients = await User.countDocuments();
    if (!existingDoctors) {
        await Doctor.create({
            name: 'Dr. Asha Kumar',
            specialty: 'General Medicine',
            email: 'asha@example.com',
            phone: '+911234567890',
            appointmentDurationMin: 30,
            bufferMin: 10,
            availabilityRules: [
                { day: 1, timeRanges: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] },
                { day: 2, timeRanges: [{ start: '09:00', end: '12:00' }] },
                { day: 4, timeRanges: [{ start: '10:00', end: '16:00' }] }
            ],
            preferences: { avoidBackToBack: true, prefersMornings: true }
        });
    }
    if (!existingPatients) {
        await User.create({
            role: 'patient',
            name: 'Ravi Singh',
            email: 'ravi@example.com',
            phone: '+919876543210',
            preferences: { days: [1, 2, 4], timeRanges: [{ start: '09:00', end: '12:00' }] }
        });
    }
}

mongoose.connect(config.mongoUri).then(async () => {
    console.log('Mongo connected');
    await seed();
    app.listen(config.port, () => console.log(`API on http://localhost:${config.port}`));
}).catch(err => {
    console.error('Mongo connection error:', err);
});