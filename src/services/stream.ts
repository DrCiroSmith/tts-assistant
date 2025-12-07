import WebSocket from 'ws';
import { FastifyRequest } from 'fastify';
import { SYSTEM_PROMPT_ENGLISH, SYSTEM_PROMPT_SPANISH } from '../prompts';
import { saveLead } from './excelService';

// OpenAI Realtime API configuration
const OPENAI_WS_URL = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';

export function handleMediaStream(connection: WebSocket, req: FastifyRequest) {
    console.log('Client connected to media stream');

    const openAiWs = new WebSocket(OPENAI_WS_URL, {
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "realtime=v1",
        },
    });

    let streamSid: string | null = null;

    // Determine language and prompt
    let systemPrompt = SYSTEM_PROMPT_ENGLISH;
    const query = req.query as { lang?: string };
    if (query.lang === 'es') {
        systemPrompt = SYSTEM_PROMPT_SPANISH;
        console.log('Using Spanish prompt');
    } else {
        console.log('Using English prompt');
    }

    openAiWs.on('open', () => {
        console.log('Connected to OpenAI Realtime API');

        // Initialize the session
        const sessionUpdate = {
            type: 'session.update',
            session: {
                turn_detection: { type: 'server_vad' },
                input_audio_format: 'g711_ulaw',
                output_audio_format: 'g711_ulaw',
                voice: 'alloy',
                instructions: systemPrompt,
                modalities: ["text", "audio"],
                temperature: 0.8,
                tools: [{
                    type: "function",
                    name: "save_lead",
                    description: "Save the lead's information when they provide it.",
                    parameters: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            phone: { type: "string", description: "The lead's phone number if provided, otherwise leave blank" },
                            interest: { type: "string", description: "Buying, renting, or investment" },
                            budget: { type: "string" },
                            language: { type: "string" }
                        },
                        required: ["name", "interest", "budget", "language"]
                    }
                }]
            },
        };
        openAiWs.send(JSON.stringify(sessionUpdate));
    });

    openAiWs.on('message', async (data: WebSocket.Data) => {
        try {
            const response = JSON.parse(data.toString());

            if (response.type === 'session.updated') {
                console.log('Session updated:', response);
            }

            if (response.type === 'response.audio.delta' && response.delta) {
                if (streamSid) {
                    const audioDelta = {
                        event: 'media',
                        streamSid: streamSid,
                        media: {
                            payload: response.delta,
                        },
                    };
                    connection.send(JSON.stringify(audioDelta));
                }
            }

            // Handle function calls
            if (response.type === 'response.function_call_arguments.done') {
                const functionName = response.name;
                const args = JSON.parse(response.arguments);

                if (functionName === 'save_lead') {
                    console.log('Calling tool: save_lead', args);
                    await saveLead(args);

                    // Send output back to OpenAI
                    const functionOutput = {
                        type: 'conversation.item.create',
                        item: {
                            type: 'function_call_output',
                            call_id: response.call_id,
                            output: JSON.stringify({ success: true }),
                        }
                    };
                    openAiWs.send(JSON.stringify(functionOutput));

                    // Trigger response
                    openAiWs.send(JSON.stringify({ type: 'response.create' }));
                }
            }

        } catch (e) {
            console.error('Error parsing OpenAI message:', e);
        }
    });

    connection.on('message', (message: WebSocket.Data) => {
        try {
            const data = JSON.parse(message.toString());

            if (data.event === 'start') {
                streamSid = data.start.streamSid;
                console.log('Stream started:', streamSid);
            } else if (data.event === 'media') {
                if (openAiWs.readyState === WebSocket.OPEN) {
                    const audioAppend = {
                        type: 'input_audio_buffer.append',
                        audio: data.media.payload,
                    };
                    openAiWs.send(JSON.stringify(audioAppend));
                }
            } else if (data.event === 'stop') {
                console.log('Stream stopped');
                openAiWs.close();
            }
        } catch (e) {
            console.error('Error parsing Twilio message:', e);
        }
    });

    connection.on('close', () => {
        if (openAiWs.readyState === WebSocket.OPEN) {
            openAiWs.close();
        }
        console.log('Client disconnected');
    });
}
