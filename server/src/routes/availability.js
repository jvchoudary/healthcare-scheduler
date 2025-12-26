import { Router } from 'express';
import { z } from 'zod';
import { generateCandidates } from '../services/availability.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { rankSlotsWithAI } from '../services/ai.js';

const router = Router();

const SuggestSchema = z.object({
    patientId: z.string(),
    doctorId: z.string(),
    dateRange: z.object({ start: z.string(), end: z.string() }),
    durationMin: z.number().optional()
});

router.post('/', async (req, res) => {
    const parsed = SuggestSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const { patientId, doctorId, dateRange, durationMin } = parsed.data;

    const patient = await User.findById(patientId);
    const doctor = await Doctor.findById(doctorId);
    if (!patient || !doctor) return res.status(404).json({ error: 'Patient or doctor not found' });

    const candidates = await generateCandidates({
        doctorId,
        startDate: dateRange.start,
        endDate: dateRange.end,
        durationMin: durationMin || doctor.appointmentDurationMin
    });

    const ranked = await rankSlotsWithAI(candidates, {
        patientPreferences: patient.preferences,
        doctorPreferences: doctor.preferences
    });

    res.json(ranked.slice(0, 8).map(r => ({
        startISO: r.start.toISOString(),
        endISO: r.end.toISOString(),
        score: r.score,
        reasons: r.reasons
    })));
});

export default router;
