import base64
import numpy as np
import scipy.signal

# Mock configuration
INPUT_RATE = 24000
OUTPUT_RATE = 8000

def mock_tts_generate(text: str):
    """
    Simulates TTS generation. Returns a numpy array of float32 audio.
    In reality, this would yield chunks from the TTS engine.
    """
    print(f"Generating audio for: {text}")
    # Generate 1 second of silence/noise as mock
    duration = 1.0
    t = np.linspace(0, duration, int(INPUT_RATE * duration), endpoint=False)
    # Simple sine wave 440Hz
    audio = 0.5 * np.sin(2 * np.pi * 440 * t)
    return audio.astype(np.float32)

def lin2ulaw(pcm_data):
    """
    Convert 16-bit PCM data to G.711 u-law using numpy.
    This is an approximation of the G.711 standard.
    """
    samples = np.frombuffer(pcm_data, dtype=np.int16)
    MU = 255
    
    # Normalize to -1.0 to 1.0
    x = samples / 32768.0
    
    # Compand
    sign = np.sign(x)
    abs_x = np.abs(x)
    magnitude = np.log(1 + MU * abs_x) / np.log(1 + MU)
    y = sign * magnitude
    
    # Quantize to 8-bit (0-255)
    # Note: Real G.711 involves bit inversion and specific mapping.
    # This is a simplified version for prototyping.
    encoded = ((y + 1) / 2 * 255).astype(np.uint8)
    return encoded.tobytes()

def process_audio_chunk(chunk_float32: np.ndarray):
    """
    Resamples and encodes audio chunk for telephony.
    """
    # 1. Resample 24k -> 8k
    # Calculate number of samples in output
    num_samples = int(len(chunk_float32) * OUTPUT_RATE / INPUT_RATE)
    chunk_8k = scipy.signal.resample(chunk_float32, num_samples)
    
    # 2. Convert Float32 (-1.0 to 1.0) to Int16
    chunk_int16 = (chunk_8k * 32767).astype(np.int16)
    
    # 3. Encode to G.711 u-law
    ulaw_bytes = lin2ulaw(chunk_int16.tobytes())
    
    # 4. Base64 encode for Twilio
    b64_payload = base64.b64encode(ulaw_bytes).decode('utf-8')
    
    return b64_payload

if __name__ == "__main__":
    # Test the pipeline
    text = "Hello, this is a test."
    raw_audio = mock_tts_generate(text)
    payload = process_audio_chunk(raw_audio)
    
    print(f"Original samples: {len(raw_audio)}")
    print(f"Encoded payload length: {len(payload)}")
    print(f"Sample payload: {payload[:50]}...")
