import asyncio
import websockets
import json
import base64
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger("test-client")

async def test_call():
    uri = "ws://localhost:8000/media-stream"
    logger.info(f"Connecting to {uri}...")
    
    try:
        async with websockets.connect(uri) as websocket:
            logger.info("Connected to server")

            # 1. Send 'start' event
            start_msg = {
                "event": "start",
                "start": {"streamSid": "test_stream_123", "callSid": "test_call_456"}
            }
            await websocket.send(json.dumps(start_msg))
            logger.info("Sent: start event")
            await asyncio.sleep(0.5)

            # 2. Send 'media' event (simulated audio - silence)
            # 160 bytes of silence (0xFF for u-law)
            silence_chunk = base64.b64encode(b'\xff' * 160).decode('utf-8')
            media_msg_silence = {
                "event": "media",
                "media": {"payload": silence_chunk}
            }
            
            logger.info("Sending 5 chunks of silence...")
            for i in range(5):
                await websocket.send(json.dumps(media_msg_silence))
                await asyncio.sleep(0.02) # 20ms chunks

            # 3. Send 'media' event (simulated audio - loud noise for VAD)
            # Random bytes to simulate noise/speech
            import os
            noise_chunk = base64.b64encode(os.urandom(160)).decode('utf-8')
            media_msg_noise = {
                "event": "media",
                "media": {"payload": noise_chunk}
            }
            
            logger.info("Sending 5 chunks of noise (should trigger VAD)...")
            for i in range(5):
                await websocket.send(json.dumps(media_msg_noise))
                await asyncio.sleep(0.02)

            # 4. Send 'dtmf' event
            dtmf_msg = {
                "event": "dtmf",
                "dtmf": {"digit": "1"}
            }
            await websocket.send(json.dumps(dtmf_msg))
            logger.info("Sent: dtmf 1 (English)")
            await asyncio.sleep(0.5)

            dtmf_msg_2 = {
                "event": "dtmf",
                "dtmf": {"digit": "2"}
            }
            await websocket.send(json.dumps(dtmf_msg_2))
            logger.info("Sent: dtmf 2 (Spanish)")
            await asyncio.sleep(0.5)

            # 5. Send 'stop' event
            stop_msg = {"event": "stop"}
            await websocket.send(json.dumps(stop_msg))
            logger.info("Sent: stop event")

    except Exception as e:
        logger.error(f"Connection failed: {e}")
        logger.info("Make sure the server is running: 'python telephony_server.py'")

if __name__ == "__main__":
    asyncio.run(test_call())
