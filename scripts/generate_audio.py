"""Generate ambient audio loop for portfolio hero using AudioGen.

Produces an 8-second seamless loop matching the hero video duration.
Uses MPS (Apple Silicon) when available, falls back to CPU.
"""
import sys
import numpy as np
import soundfile as sf
import torch

from audiocraft.models import AudioGen

# Use MPS on Apple Silicon, otherwise CPU
device = "mps" if torch.backends.mps.is_available() else "cpu"
print(f"Using device: {device}")

model = AudioGen.get_pretrained("facebook/audiogen-medium")
model.set_generation_params(duration=10)  # Generate 10s, trim to 8s after crossfade

# Prompt matching the Anadol aesthetic + scientific portfolio theme
descriptions = [
    "ambient deep space atmosphere, subtle crystalline resonance, "
    "bioluminescent underwater sounds, soft ethereal drone, "
    "minimal electronic texture, dark cinematic background ambience"
]

print("Generating audio...")
wav = model.generate(descriptions)
audio_np = wav[0].cpu().numpy().squeeze()
sr = model.sample_rate
print(f"Generated {len(audio_np)/sr:.1f}s at {sr}Hz")

# Crossfade the ends for seamless loop (1s overlap)
fade_samples = sr * 1
fade_in = np.linspace(0, 1, fade_samples).astype(np.float32)
fade_out = np.linspace(1, 0, fade_samples).astype(np.float32)

# Blend the tail into the head for seamless looping
audio_np[:fade_samples] = audio_np[:fade_samples] * fade_in + audio_np[-fade_samples:] * fade_out
# Trim to exactly 8 seconds (matching video loop)
target_samples = sr * 8
if len(audio_np) >= target_samples:
    audio_np = audio_np[:target_samples]
else:
    # Pad with silence if shorter (shouldn't happen with 10s generation)
    audio_np = np.pad(audio_np, (0, target_samples - len(audio_np)))

print(f"Final duration: {len(audio_np)/sr:.1f}s")
sf.write("tmp/ambient-loop.wav", audio_np, sr)
print("Saved tmp/ambient-loop.wav")
