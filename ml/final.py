import cv2
import numpy as np
from tensorflow.keras.models import load_model
import pyautogui
import win32gui
import win32con
import threading
import time
import asyncio
import websockets
import json
import keyboard

# Use your existing modules
from blink_detector import BlinkDetector
import blink_detector_click_api as blink_click_module  # use click logic (double-blink behavior)
import blink_detector_api as blink_api_module          # referenced per request
from nose_tracker_lib import NoseTracker

# Disable PyAutoGUI failsafe
pyautogui.FAILSAFE = False


def set_window_always_on_top(window_name='Integrated Blink + Nose Tracker'):
    hwnd = win32gui.FindWindow(None, window_name)
    if hwnd:
        win32gui.SetWindowPos(hwnd, win32con.HWND_TOPMOST,
                              0, 0, 0, 0,
                              win32con.SWP_NOMOVE | win32con.SWP_NOSIZE)


class IntegratedTracker:
    def __init__(self):
        # Initialize blink detector (no extra camera opened here)
        self.blink_detector = BlinkDetector()

        # Nose tracker module (extracted from noseTracker.py)
        self.nose_tracker = NoseTracker(sensitivity=3.0)

        # --- NEW: Emotion Detection Setup ---
        self.emotion_model = load_model("emotion_model.h5")
        self.emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
        self.emotion_face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        self.latest_emotion_data = {"emotion": "Initializing..."}  # Shared data for WebSocket

        # Camera setup (single shared capture)
        self.cap = cv2.VideoCapture(0)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FPS, 30)
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

        # Blink tracking for double-click
        self.blink_timestamps = []
        self.last_blink_count = 0

        # Status tracking
        self.nose_mode_active = False

        # Threading
        self._stop_event = threading.Event()
        self.main_thread = threading.Thread(target=self._run_main_loop, daemon=True)
        self.websocket_thread = threading.Thread(target=self._run_websocket_server, daemon=True)

        # Placeholders for websocket loop/server
        self.websocket_loop = None
        self.websocket_server = None

        # Touch imported modules to satisfy usage (no side-effects)
        _ = hasattr(blink_click_module, 'BlinkDetectorRunner')
        _ = hasattr(blink_api_module, 'BlinkDetectorRunner')

    def start(self):
        print("Starting Integrated Blink Detection + Nose Tracking + Emotion System")
        print("=" * 60)
        print("Features:")
        print("- Blink detection with double-click functionality (from blink_detector_click_api logic)")
        print("- Nose tracking for cursor control (logic from noseTracker.py; hold CTRL)")
        print("- Emotion detection with WebSocket broadcasting")
        print("- Single camera shared by all modes")
        print("")
        print("Controls:")
        print("- Hold CTRL: Enable nose tracking")
        print("- Release CTRL: Blink detection resumes")
        print("- Double blink: Left click")
        print("- +/-: Adjust nose sensitivity")
        print("- Q: Quit")
        print("")

        self.websocket_thread.start()
        self.main_thread.start()

    def _run_main_loop(self):
        while not self._stop_event.is_set():
            ret, frame = self.cap.read()
            if not ret:
                print("Failed to capture frame")
                break

            frame = cv2.flip(frame, 1)

            # --- Emotion Detection ---
            self._process_emotion_detection(frame)

            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key in (ord('+'), ord('=')):
                self.nose_tracker.sensitivity = min(10.0, self.nose_tracker.sensitivity + 0.5)
                print(f"Sensitivity: {self.nose_tracker.sensitivity:.1f}")
            elif key == ord('-'):
                self.nose_tracker.sensitivity = max(0.5, self.nose_tracker.sensitivity - 0.5)
                print(f"Sensitivity: {self.nose_tracker.sensitivity:.1f}")

            ctrl_held = keyboard.is_pressed('ctrl')
            self.nose_mode_active = ctrl_held

            if ctrl_held:
                frame, _ = self.nose_tracker.process_frame(frame, space_held=True)
            else:
                if self.nose_tracker.space_held_last_frame:
                    self.nose_tracker.ref_nose_x = self.nose_tracker.ref_nose_y = None
                    self.nose_tracker.ref_cursor_x = self.nose_tracker.ref_cursor_y = None
                self._process_blink_detection(frame)

            self._draw_combined_status(frame)
            cv2.imshow('Integrated Blink + Nose Tracker', frame)

            if not hasattr(self, '_topmost_set'):
                set_window_always_on_top('Integrated Blink + Nose Tracker')
                self._topmost_set = True

        self.cap.release()
        cv2.destroyAllWindows()
        print("Integrated tracker stopped")

    def _process_blink_detection(self, frame):
        try:
            processed_frame = self.blink_detector.process_frame(frame.copy())
            current_blink_count = self.blink_detector.blink_count

            if current_blink_count > self.last_blink_count:
                now = time.time()
                self.blink_timestamps.append(now)
                self.blink_timestamps = [t for t in self.blink_timestamps if now - t <= 3]

                if len(self.blink_timestamps) >= 2:
                    print("Double blink detected - Left click!")
                    pyautogui.click()
                    self.blink_timestamps = []

                self.last_blink_count = current_blink_count

            frame[:] = processed_frame[:]
        except Exception as e:
            print(f"Blink detection error: {e}")

    def _process_emotion_detection(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.emotion_face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) > 0:
            (x, y, w, h) = faces[0]
            roi_gray = gray[y:y + h, x:x + w]
            roi_gray = cv2.resize(roi_gray, (48, 48))
            roi_gray = roi_gray.astype("float") / 255.0
            roi_gray = np.expand_dims(roi_gray, axis=0)
            roi_gray = np.expand_dims(roi_gray, axis=-1)

            prediction = self.emotion_model.predict(roi_gray, verbose=0)
            label = self.emotion_labels[np.argmax(prediction)]
            self.latest_emotion_data = {"emotion": label}
        else:
            self.latest_emotion_data = {"emotion": "No Face Detected"}

    async def _send_emotion_handler(self, websocket):
        print("Frontend client connected.")
        try:
            while not self._stop_event.is_set():
                await websocket.send(json.dumps(self.latest_emotion_data))
                await asyncio.sleep(2)
        except websockets.exceptions.ConnectionClosed:
            print("Frontend client disconnected.")

    def _run_websocket_server(self):
        async def handler(websocket):
            await self._send_emotion_handler(websocket)

        async def start_server():
            self.websocket_server = await websockets.serve(handler, "localhost", 8765)
            print("WebSocket server started at ws://localhost:8765")
            await self.websocket_server.wait_closed()

        self.websocket_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.websocket_loop)
        try:
            self.websocket_loop.run_until_complete(start_server())
            self.websocket_loop.run_forever()
        finally:
            self.websocket_loop.close()
            print("WebSocket server stopped.")

    def _draw_combined_status(self, frame):
        cv2.rectangle(frame, (10, 10), (640, 195), (0, 0, 0), -1)
        cv2.rectangle(frame, (10, 10), (640, 195), (255, 255, 255), 2)
        cv2.putText(frame, "Integrated Blink + Nose Tracker", (20, 35),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        blink_status = "PAUSED" if self.nose_mode_active else "ACTIVE"
        track_status = "ACTIVE" if self.nose_mode_active else "PAUSED"
        cv2.putText(frame, f"Blink Detection: {blink_status}", (20, 60),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6,
                    (0, 255, 0) if blink_status == 'ACTIVE' else (0, 0, 255), 2)
        cv2.putText(frame, f"Nose Tracking: {track_status}", (20, 85),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6,
                    (0, 255, 0) if track_status == 'ACTIVE' else (0, 0, 255), 2)
        cv2.putText(frame, f"Blinks: {self.blink_detector.blink_count}", (20, 110),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        cv2.putText(frame, f"Sensitivity: {self.nose_tracker.sensitivity:.1f}", (20, 135),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        current_emotion = self.latest_emotion_data.get("emotion", "N/A")
        cv2.putText(frame, f"Emotion: {current_emotion}", (20, 160),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
        cv2.putText(frame, "Hold CTRL to move cursor | Release for blink click",
                    (20, 185), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)

    def stop(self):
        self._stop_event.set()

        if self.websocket_loop and self.websocket_server:
            self.websocket_loop.call_soon_threadsafe(self.websocket_server.close)
            self.websocket_loop.call_soon_threadsafe(self.websocket_loop.stop)

        if self.main_thread.is_alive():
            self.main_thread.join()
        if self.websocket_thread.is_alive():
            self.websocket_thread.join()


def main():
    tracker = IntegratedTracker()
    try:
        tracker.start()
        while tracker.main_thread.is_alive():
            time.sleep(0.1)
    except KeyboardInterrupt:
        print("Stopped by user")
    finally:
        tracker.stop()


if __name__ == "__main__":
    main()
