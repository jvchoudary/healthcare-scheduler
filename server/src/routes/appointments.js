import { Router } from 'express';
import { z } from 'zod';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { sendConfirmation } from '../services/notify.js';

const router = Router();

const CreateSchema = z.object({
    patientId: z.string(),
    doctorId: z.string(),
    type: z.enum(['consult', 'followup', 'telehealth']).default('consult'),
    startISO: z.string(),
    endISO: z.string()
});

router.post('/appointments', async (req, res) => {
    const parsed = CreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const { patientId, doctorId, type, startISO, endISO } = parsed.data;

    let patient = await User.findById(patientId);
    let doctor = await Doctor.findById(doctorId);
    if (!patient || !doctor) {
        doctor = await Doctor.findOne();
        patient = await User.findOne();
    }
    if (!doctor || !patient) return res.status(404).json({ error: 'Patient or doctor not found' });

    const start = new Date(startISO);
    const end = new Date(endISO);

    // Conflict check
    const conflict = await Appointment.findOne({
        doctorId,
        $or: [
            { start: { $lt: end }, end: { $gt: start } }
        ],
        status: 'scheduled'
    });
    if (conflict) return res.status(409).json({ error: 'Time conflict' });

    const appt = await Appointment.create({
        patientId, doctorId, type, start, end, status: 'scheduled'
    });

    await sendConfirmation(appt, patient, doctor);

    res.json({ id: appt._id, status: appt.status });
});

router.delete('/:id', async (req, res) => {
    const appt = await Appointment.findById(req.params.id).populate('patientId doctorId');
    if (!appt) return res.status(404).json({ error: 'Not found' });
    appt.status = 'canceled';
    await appt.save();
    res.json({ id: appt._id, status: appt.status });
});

export default router;