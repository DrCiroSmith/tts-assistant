import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import twilio from 'twilio';
import { handleMediaStream } from '../services/stream';

const VoiceResponse = twilio.twiml.VoiceResponse;

/**
 * Types for Twilio webhook requests
 * @see https://www.twilio.com/docs/voice/twiml/gather#gather-action-parameters
 */
interface TwilioGatherRequest {
    /** The digit(s) pressed by the caller (available after Gather completes) */
    Digits?: string;
    /** The unique identifier for this call */
    CallSid?: string;
    /** The phone number of the caller */
    From?: string;
    /** The phone number being called */
    To?: string;
}

export async function callRoutes(fastify: FastifyInstance) {
    // Handle incoming calls
    fastify.all('/incoming-call', async (request: FastifyRequest, reply: FastifyReply) => {
        const twiml = new VoiceResponse();

        const gather = twiml.gather({
            numDigits: 1,
            action: '/gather-language',
            method: 'POST'
        });

        gather.say('Hello. For English, press 1. Para Español, presione el número 2.');

        // If no input, loop back
        twiml.redirect('/incoming-call');

        reply.type('text/xml').send(twiml.toString());
    });

    // Handle the language selection
    fastify.all('/gather-language', async (request: FastifyRequest<{ Body: TwilioGatherRequest }>, reply: FastifyReply) => {
        const twiml = new VoiceResponse();
        const digits = request.body?.Digits;

        if (digits === '1') {
            twiml.say('Connecting you to the English assistant...');
            const connect = twiml.connect();
            connect.stream({
                url: `wss://${request.headers.host}/media-stream?lang=en`
            });
        } else if (digits === '2') {
            twiml.say('Conectando con el asistente en Español...');
            const connect = twiml.connect();
            connect.stream({
                url: `wss://${request.headers.host}/media-stream?lang=es`
            });
        } else {
            twiml.say('Invalid selection. Please try again.');
            twiml.redirect('/incoming-call');
        }

        reply.type('text/xml').send(twiml.toString());
    });

    // WebSocket route for Media Stream
    fastify.register(async (fastify) => {
        fastify.get('/media-stream', { websocket: true }, (connection, req) => {
            handleMediaStream(connection, req);
        });
    });
}
