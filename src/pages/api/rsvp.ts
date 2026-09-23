export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const scriptId = import.meta.env.GOOGLE_SCRIPT_ID;

        if (!scriptId) {
            return new Response(JSON.stringify({ error: 'Configuración del servidor incompleta' }), {
                status: 500
            });
        }

        const googleUrl = `https://script.google.com/macros/s/${scriptId}/exec`;
        const googleResponse = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(body)
        });
        const textData = await googleResponse.text();

        return new Response(JSON.stringify({ success: googleResponse.ok, data: textData }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500
        });
    }
}
