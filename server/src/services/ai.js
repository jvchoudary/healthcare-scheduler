import axios from 'axios';
import { config } from '../config.js';

export async function getAISlotSuggestions(payload) {
    console.log(payload);
    // return [];
    const response = await axios.post(config.claude_apiUrl, {
        model: config.claude_model,
        max_tokens: 2048,
        temperature: 0.2,
        system: 'You optimize healthcare appointment slots with constraints and send response as json array.',
        messages: [
            { role: 'user', content: JSON.stringify(payload) }
        ]
    }, {
        headers: {
            'anthropic-version': '2023-06-01',
            'x-api-key': config.claude_apiKey,
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    });

    // console.log(response.data)
    const text = response.data?.content?.[0]?.text ?? '{}';
    const parsed = safeJson(text);
    return (parsed || []).sort((a, b) => b.score - a.score);
}

function safeJson(s) {
    const jsonMatch = s.match(/```json([\s\S]*?)```/);
    try {
        // console.log(jsonMatch);
        return JSON.parse(jsonMatch[1].trim());
    } catch (e) {
        console.log(e)
        return {};
    }
}