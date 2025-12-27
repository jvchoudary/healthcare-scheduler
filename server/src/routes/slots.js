import { Router } from 'express';
import { z } from 'zod';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { getAISlotSuggestions } from '../services/ai.js';
import Appointment from "../models/Appointment.js";

const router = Router();

const SuggestSchema = z.object({
    patientId: z.string(),
    doctorId: z.string(),
    dateRange: z.object({ start: z.string(), end: z.string() }),
    durationMin: z.number().optional()
});

router.post('/slots', async (req, res) => {
    const parsed = SuggestSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const { patientId, doctorId, dateRange, durationMin } = parsed.data;

    let patient = await User.findById(patientId);
    let doctor = await Doctor.findById(doctorId);
    if (!patient || !doctor) {
        doctor = await Doctor.findOne();
        patient = await User.findOne();
    }
    if (!patient || !doctor) return res.status(404).json({ error: 'Patient or doctor not found' });

    const ranked = await getAISlotSuggestions({
        "doctor": JSON.stringify(doctor, function(key, value) {
            if (['_id', '__v', 'createdAt', 'updatedAt', 'name',  'specialty', 'phone', 'email'].includes(key)) return undefined
            return value;
        }),
        "patient": JSON.stringify(patient, function(key, value) {
            if (['_id', '__v', 'createdAt', 'updatedAt', 'name', 'role', 'specialty', 'phone', 'email'].includes(key)) return undefined
            return value;
        }),
        "window": {"start": "2025-12-26", "end": "2026-01-10"},
        "maxSuggestions": 10,
        "clinicHolidays": ["2025-12-31"],
        objective: "Return ranked appointment slots (ISO RFC3339) with start, end, scores and reasons. Penalize conflicts, honor buffers, respect both time zones."
    });

    // Remove conflicts with existing appointments
    const start = new Date(req.body.dateRange.start);
    const end = new Date(req.body.dateRange.end);
    const appts = await Appointment.find({
        doctorId,
        start: { $gte: start },
        end: { $lte: end }
    });

    console.log(appts)

    const filtered = ranked.filter(c => {
        return !appts.some(a => {
            // console.log(new Date(c.start) + ' < ' + a.end + ' && ' + new Date(c.end) + ' > ' + a.start);
            return (new Date(c.start) < a.end && new Date(c.end) > a.start) // overlap
        });
    });

    res.json(filtered.slice(0, 10).map(r => ({
        startISO: r.start,
        endISO: r.end,
        score: r.score,
        reasons: r.reasons
    })));
});

export default router;
