const API = 'https://healthcare-scheduler-t57i.onrender.com/api';

export async function getSuggestions({ patientId, doctorId, start, end }) {
    const res = await fetch(`${API}/slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            patientId,
            doctorId,
            dateRange: { start, end },
            durationMin: 30
        })
    });
    return res.json();
}

export async function bookAppointment({ patientId, doctorId, type, startISO, endISO }) {
    const res = await fetch(`${API}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, doctorId, type, startISO, endISO })
    });
    return res.json();
}

export async function healthcheck() {
    const res = await fetch(`${API}/health`, {
        method: 'GET'
    });
    return res.json();
}