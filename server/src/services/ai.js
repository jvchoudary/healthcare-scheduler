// Mock AI ranking (replace with real Claude call in production)
export async function rankSlotsWithAI(candidates, { patientPreferences, doctorPreferences }) {
    // Simple scoring: mornings preferred, spread across days, match patient preferred days
    const scored = candidates.map(c => {
        let score = 0;
        if (doctorPreferences?.prefersMornings && c.features.isMorning) score += 2;
        if (patientPreferences?.days?.includes(c.start.getDay())) score += 2;
        if (patientPreferences?.timeRanges?.length) {
            const hhmm = `${String(c.start.getHours()).padStart(2, '0')}:${String(c.start.getMinutes()).padStart(2, '0')}`;
            const matches = patientPreferences.timeRanges.some(tr => hhmm >= tr.start && hhmm <= tr.end);
            if (matches) score += 2;
        }
        // Light penalty for evening
        if (c.features.isEvening) score -= 1;

        return { ...c, score, reasons: [
                doctorPreferences?.prefersMornings && c.features.isMorning ? 'Doctor prefers mornings' : null,
                patientPreferences?.days?.includes(c.start.getDay()) ? 'Matches patient preferred days' : null
            ].filter(Boolean) };
    });

    return scored.sort((a, b) => b.score - a.score);
}