import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config.js';
import slotsRoutes from './routes/slots.js';
import appointmentRoutes from './routes/appointments.js';
import Doctor from './models/Doctor.js';
import User from './models/User.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', slotsRoutes);
app.use('/api', appointmentRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true }));

async function seed() {
    const existingDoctors = await Doctor.countDocuments();
    const existingPatients = await User.countDocuments();
    if (!existingDoctors) {
        await Doctor.create({
            name: 'Dr. Radhika',
            specialty: 'General Medicine',
            email: 'radhika.kode829@gmail.com',
            phone: '+918553578177',
            appointmentDurationMin: 50,
            bufferMin: 10,
            availabilityRules: [
                { dayOfWeek: 1, timeRanges: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] },
                { dayOfWeek: 2, timeRanges: [{ start: '09:00', end: '12:00' }] },
                { dayOfWeek: 4, timeRanges: [{ start: '10:00', end: '16:00' }] }
            ],
            blackoutDates: ["2026-01-01"],
            busyBlocks: [
                {"start": "2025-12-27T10:00:00+05:30", "end": "2025-12-27T11:00:00+05:30"}
            ]
        });
    }
    if (!existingPatients) {
        await User.create({
            role: 'patient',
            name: 'Sunny',
            email: 'sriharimannam7@gmail.com',
            phone: '+916281512171',
            availabilityRules: [
                { dayOfWeek: 1, timeRanges: [{ start: '08:00', end: '19:00' }] },
                { dayOfWeek: 3, timeRanges: [{ start: '08:00', end: '19:00' }] },
                { dayOfWeek: 5, timeRanges: [{ start: '08:00', end: '19:00' }] }
            ],
            leadTimeMinHours: 24
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