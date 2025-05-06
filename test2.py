import requests

# Replace with your actual ElevenLabs API key
API_KEY = "sk_dd8dcf37565a6ebf491c8f9cdc96249ce69b07f0aa548e58"

def check_credits(api_key):
    url = "https://api.elevenlabs.io/v1/user/subscription"
    headers = {
        "xi-api-key": api_key
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        print("🔹 Plan: ", data.get("tier"))
        print("🔹 Character Limit: ", data.get("character_limit"))
        print("🔹 Characters Used This Month: ", data.get("character_count"))
        print("🔹 Characters Remaining: ", data.get("character_limit") - data.get("character_count"))
    else:
        print("❌ Failed to fetch credits. Status code:", response.status_code)
        print("Response:", response.text)

# Call the function
check_credits(API_KEY)
