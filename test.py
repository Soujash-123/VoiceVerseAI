import requests
import json
import os

# Your ElevenLabs API key
api_key = "sk_87e27a9d8db15afb2de6a144ade3eed6d8d00bb633b5f605"

# Output directory
output_dir = "voice_samples"
os.makedirs(output_dir, exist_ok=True)

# API endpoint with legacy voices included
url = "https://api.elevenlabs.io/v1/voices?show_legacy=true"

# Headers
headers = {
    "xi-api-key": api_key
}

# Get all voices
response = requests.get(url, headers=headers)
if response.status_code != 200:
    raise Exception(f"Failed to get voices: {response.text}")

voices = response.json()["voices"]

# Prepare final dictionary
voice_data = {}

# Generate audio samples
for voice in voices:
    name = voice["name"]
    voice_id = voice["voice_id"]
    category = voice.get("category", "unknown")

    text = f"Hi, I am {name}!"
    print(f"🎤 Generating sample for: {name}")

    # Text-to-speech generation
    tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream"
    tts_headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json"
    }
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.5,
            "use_speaker_boost": True
        }
    }

    tts_response = requests.post(tts_url, headers=tts_headers, json=payload, stream=True)
    if tts_response.status_code != 200:
        print(f"⚠️ Failed to generate for {name}: {tts_response.text}")
        continue

    # Save MP3 sample
    filename = os.path.join(output_dir, f"{name}.mp3")
    with open(filename, "wb") as f:
        for chunk in tts_response.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)

    # Add to dictionary
    voice_data[name] = {
        "voice_id": voice_id,
        "category": category,
        "sample_path": filename
    }

# Save all metadata
with open("voices.json", "w") as f:
    json.dump(voice_data, f, indent=4)

print("✅ All voices and samples saved.")
