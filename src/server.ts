import Fastify from 'fastify';
import formBody from '@fastify/formbody';
import websocket from '@fastify/websocket';
import dotenv from 'dotenv';
import { callRoutes } from './routes/call';

dotenv.config();

const server = Fastify({
    logger: true
});

server.register(formBody);
server.register(websocket);

server.register(callRoutes);

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await server.listen({ port: Number(PORT), host: '0.0.0.0' });
        console.log(`Server running on port ${PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
