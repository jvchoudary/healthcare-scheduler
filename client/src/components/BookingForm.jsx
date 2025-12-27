import React from 'react';
import SuggestedSlots from './SuggestedSlots.jsx';

export default function BookingForm() {
    // Seed IDs assumed from backend seed
    const [patientId] = React.useState('694e8122fdea49de3671a02a'); // placeholder
    const [doctorId] = React.useState('694e8122fdea49de3671a027');   // placeholder
    const [start, setStart] = React.useState(new Date().toISOString());
    const [end, setEnd] = React.useState(new Date(Date.now() + 7*24*60*60*1000).toISOString());

    // In a real app, fetch actual IDs from the API
    return (
        <div>
            <h2>Book an appointment</h2>
            <label>
                Start:
                <input type="datetime-local"
                       value={new Date(start).toISOString().slice(0,16)}
                       onChange={e => setStart(new Date(e.target.value).toISOString())}/>
            </label>
            <label style={{ marginLeft: 12 }}>
                End:
                <input type="datetime-local"
                       value={new Date(end).toISOString().slice(0,16)}
                       onChange={e => setEnd(new Date(e.target.value).toISOString())}/>
            </label>

            <p style={{ color: '#666' }}>Showing suggestions for Dr. Asha Kumar & Ravi Singh (seed data).</p>
            <SuggestedSlots patientId={patientId} doctorId={doctorId} range={{ start, end }} />
        </div>
    );
}