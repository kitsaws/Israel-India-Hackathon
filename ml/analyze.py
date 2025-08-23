import time
import json
import pickle
import requests
import pandas as pd
from flask import Flask, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import eventlet

# This is required for flask_socketio to work correctly in a background thread
eventlet.monkey_patch()

# --- 1. Initialize Flask App and SocketIO ---
app = Flask(__name__)
# MODIFIED: Added 'supports_credentials=True' to handle the specific CORS error.
CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")

# --- 2. Global Variables ---
# In-memory "database" to store the latest vitals data.
# This is accessible by both the background thread and the Flask routes.
latest_vitals_data = {
    "status": "Initializing",
    "recommendation": "Waiting for data from ESP32..."
}
model = None # Global variable to hold the loaded model

# --- 3. Data Processing and Prediction Logic ---
def process_vitals(raw_json):
    """
    Processes raw JSON from ESP32 into a model-ready format.
    """
    try:
        systolic, diastolic = map(int, raw_json['bloodPressure'].split('/'))
        return {
            'systolic_bp': systolic,
            'diastolic_bp': diastolic,
            'heart_rate': raw_json['heartRate'],
            'oxygen_saturation': raw_json['oxygenLevel']
        }
    except (KeyError, ValueError, AttributeError, TypeError):
        return None

def predict_recommendation(patient_vitals):
    """
    Uses the loaded model to predict a clinical recommendation.
    """
    if not model:
        return "Model not loaded."
    try:
        input_df = pd.DataFrame([patient_vitals])
        feature_order = ['systolic_bp', 'diastolic_bp', 'heart_rate', 'oxygen_saturation']
        input_df = input_df[feature_order]
        prediction = model.predict(input_df)
        return prediction[0]
    except Exception as e:
        return f"Prediction Error: {e}"

# --- 4. Background Task for Fetching and Predicting ---
def background_fetcher():
    """
    This function runs in a background thread, continuously fetching data
    from the ESP32, making predictions, and pushing updates.
    """
    global latest_vitals_data
    print("Background fetcher started.")
    
    while True:
        try:
            # Fetch live data from the ESP32 server
            response = requests.get('http://192.168.4.1/vitals', timeout=5)
            response.raise_for_status()
            live_data = response.json()
            status = "Success"
        except requests.exceptions.RequestException:
            live_data = None
            status = "Error"

        # Process the vitals and get a recommendation
        model_features = process_vitals(live_data)
        
        if model_features:
            recommendation = predict_recommendation(model_features)
        else:
            recommendation = "Could not process vitals. Check ESP32 connection and data format."

        # Update the global data store
        latest_vitals_data = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "inputVitals": live_data,
            "status": status,
            "recommendation": recommendation
        }
        
        # Push the new data to all connected WebSocket clients
        socketio.emit('vitals_update', latest_vitals_data)
        
        # Print the vitals and the recommendation as requested.
        print(f"Vitals: {latest_vitals_data['inputVitals']} -> Recommendation: {latest_vitals_data['recommendation']}")
        
        # Wait for 10 seconds before the next cycle
        socketio.sleep(10)

# --- 5. API Route and WebSocket Events ---
@app.route('/vitals', methods=['GET'])
def get_vitals():
    """
    A simple GET endpoint for the React frontend to fetch the latest data on demand.
    """
    return jsonify(latest_vitals_data)

@socketio.on('connect')
def handle_connect():
    """
    This function is called when a new client connects to the WebSocket.
    """
    print('React client connected to WebSocket.')
    # Immediately send the latest data to the newly connected client
    socketio.emit('vitals_update', latest_vitals_data)

# --- 6. Main Execution ---
if __name__ == '__main__':
    MODEL_FILE = 'live_patient_model.pkl'
    
    # Load the trained model once at the start
    try:
        with open(MODEL_FILE, 'rb') as f:
            model = pickle.load(f)
        print(f"Model '{MODEL_FILE}' loaded successfully.")
    except FileNotFoundError:
        print(f"FATAL ERROR: Model file '{MODEL_FILE}' not found.")
        print("Please run the 'train_model.py' script first to create it.")
        exit()

    # Start the background task
    socketio.start_background_task(background_fetcher)
    
    # Start the Flask-SocketIO server
    print("Starting server on http://127.0.0.1:5000")
    socketio.run(app, host='0.0.0.0', port=5000)