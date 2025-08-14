from flask import Flask, jsonify
from blink_detector_api import BlinkDetectorRunner

app = Flask(__name__)

# Create a single instance of BlinkDetectorRunner
detector = BlinkDetectorRunner()


@app.route('/',methods=['GET'])
def home():
    return 'BLINK DETECTOR SERVER HOME'

@app.route('/startDetector', methods=['POST'])
def start_detector():
    if detector.thread.is_alive():
        return jsonify({"status": "Detector already running"})
    detector.start()
    return jsonify({"status": "Detector started"})

@app.route('/blinkCount', methods=['GET'])
def blink_count():
    count = detector.countBlinks()
    return jsonify({"blink_count": count})

@app.route('/exitDetector', methods=['POST'])
def exit_detector():
    if not detector.thread.is_alive():
        return jsonify({"status": "Detector is not running"})
    detector.exit()
    return jsonify({"status": "Detector stopped"})

@app.route('/resetBlinkCount', methods=['POST'])
def reset_blink_count():
    detector.detector.blink_count = 0
    return jsonify({"status": "Blink count reset to 0"})

if __name__ == '__main__':
    app.run(debug=True)
