import threading
import cv2
import time
from blink_detector import BlinkDetector

class BlinkDetectorRunner:
    def __init__(self):
        self.detector = BlinkDetector()
        self.cap = cv2.VideoCapture(0)
        
        # Optimize camera settings
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        self.cap.set(cv2.CAP_PROP_FPS, 30)
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

        self._stop_event = threading.Event()
        self.blink_count = 0
        self.thread = threading.Thread(target=self._run, daemon=True)

    def start(self):
        print("Starting blink detection thread...")
        self.thread.start()

    def _run(self):
        print("🎯 MOTION-RESISTANT Blink Detection System")
        print("=" * 50)
        print("✅ Features:")
        print("- Motion detection (pauses blink detection during movement)")
        print("- Face stability analysis")
        print("- Landmark quality validation")  
        print("- Ultra-strict blink validation")
        print("- Suspicious change detection")
        print("")
        print("🎮 Controls:")
        print("'q' - Quit")
        print("'r' - Reset blink counter")
        print("'c' - Clear baseline (recalibrate)")
        print("'+' - Increase base threshold")
        print("'-' - Decrease base threshold")
        print("")
        print("💡 Tips:")
        print("- Keep your screen/camera steady")
        print("- Wait for 'Face Stable: YES' before blinking")
        print("- Detection pauses automatically during motion")
        print("- Let system calibrate for 15-20 seconds")
        print("")

        while not self._stop_event.is_set():
            ret, frame = self.cap.read()
            if not ret:
                print("Failed to capture frame")
                break
            
            frame = cv2.flip(frame, 1)
            processed_frame = self.detector.process_frame(frame)

            # Update blink count from detector
            self.blink_count = self.detector.blink_count
            
            cv2.imshow('Motion-Resistant Blink Detection', processed_frame)

            key = cv2.waitKey(1) & 0xFF

            if key == ord('q'):
                self.exit()
                break
            elif key == ord('r'):
                self.detector.blink_count = 0
                print("🔄 Blink counter reset!")
            elif key == ord('c'):
                self.detector.baseline_ear_history.clear()
                self.detector.ADAPTIVE_THRESHOLD = self.detector.BASE_EAR_THRESHOLD
                self.detector.suspicious_changes = 0
                print("🎯 Baseline cleared! Recalibrating...")
            elif key == ord('+') or key == ord('='):
                self.detector.BASE_EAR_THRESHOLD += 0.01
                print(f"📈 Base threshold: {self.detector.BASE_EAR_THRESHOLD:.3f}")
            elif key == ord('-'):
                self.detector.BASE_EAR_THRESHOLD = max(0.15, self.detector.BASE_EAR_THRESHOLD - 0.01)
                print(f"📉 Base threshold: {self.detector.BASE_EAR_THRESHOLD:.3f}")

        self.cap.release()
        cv2.destroyAllWindows()
        print(f"\n📊 Final Results:")
        print(f"Total blinks detected: {self.blink_count}")
        print(f"Adaptive threshold: {self.detector.ADAPTIVE_THRESHOLD:.3f}")

    def countBlinks(self):
        return self.blink_count

    def exit(self):
        print("Stopping blink detection...")
        self._stop_event.set()
        self.thread.join()



