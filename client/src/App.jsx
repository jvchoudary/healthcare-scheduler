import React from 'react';
import { createRoot } from 'react-dom/client';
import BookingForm from './components/BookingForm.jsx';
import {healthcheck} from "./api";

function App() {
    React.useEffect(() => {
        const data = healthcheck();
        console.log(data);
    }, []);

    return (
        <div style={{ maxWidth: 640, margin: '40px auto', fontFamily: 'system-ui, Arial' }}>
            <h1>Healthcare Scheduler</h1>
            <BookingForm />
        </div>
    );
}

createRoot(document.getElementById('root')).render(<App />);