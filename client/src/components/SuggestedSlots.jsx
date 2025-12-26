import React from 'react';
import { getSuggestions, bookAppointment } from '../api.js';

export default function SuggestedSlots({ patientId, doctorId, range }) {
    const [slots, setSlots] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [msg, setMsg] = React.useState('');

    React.useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getSuggestions({ patientId, doctorId, start: range.start, end: range.end });
            setSlots(data);
            setLoading(false);
        })();
    }, [patientId, doctorId, range]);

    async function book(s) {
        const res = await bookAppointment({
            patientId, doctorId, type: 'consult', startISO: s.startISO, endISO: s.endISO
        });
        if (res.status === 'scheduled') setMsg('Appointment booked!');
        else setMsg(res.error || 'Booking failed');
    }

    if (loading) return <p>Loading suggestions…</p>;
    return (
        <div>
            {msg && <p>{msg}</p>}
            {slots.map(s => (
                <div key={s.startISO} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
                    <div><strong>Time:</strong> {new Date(s.startISO).toLocaleString()}</div>
                    <div><strong>Why:</strong> {s.reasons.join('; ') || 'Balanced fit'}</div>
                    <button onClick={() => book(s)}>Book</button>
                </div>
            ))}
            {slots.length === 0 && <p>No slots found in this range.</p>}
        </div>
    );
}