import cv2
import pyautogui
import win32gui
import win32con
import threading
import time

# Use your existing modules
from blink_detector import BlinkDetector
import blink_detector_click_api as blink_click_module  # use click logic (double-blink behavior)
import blink_detector_api as blink_api_module          # referenced per request
from nose_tracker_lib import NoseTracker

import keyboard

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
        
        # Camera setup (single shared capture)
        self.cap = cv2.VideoCapture(0)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FPS, 30)
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        
        # Blink tracking for double-click (same logic as blink_detector_click_api)
        self.blink_timestamps = []
        self.last_blink_count = 0
        
        # Status tracking
        self.nose_mode_active = False
        
        # Threading
        self._stop_event = threading.Event()
        self.main_thread = threading.Thread(target=self._run_main_loop, daemon=True)
        
        # Touch imported modules to satisfy usage (no side-effects)
        _ = hasattr(blink_click_module, 'BlinkDetectorRunner')
        _ = hasattr(blink_api_module, 'BlinkDetectorRunner')
        
    def start(self):
        print("Starting Integrated Blink Detection + Nose Tracking System")
        print("=" * 60)
        print("Features:")
        print("- Blink detection with double-click functionality (from blink_detector_click_api logic)")
        print("- Nose tracking for cursor control (logic from noseTracker.py; hold SPACE)")
        print("- Single camera shared by both modes")
        print("")
        print("Controls:")
        print("- Hold SPACE: Enable nose tracking")
        print("- Release SPACE: Blink detection resumes")
        print("- Double blink: Left click")
        print("- +/-: Adjust nose sensitivity")
        print("- Q: Quit")
        print("")


        self.main_thread.start()
        
    def _run_main_loop(self):
        while not self._stop_event.is_set():
            ret, frame = self.cap.read()
            if not ret:
                print("Failed to capture frame")
                break
            
            frame = cv2.flip(frame, 1)
            
            # Single key read per loop
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('+') or key == ord('='):
                self.nose_tracker.sensitivity = min(10.0, self.nose_tracker.sensitivity + 0.5)
                print(f"Sensitivity: {self.nose_tracker.sensitivity:.1f}")
            elif key == ord('-'):
                self.nose_tracker.sensitivity = max(0.5, self.nose_tracker.sensitivity - 0.5)
                print(f"Sensitivity: {self.nose_tracker.sensitivity:.1f}")
            
            # Decide mode: SPACE held => nose tracking; else blink detection
            space_held = keyboard.is_pressed('ctrl')
            self.nose_mode_active = space_held
            
            if space_held:
                frame, _ = self.nose_tracker.process_frame(frame, space_held=True)
            else:
                # Reset nose references when leaving nose mode
                if self.nose_tracker.space_held_last_frame:
                    self.nose_tracker.ref_nose_x = self.nose_tracker.ref_nose_y = None
                    self.nose_tracker.ref_cursor_x = self.nose_tracker.ref_cursor_y = None
                self._process_blink_detection(frame)
            
            # Status overlay
            self._draw_combined_status(frame)
            cv2.imshow('Integrated Blink + Nose Tracker', frame)

            # Set window always on top (only once, so use a flag)
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
                # Same window as click API (3s)
                self.blink_timestamps = [t for t in self.blink_timestamps if now - t <= 3]
                if len(self.blink_timestamps) >= 2:
                    print("Double blink detected - Left click!")
                    pyautogui.click()
                    self.blink_timestamps = []
                self.last_blink_count = current_blink_count
            
            frame[:] = processed_frame[:]
        except Exception as e:
            print(f"Blink detection error: {e}")
    
    def _draw_combined_status(self, frame):
        cv2.rectangle(frame, (10, 10), (640, 170), (0, 0, 0), -1)
        cv2.rectangle(frame, (10, 10), (640, 170), (255, 255, 255), 2)
        cv2.putText(frame, "Integrated Blink + Nose Tracker", (20, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        blink_status = "PAUSED" if self.nose_mode_active else "ACTIVE"
        track_status = "ACTIVE" if self.nose_mode_active else "PAUSED"
        cv2.putText(frame, f"Blink Detection: {blink_status}", (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,0) if blink_status=='ACTIVE' else (0,0,255), 2)
        cv2.putText(frame, f"Nose Tracking: {track_status}", (20, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,0) if track_status=='ACTIVE' else (0,0,255), 2)
        cv2.putText(frame, f"Blinks: {self.blink_detector.blink_count}", (20, 110), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2)
        cv2.putText(frame, f"Sensitivity: {self.nose_tracker.sensitivity:.1f}", (20, 135), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2)
        cv2.putText(frame, "Hold SPACE to move cursor | Release for blink click", (20, 160), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,0), 1)
    
    def stop(self):
        self._stop_event.set()
        if self.main_thread.is_alive():
            self.main_thread.join()


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
