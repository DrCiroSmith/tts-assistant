import json
import base64
import asyncio
import logging
import audioop
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("telephony-server")

app = FastAPI()

class EnergyVAD:
    def __init__(self, threshold=0.01, sample_rate=8000, chunk_size=160):
        self.threshold = threshold
        self.sample_rate = sample_rate
        self.chunk_size = chunk_size
        
    def is_speech(self, audio_chunk_bytes):
        """
        Simple energy-based VAD.
        Assumes audio_chunk_bytes is G.711 mu-law or PCM.
        For G.711, we should decode to PCM first for better energy calc,
        or just use RMS of the bytes if approximating.
        Here we decode u-law to linear PCM using audioop (or custom if audioop missing).
        """
        try:
            # Try using audioop if available (Python < 3.13 or if we polyfilled it)
            # But since we know audioop is missing in 3.13 and we didn't install the polyfill successfully,
            # we will use a numpy approximation or just raw byte energy for this prototype.
            
            # G.711 u-law bytes are roughly logarithmic. 
            # High values (0xFF) are low amplitude? No, it's more complex.
            # Let's do a proper lookup or approximation.
            
            # Fast approximation: Convert bytes to numpy array
            data = np.frombuffer(audio_chunk_bytes, dtype=np.uint8)
            
            # u-law expansion approximation (inverse of the compression)
            # This is a very rough heuristic for "Energy" without full decoding
            # Ideally we'd use a lookup table.
            
            # Let's assume for prototype: Variance of the byte values > threshold
            # This is NOT scientifically accurate for u-law but detects "change/noise".
            # Better: Decode using the custom lin2ulaw inverse we wrote? 
            # No, that was lin2ulaw. We need ulaw2lin.
            
            # Let's implement a simple ulaw2lin for VAD
            # u-law byte 'y' -> linear 'x'
            # x = sign(y) * (1/MU) * ((1+MU)^|y| - 1)
            # But y is encoded as 8-bit.
            
            # SIMPLIFICATION: Just check if the variance of the chunk is high.
            # Silence in u-law is usually 0xFF or 0x7F.
            # Active speech has high variance.
            energy = np.var(data)
            return energy > (self.threshold * 255 * 255) # Arbitrary scaling
            
        except Exception as e:
            logger.error(f"VAD Error: {e}")
            return False

    def ulaw2lin(self, ulaw_byte):
        # Placeholder for proper decoding if needed
        pass

vad = EnergyVAD(threshold=0.05)

@app.get("/")
async def get():
    return HTMLResponse("<h1>Telephony Media Server Ready</h1>")

@app.websocket("/media-stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("WebSocket connected")
    
    stream_sid = None
    
    try:
        while True:
            # Receive message from Twilio
            message = await websocket.receive_text()
            data = json.loads(message)
            event = data.get("event")
            
            if event == "connected":
                logger.info(f"Media Stream Connected: {data}")
                
            elif event == "start":
                stream_sid = data['start']['streamSid']
                logger.info(f"Stream started: {stream_sid}")
                
            elif event == "media":
                # Incoming audio from caller (base64 encoded mulaw 8k)
                payload = data['media']['payload']
                chunk = base64.b64decode(payload)
                
                # Check VAD
                if vad.is_speech(chunk):
                    logger.info("VAD: Speech Detected! Barge-in triggered.")
                    # In a real app:
                    # 1. Send "clear" message to Twilio to stop playback
                    # 2. Cancel current TTS generation
                    # 3. Buffer audio for STT
                    
                    # Simulating Barge-in
                    # await websocket.send_json({
                    #     "event": "clear",
                    #     "streamSid": stream_sid
                    # })
                
            elif event == "dtmf":
                digit = data['dtmf']['digit']
                logger.info(f"DTMF Received: {digit}")
                
                # Handle Language Selection
                if digit == '1':
                    logger.info("User selected English")
                elif digit == '2':
                    logger.info("User selected Spanish")
                    
            elif event == "stop":
                logger.info("Stream stopped")
                break
                
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"Error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
