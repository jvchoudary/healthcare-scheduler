import { config } from '../config.js';
import twilio from 'twilio';

const client = (config.twilioSid && config.twilioToken) ? twilio(config.twilioSid, config.twilioToken) : null;

export async function sendSMS(to, body) {
    if (!client) {
        console.log('[SMS MOCK]', { to, body });
        return { status: 'mocked' };
    }
    try {
        return client.messages.create({ to, from: config.twilioFrom, body });
    } catch (e) {
        console.log(`SMS failed to $to`)
        return { status: 'failed'};
    }
}

export async function sendConfirmation(appointment, patient, doctor) {
    const msg = `Confirmed: ${appointment.type} with Dr. ${doctor.name} on ${appointment.start.toLocaleString()}.`;
    if (patient.phone) await sendSMS(patient.phone, msg);
    if (doctor.phone) await sendSMS(doctor.phone, `New appointment with ${patient.name} on ${appointment.start.toLocaleString()}.`);
}