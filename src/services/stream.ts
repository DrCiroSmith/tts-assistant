import WebSocket from 'ws';
import { FastifyRequest } from 'fastify';
import { SYSTEM_PROMPT_ENGLISH, SYSTEM_PROMPT_SPANISH } from '../prompts';
import { saveLead, LeadData } from './excelService';

// OpenAI Realtime API configuration
const OPENAI_WS_URL = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';

// Reconnection settings
const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY_MS = 1000;

interface StreamQueryParams {
    lang?: string;
}

interface MediaMessage {
    event: string;
    start?: {
        streamSid: string;
        callSid?: string;
    };
    media?: {
        payload: string;
    };
}

interface OpenAIResponse {
    type: string;
    delta?: string;
    name?: string;
    arguments?: string;
    call_id?: string;
    error?: {
        message: string;
        code?: string;
    };
}

export function handleMediaStream(connection: WebSocket, req: FastifyRequest) {
    console.log('Client connected to media stream');

    let streamSid: string | null = null;
    let openAiWs: WebSocket | null = null;
    let isClosing = false;
    let reconnectAttempts = 0;

    // Determine language and prompt
    const query = req.query as StreamQueryParams;
    const systemPrompt = query.lang === 'es' ? SYSTEM_PROMPT_SPANISH : SYSTEM_PROMPT_ENGLISH;
    console.log(`Using ${query.lang === 'es' ? 'Spanish' : 'English'} prompt`);

    function connectToOpenAI() {
        if (isClosing) return;

        openAiWs = new WebSocket(OPENAI_WS_URL, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "OpenAI-Beta": "realtime=v1",
            },
        });

        openAiWs.on('open', () => {
            console.log('Connected to OpenAI Realtime API');
            reconnectAttempts = 0; // Reset on successful connection

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
            openAiWs?.send(JSON.stringify(sessionUpdate));
        });

        openAiWs.on('message', async (data: WebSocket.Data) => {
            try {
                const response: OpenAIResponse = JSON.parse(data.toString());

                if (response.type === 'session.updated') {
                    console.log('Session updated successfully');
                }

                if (response.type === 'error') {
                    console.error('OpenAI error:', response.error?.message);
                    return;
                }

                if (response.type === 'response.audio.delta' && response.delta) {
                    if (streamSid && connection.readyState === WebSocket.OPEN) {
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
                    
                    if (functionName === 'save_lead' && response.arguments) {
                        try {
                            const args = JSON.parse(response.arguments) as LeadData;
                            console.log('Calling tool: save_lead', args);
                            await saveLead(args);

                            // Send output back to OpenAI
                            if (openAiWs?.readyState === WebSocket.OPEN) {
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
                        } catch (parseError) {
                            console.error('Error parsing function arguments:', parseError);
                        }
                    }
                }

            } catch (e) {
                console.error('Error parsing OpenAI message:', e);
            }
        });

        openAiWs.on('error', (error) => {
            console.error('OpenAI WebSocket error:', error);
        });

        openAiWs.on('close', (code, reason) => {
            console.log(`OpenAI WebSocket closed: ${code} - ${reason.toString()}`);
            
            // Attempt reconnection if not intentionally closing
            if (!isClosing && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                reconnectAttempts++;
                console.log(`Attempting to reconnect to OpenAI (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
                setTimeout(connectToOpenAI, RECONNECT_DELAY_MS * reconnectAttempts);
            }
        });
    }

    // Initial connection to OpenAI
    connectToOpenAI();

    connection.on('message', (message: WebSocket.Data) => {
        try {
            const data: MediaMessage = JSON.parse(message.toString());

            if (data.event === 'start') {
                streamSid = data.start?.streamSid ?? null;
                console.log('Stream started:', streamSid);
            } else if (data.event === 'media') {
                if (openAiWs?.readyState === WebSocket.OPEN && data.media?.payload) {
                    const audioAppend = {
                        type: 'input_audio_buffer.append',
                        audio: data.media.payload,
                    };
                    openAiWs.send(JSON.stringify(audioAppend));
                }
            } else if (data.event === 'stop') {
                console.log('Stream stopped');
                cleanup();
            }
        } catch (e) {
            console.error('Error parsing Twilio message:', e);
        }
    });

    connection.on('close', () => {
        console.log('Client disconnected');
        cleanup();
    });

    connection.on('error', (error) => {
        console.error('Client WebSocket error:', error);
        cleanup();
    });

    function cleanup() {
        if (isClosing) return;
        isClosing = true;

        if (openAiWs) {
            if (openAiWs.readyState === WebSocket.OPEN) {
                openAiWs.close();
            }
            openAiWs = null;
        }

        streamSid = null;
        console.log('Cleaned up resources');
    }
}
