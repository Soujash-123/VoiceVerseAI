from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from google import genai
import uuid
from elevenlabs import ElevenLabs
import os
import tempfile
import traceback
import re
import json
from dotenv import load_dotenv
import os

#os.cwd("./backend")
app = Flask(__name__)
CORS(app)

# Configure API keys
GEMINI_API_KEY = "AIzaSyBFFMPRr2y3woemAzEvmTPLWEaHgPaNoD0"
ELEVENLABS_API_KEY = "sk_dd8dcf37565a6ebf491c8f9cdc96249ce69b07f0aa548e58"

# Configure Gemini
client = genai.Client(api_key=GEMINI_API_KEY)

# Configure ElevenLabs
elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

# Load voices from JSON
with open('voices.json', 'r') as f:
    voices = json.load(f)

# Default voices (using names from voices.json)
DEFAULT_HOST_VOICE = "Adam"
DEFAULT_GUEST_VOICE = "Alice"

def get_voice_id(voice_name):
    return voices.get(voice_name, {}).get('voice_id')

def clean_script_text(script_text):
    # Remove markdown code block markers
    script_text = re.sub(r'```python\n?', '', script_text)
    script_text = re.sub(r'```\n?', '', script_text)
    
    # Remove any leading/trailing whitespace
    script_text = script_text.strip()
    
    # If the script starts with 'script = ', remove it
    if script_text.startswith('script = '):
        script_text = script_text[9:]
    
    return script_text

def generate_speech(text, voice_id):
    try:
        audio_stream =  elevenlabs_client.text_to_speech.convert(
    text=text,
    voice_id=voice_id,
    model_id="eleven_flash_v2_5",        # Corrected model ID
    output_format="mp3_44100_128",       # Keep original quality
    voice_settings={
        "stability": 0.3,
        "similarity_boost": 0.6,
        "style": 0.1,
        "use_speaker_boost": False       # Turning off to reduce token usage
    }
)



        return audio_stream
    except Exception as e:
        print(f"Error in generate_speech: {str(e)}")
        print(traceback.format_exc())
        raise

@app.route('/get-voices', methods=['GET'])
def get_voices():
    try:
        # Return voice names, IDs, and sample paths
        voice_list = {name: {
            'voice_id': data['voice_id'],
            'sample_path': data['sample_path']
        } for name, data in voices.items()}
        return jsonify(voice_list)
    except Exception as e:
        print(f"Error getting voices: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/voice-sample/<path:filename>')
def get_voice_sample(filename):
    try:
        return send_file(f'voice_samples/{filename}', mimetype='audio/mp3')
    except Exception as e:
        print(f"Error serving voice sample: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/generate-script', methods=['POST'])
def generate_script():
    try:
        data = request.json
        prompt = data.get('prompt')
        num_guests = data.get('numGuests', 1)
        host_voice = data.get('hostVoice', DEFAULT_HOST_VOICE)
        guest_voices = data.get('guestVoices', [DEFAULT_GUEST_VOICE])
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        # Ensure we have enough guest voices
        while len(guest_voices) < num_guests:
            guest_voices.append(DEFAULT_GUEST_VOICE)
        
        # Generate script using Gemini with specific instructions
        system_prompt = f"""Generate a short podcast conversation between one host and {num_guests} guest(s). 
        The topic is: {prompt}
        
        CRITICAL INSTRUCTION: You must use ONLY these exact voice names for the speakers:
        - Host: "{host_voice}"
        - Guest 1: "{guest_voices[0]}"
        {f'- Guest 2: "{guest_voices[1]}"' if num_guests > 1 else ''}
        {f'- Guest 3: "{guest_voices[2]}"' if num_guests > 2 else ''}
        
        DO NOT use any other names. DO NOT make up new names. DO NOT use generic terms like "Host" or "Guest".
        
        Please output the script as a Python list of tuples in the following format:
        script = [  
            ("{host_voice}", "Welcome to the show!"),  
            ("{guest_voices[0]}", "Thanks! Happy to be here."),  
            {f'("{guest_voices[1]}", "Great to be here too!"),  # Second guest' if num_guests > 1 else ''}
            {f'("{guest_voices[2]}", "Excited to join the discussion!"),  # Third guest' if num_guests > 2 else ''}
            ...  
        ]  
        
        Keep the conversation realistic and friendly. Make sure the lines are conversational and short (1–2 sentences per line). 
        Include natural pauses like ellipses (...) where appropriate. Do not add any sound effects or extra metadata.
        Keep the total conversation to about 2-3 minutes.
        
        REMEMBER: Use ONLY the exact voice names provided above for each speaker."""
        
        # Print the prompt before sending to Gemini
        print("\n=== Sending prompt to Gemini ===")
        print(system_prompt)
        print("===============================\n")
        
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[system_prompt]
        )
        script = response.text
        cleaned_script = clean_script_text(script)
        return jsonify({'script': cleaned_script})
    
    except Exception as e:
        print(f"Error in generate_script: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/create-podcast', methods=['POST'])
def create_podcast():
    try:
        data = request.json
        script_text = data.get('script')
        host_voice = data.get('hostVoice', DEFAULT_HOST_VOICE)
        guest_voices = data.get('guestVoices', [DEFAULT_GUEST_VOICE])
        
        if not script_text:
            return jsonify({'error': 'Script is required'}), 400
        
        print(f"Received script: {script_text}")
        
        # Clean the script text
        cleaned_script = clean_script_text(script_text)
        print(f"Cleaned script: {cleaned_script}")
        
        # Parse the script from the string representation
        try:
            script = eval(cleaned_script)
            print(f"Parsed script: {script}")
        except Exception as e:
            print(f"Error parsing script: {str(e)}")
            print(traceback.format_exc())
            return jsonify({'error': f'Error parsing script: {str(e)}'}), 500
        
        # Calculate character count per speaker
        character_counts = {}
        for speaker, line in script:
            if speaker not in character_counts:
                character_counts[speaker] = 0
            character_counts[speaker] += len(line)
        
        # Get voice IDs
        host_voice_id = get_voice_id(host_voice)
        guest_voice_ids = [get_voice_id(voice) for voice in guest_voices]
        
        if not host_voice_id or not all(guest_voice_ids):
            return jsonify({'error': 'Invalid voice selection'}), 400
        
        # Create a temporary directory to store audio files
        with tempfile.TemporaryDirectory() as temp_dir:
            podcast_audio = []
            
            # Generate audio for each line
            for i, (speaker, line) in enumerate(script):
                try:
                    print(f"Processing line {i}: {speaker} - {line}")
                    
                    # Get voice ID directly from speaker name
                    voice_id = get_voice_id(speaker)
                    if not voice_id:
                        return jsonify({'error': f'Invalid speaker name: {speaker}'}), 400
                    
                    audio_stream = generate_speech(line, voice_id)
                    audio_data = b''.join(audio_stream)
                    podcast_audio.append(audio_data)
                    print(f"Successfully generated audio for line {i}")
                except Exception as e:
                    print(f"Error processing line {i}: {str(e)}")
                    print(traceback.format_exc())
                    return jsonify({'error': f'Error processing line {i}: {str(e)}'}), 500
            
            # Save the combined audio
            filename = f"podcast_{uuid.uuid4()}.mp3"
            filepath = os.path.join(temp_dir, filename)
            
            try:
                with open(filepath, "wb") as f:
                    for chunk in podcast_audio:
                        f.write(chunk)
                print(f"Successfully saved audio file: {filepath}")
            except Exception as e:
                print(f"Error saving audio file: {str(e)}")
                print(traceback.format_exc())
                return jsonify({'error': f'Error saving audio file: {str(e)}'}), 500
            
            # Add character count to response headers
            response = send_file(filepath, mimetype='audio/mp3')
            response.headers['X-Character-Counts'] = json.dumps(character_counts)
            return response
    
    except Exception as e:
        print(f"Error in create_podcast: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 