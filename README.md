# AI Podcast Generator

A web application that generates podcast scripts using Gemini AI and converts them to audio using Deepgram.

## Features

- ChatGPT-like interface for entering podcast topics
- AI-generated podcast scripts using Gemini
- Text-to-speech conversion using Deepgram
- Modern React frontend with Material-UI
- Flask backend with RESTful API

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter your podcast topic in the text field
3. Click "Generate Script" to create a podcast script
4. Review the generated script
5. Click "Create Podcast" to convert the script to audio
6. Play the generated podcast using the audio player

## API Keys

The application uses the following API keys:
- Gemini API Key: Already configured in the backend
- Deepgram API Key: Already configured in the backend

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - Axios

- Backend:
  - Flask
  - Google Generative AI (Gemini)
  - Deepgram
  - Flask-CORS 