import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

function toDate(dateStr, timeStr, tz = 'Asia/Kolkata') {
    // Simplified: interpret times in local tz
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date(dateStr);
    d.setHours(h, m, 0, 0);
    return d;
}

export async function generateCandidates({ doctorId, startDate, endDate, durationMin }) {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new Error('Doctor not found');
    const duration = durationMin || doctor.appointmentDurationMin;
    const bufferMin = doctor.bufferMin;

    const candidates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        const rule = doctor.availabilityRules.find(r => r.day === day);
        if (!rule) continue;

        for (const tr of rule.timeRanges) {
            const slotStart = new Date(d); slotStart.setHours(...tr.start.split(':').map(Number), 0, 0);
            const slotEnd = new Date(d); slotEnd.setHours(...tr.end.split(':').map(Number), 0, 0);

            let cursor = new Date(slotStart);
            while (cursor.getTime() + duration * 60000 <= slotEnd.getTime()) {
                const s = new Date(cursor);
                const e = new Date(cursor.getTime() + duration * 60000);
                candidates.push({ start: s, end: e, features: {
                        isMorning: s.getHours() < 12,
                        isAfternoon: s.getHours() >= 12 && s.getHours() < 17,
                        isEvening: s.getHours() >= 17
                    }});
                cursor = new Date(cursor.getTime() + (duration + bufferMin) * 60000);
            }
        }
    }

    // Remove conflicts with existing appointments
    const appts = await Appointment.find({
        doctorId,
        start: { $gte: start },
        end: { $lte: end }
    });

    const filtered = candidates.filter(c => {
        return !appts.some(a =>
            (c.start < a.end && c.end > a.start) // overlap
        );
    });

    return filtered;
}