import cv2
import mediapipe as mp
import numpy as np
from collections import deque
import time

class BlinkDetector:
    def __init__(self):
        # MediaPipe setup
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        
        # Face mesh model with higher confidence for stability
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.8,  # Higher confidence
            min_tracking_confidence=0.8
        )
        
        # Eye landmark indices
        self.LEFT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
        self.RIGHT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
        
        # EAR calculation points
        self.LEFT_EYE_EAR = [33, 160, 158, 133, 153, 144]
        self.RIGHT_EYE_EAR = [362, 385, 387, 263, 373, 380]
        
        # Reference points for motion detection (nose tip and forehead)
        self.MOTION_REFERENCE_POINTS = [1, 2, 5, 4, 6, 19, 94, 125, 141, 235, 236, 3, 51, 48, 115, 131, 134, 102, 49, 220, 305, 292, 330, 309, 415, 310, 311, 312, 13, 82, 308, 324, 318]
        
        # Enhanced blink detection parameters
        self.BASE_EAR_THRESHOLD = 0.25
        self.ADAPTIVE_THRESHOLD = 0.25
        self.MIN_CLOSED_FRAMES = 3
        self.MAX_CLOSED_FRAMES = 12
        self.BLINK_COOLDOWN = 8  # Increased cooldown
        
        # Motion detection parameters
        self.MOTION_THRESHOLD = 0.02  # Threshold for detecting significant motion
        self.STABLE_FRAMES_REQUIRED = 5  # Frames of stability needed before allowing blinks
        
        # State tracking
        self.blink_count = 0
        self.frame_counter = 0
        self.eye_closed_frames = 0
        self.frames_since_blink = 0
        self.stable_frames = 0
        self.blink_state = "OPEN"
        
        # EAR tracking with longer history
        self.ear_history = deque(maxlen=15)
        self.baseline_ear_history = deque(maxlen=100)
        
        # Motion tracking
        self.face_position_history = deque(maxlen=8)
        self.is_face_stable = False
        self.motion_detected = False
        
        # Landmark quality tracking
        self.landmark_confidence_history = deque(maxlen=10)
        
        # Enhanced validation
        self.ear_change_history = deque(maxlen=5)
        self.suspicious_changes = 0
        
        # Timing
        self.blink_start_time = 0
        self.last_blink_time = 0
        self.last_motion_time = 0
        
    def calculate_face_center(self, landmarks):
        """Calculate the center point of the face for motion detection"""
        try:
            points = []
            for point_idx in self.MOTION_REFERENCE_POINTS:
                x = landmarks[point_idx].x
                y = landmarks[point_idx].y
                points.append([x, y])
            
            points = np.array(points)
            center = np.mean(points, axis=0)
            return center
        except:
            return None
    
    def detect_motion(self, landmarks):
        """Detect if face/camera is moving significantly"""
        face_center = self.calculate_face_center(landmarks)
        
        if face_center is None:
            self.is_face_stable = False
            return True
        
        self.face_position_history.append(face_center)
        
        if len(self.face_position_history) >= 5:
            # Calculate movement over last few frames
            positions = np.array(list(self.face_position_history))
            
            # Calculate maximum displacement from mean position
            mean_pos = np.mean(positions[-5:], axis=0)
            max_displacement = np.max([np.linalg.norm(pos - mean_pos) for pos in positions[-5:]])
            
            # Check for sudden movements
            if len(positions) >= 3:
                recent_movement = np.linalg.norm(positions[-1] - positions[-3])
                if recent_movement > self.MOTION_THRESHOLD:
                    self.motion_detected = True
                    self.last_motion_time = time.time()
                    self.stable_frames = 0
                    self.is_face_stable = False
                    return True
            
            # Check overall stability
            if max_displacement < self.MOTION_THRESHOLD / 2:
                self.stable_frames += 1
                if self.stable_frames >= self.STABLE_FRAMES_REQUIRED:
                    self.is_face_stable = True
                    self.motion_detected = False
            else:
                self.stable_frames = max(0, self.stable_frames - 1)
                self.is_face_stable = False
        
        return self.motion_detected
    
    def calculate_landmark_confidence(self, landmarks):
        """Estimate landmark detection confidence based on geometric consistency"""
        try:
            # Check if eye landmarks form reasonable shapes
            left_eye_points = []
            right_eye_points = []
            
            for point in self.LEFT_EYE_EAR:
                left_eye_points.append([landmarks[point].x, landmarks[point].y])
            
            for point in self.RIGHT_EYE_EAR:
                right_eye_points.append([landmarks[point].x, landmarks[point].y])
            
            left_eye_points = np.array(left_eye_points)
            right_eye_points = np.array(right_eye_points)
            
            # Check if eye points are reasonably spaced
            left_width = np.linalg.norm(left_eye_points[0] - left_eye_points[3])
            right_width = np.linalg.norm(right_eye_points[0] - right_eye_points[3])
            
            # Eyes should be similar sizes
            eye_size_ratio = min(left_width, right_width) / max(left_width, right_width)
            
            # Eye widths should be reasonable (not too small or large)
            reasonable_size = 0.02 < left_width < 0.15 and 0.02 < right_width < 0.15
            
            confidence = eye_size_ratio if reasonable_size else 0.0
            return confidence
            
        except:
            return 0.0
    
    def calculate_ear(self, landmarks, eye_points):
        """Enhanced EAR calculation with quality checks"""
        try:
            coords = []
            for point in eye_points:
                x = landmarks[point].x
                y = landmarks[point].y
                coords.append([x, y])
            
            coords = np.array(coords)
            
            # Calculate distances
            vertical_1 = np.linalg.norm(coords[1] - coords[5])
            vertical_2 = np.linalg.norm(coords[2] - coords[4])
            horizontal = np.linalg.norm(coords[0] - coords[3])
            
            # Quality checks
            if horizontal < 0.001 or vertical_1 < 0.0001 or vertical_2 < 0.0001:
                return 0.0
            
            # Check for unreasonable aspect ratios
            if vertical_1 / horizontal > 2.0 or vertical_2 / horizontal > 2.0:
                return 0.0
            
            ear = (vertical_1 + vertical_2) / (2.0 * horizontal)
            return max(0.0, min(1.0, ear))
            
        except Exception as e:
            return 0.0
    
    def smooth_ear_advanced(self, current_ear):
        """Advanced EAR smoothing with change detection"""
        if current_ear <= 0.0:
            return self.get_last_valid_ear()
        
        # Track EAR changes
        if len(self.ear_history) > 0:
            ear_change = abs(current_ear - self.ear_history[-1])
            self.ear_change_history.append(ear_change)
            
            # Detect suspicious rapid changes
            if len(self.ear_change_history) >= 3:
                recent_changes = list(self.ear_change_history)[-3:]
                if all(change > 0.05 for change in recent_changes):
                    self.suspicious_changes += 1
                else:
                    self.suspicious_changes = max(0, self.suspicious_changes - 1)
        
        self.ear_history.append(current_ear)
        
        # Use different smoothing based on stability
        if len(self.ear_history) >= 5:
            ears = list(self.ear_history)
            
            if self.is_face_stable and self.suspicious_changes < 2:
                # Normal smoothing when stable
                return np.mean(ears[-5:])
            else:
                # Heavy smoothing when unstable
                return np.mean(ears[-8:]) if len(ears) >= 8 else np.mean(ears)
        
        return np.mean(self.ear_history)
    
    def get_last_valid_ear(self):
        """Get the last valid EAR value"""
        if self.ear_history:
            return self.ear_history[-1]
        return 0.25
    
    def update_adaptive_threshold(self, current_ear):
        """Update adaptive threshold only when face is stable"""
        if (self.blink_state == "OPEN" and 
            self.is_face_stable and 
            len(self.ear_history) >= 5 and
            self.suspicious_changes < 2):
            
            recent_stable = all(ear > self.BASE_EAR_THRESHOLD * 1.3 for ear in list(self.ear_history)[-5:])
            if recent_stable:
                self.baseline_ear_history.append(current_ear)
        
        if len(self.baseline_ear_history) >= 30:
            baseline_ear = np.mean(list(self.baseline_ear_history)[-50:])
            self.ADAPTIVE_THRESHOLD = max(0.18, min(0.35, baseline_ear * 0.68))
    
    def detect_blink_ultra_strict(self, smoothed_ear):
        """Ultra-strict blink detection that ignores motion periods"""
        current_time = time.time()
        
        # Don't detect blinks if motion was recent or face is unstable
        if (self.motion_detected or 
            not self.is_face_stable or 
            current_time - self.last_motion_time < 1.0 or  # 1 second after motion
            self.suspicious_changes >= 2):
            
            # Reset blink state if we were in middle of detection
            if self.blink_state != "OPEN":
                self.blink_state = "OPEN"
                self.eye_closed_frames = 0
            return
        
        # Update adaptive threshold
        self.update_adaptive_threshold(smoothed_ear)
        
        is_eye_closed = smoothed_ear < self.ADAPTIVE_THRESHOLD
        
        # State machine with stricter validation
        if self.blink_state == "OPEN":
            if is_eye_closed and self.frames_since_blink >= self.BLINK_COOLDOWN:
                self.blink_state = "CLOSING"
                self.eye_closed_frames = 1
                self.blink_start_time = current_time
            else:
                self.frames_since_blink += 1
                
        elif self.blink_state == "CLOSING":
            if is_eye_closed:
                self.eye_closed_frames += 1
                if self.eye_closed_frames >= self.MIN_CLOSED_FRAMES:
                    self.blink_state = "CLOSED"
            else:
                # Stricter validation - require very stable reopening
                consecutive_open = sum(1 for ear in list(self.ear_history)[-3:] if ear >= self.ADAPTIVE_THRESHOLD * 1.1)
                if consecutive_open >= 2:
                    self.blink_state = "OPEN"
                    self.eye_closed_frames = 0
                
        elif self.blink_state == "CLOSED":
            if is_eye_closed:
                self.eye_closed_frames += 1
                if self.eye_closed_frames > self.MAX_CLOSED_FRAMES:
                    self.blink_state = "OPEN"
                    self.eye_closed_frames = 0
            else:
                self.blink_state = "OPENING"
                
        elif self.blink_state == "OPENING":
            # Require very clear eye opening
            if smoothed_ear >= self.ADAPTIVE_THRESHOLD * 1.15:  # Clear opening
                blink_duration = current_time - self.blink_start_time
                time_since_last = current_time - self.last_blink_time
                
                # Very strict validation
                if (0.15 <= blink_duration <= 0.6 and    # Strict duration
                    time_since_last >= 0.5 and           # Minimum time between blinks
                    self.frames_since_blink >= self.BLINK_COOLDOWN and
                    self.is_face_stable and              # Must be stable
                    not self.motion_detected):           # No motion
                    
                    self.blink_count += 1
                    self.last_blink_time = current_time
                    self.frames_since_blink = 0
                    
                self.blink_state = "OPEN"
                self.eye_closed_frames = 0
            else:
                # Not clearly open yet, go back to closed
                self.blink_state = "CLOSED"
    
    def draw_eye_landmarks(self, image, landmarks):
        """Draw eye landmarks with motion and stability indicators"""
        height, width = image.shape[:2]
        
        # Color based on stability and blink state
        if self.motion_detected:
            color = (0, 0, 255)  # Red for motion
        elif not self.is_face_stable:
            color = (0, 165, 255)  # Orange for unstable
        elif self.suspicious_changes >= 2:
            color = (0, 255, 255)  # Yellow for suspicious
        else:
            # Normal state colors
            color_map = {
                "OPEN": (0, 255, 0),      # Green
                "CLOSING": (0, 255, 255), # Yellow
                "CLOSED": (255, 0, 0),    # Blue
                "OPENING": (255, 0, 255)  # Magenta
            }
            color = color_map.get(self.blink_state, (0, 255, 0))
        
        # Draw eye landmarks
        for point in self.LEFT_EYE:
            x = int(landmarks[point].x * width)
            y = int(landmarks[point].y * height)
            cv2.circle(image, (x, y), 2, color, -1)
        
        for point in self.RIGHT_EYE:
            x = int(landmarks[point].x * width)
            y = int(landmarks[point].y * height)
            cv2.circle(image, (x, y), 2, color, -1)
    
    def add_text_overlay(self, image, left_ear, right_ear, avg_ear, landmark_confidence):
        """Enhanced text overlay with motion and stability info"""
        cv2.rectangle(image, (10, 10), (550, 220), (0, 0, 0), -1)
        cv2.rectangle(image, (10, 10), (550, 220), (255, 255, 255), 2)
        
        # EAR information
        cv2.putText(image, f"Left EAR: {left_ear:.3f}", (20, 35), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
        cv2.putText(image, f"Right EAR: {right_ear:.3f}", (20, 55), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
        cv2.putText(image, f"Avg EAR: {avg_ear:.3f}", (20, 75), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
        
        # Threshold and state
        cv2.putText(image, f"Adaptive Threshold: {self.ADAPTIVE_THRESHOLD:.3f}", (20, 95), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 200, 0), 2)
        cv2.putText(image, f"Blink State: {self.blink_state}", (20, 115), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 100, 255), 2)
        cv2.putText(image, f"Blinks: {self.blink_count}", (20, 140), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        # Motion and stability info
        motion_status = "MOTION" if self.motion_detected else "STABLE"
        motion_color = (0, 0, 255) if self.motion_detected else (0, 255, 0)
        cv2.putText(image, f"Motion: {motion_status}", (300, 35), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, motion_color, 2)
        
        stable_status = "YES" if self.is_face_stable else "NO"
        stable_color = (0, 255, 0) if self.is_face_stable else (0, 0, 255)
        cv2.putText(image, f"Face Stable: {stable_status}", (300, 55), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, stable_color, 2)
        
        cv2.putText(image, f"Stable Frames: {self.stable_frames}", (300, 75), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 2)
        cv2.putText(image, f"Landmark Quality: {landmark_confidence:.2f}", (300, 95), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (150, 150, 255), 2)
        cv2.putText(image, f"Suspicious Changes: {self.suspicious_changes}", (300, 115), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 150, 0), 2)
        
        # Detection status
        can_detect = (self.is_face_stable and 
                     not self.motion_detected and 
                     self.suspicious_changes < 2)
        detect_status = "ACTIVE" if can_detect else "PAUSED"
        detect_color = (0, 255, 0) if can_detect else (0, 0, 255)
        cv2.putText(image, f"Blink Detection: {detect_status}", (20, 165), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, detect_color, 2)
        
        # Timing info
        cv2.putText(image, f"Frames Since Blink: {self.frames_since_blink}", (300, 135), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 2)
        
        if len(self.baseline_ear_history) > 0:
            baseline_avg = np.mean(list(self.baseline_ear_history)[-20:])
            cv2.putText(image, f"Baseline EAR: {baseline_avg:.3f}", (300, 155), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (150, 150, 255), 2)
    
    def process_frame(self, frame):
        """Process frame with motion-aware detection"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)
        
        left_ear = 0.0
        right_ear = 0.0
        avg_ear = 0.0
        landmark_confidence = 0.0
        
        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                # Detect motion first
                self.detect_motion(face_landmarks.landmark)
                
                # Calculate landmark confidence
                landmark_confidence = self.calculate_landmark_confidence(face_landmarks.landmark)
                self.landmark_confidence_history.append(landmark_confidence)
                
                # Only proceed with EAR calculation if landmarks seem reliable
                if landmark_confidence > 0.3:
                    left_ear = self.calculate_ear(face_landmarks.landmark, self.LEFT_EYE_EAR)
                    right_ear = self.calculate_ear(face_landmarks.landmark, self.RIGHT_EYE_EAR)
                    
                    if left_ear > 0 and right_ear > 0:
                        avg_ear = (left_ear + right_ear) / 2.0
                        
                        # Apply advanced smoothing
                        smoothed_ear = self.smooth_ear_advanced(avg_ear)
                        
                        # Ultra-strict blink detection
                        self.detect_blink_ultra_strict(smoothed_ear)
                    else:
                        avg_ear = self.get_last_valid_ear()
                        smoothed_ear = avg_ear
                else:
                    # Poor landmark quality, use last known values
                    avg_ear = self.get_last_valid_ear()
                    smoothed_ear = avg_ear
                
                # Draw landmarks and overlay
                self.draw_eye_landmarks(frame, face_landmarks.landmark)
                self.add_text_overlay(frame, left_ear, right_ear, smoothed_ear, landmark_confidence)
                
                break
        else:
            # No face detected
            self.is_face_stable = False
            self.motion_detected = True
            self.stable_frames = 0
            if self.blink_state != "OPEN":
                self.blink_state = "OPEN"
                self.eye_closed_frames = 0
        
        self.frame_counter += 1
        return frame
    



def main():
    detector = BlinkDetector()
    cap = cv2.VideoCapture(0)
    
    # Optimize camera settings
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, 30)
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    
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
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture frame")
            break
        
        frame = cv2.flip(frame, 1)
        processed_frame = detector.process_frame(frame)
        
        cv2.imshow('Motion-Resistant Blink Detection', processed_frame)
        
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('r'):
            detector.blink_count = 0
            print("🔄 Blink counter reset!")
        elif key == ord('c'):
            detector.baseline_ear_history.clear()
            detector.ADAPTIVE_THRESHOLD = detector.BASE_EAR_THRESHOLD
            detector.suspicious_changes = 0
            print("🎯 Baseline cleared! Recalibrating...")
        elif key == ord('+') or key == ord('='):
            detector.BASE_EAR_THRESHOLD += 0.01
            print(f"📈 Base threshold: {detector.BASE_EAR_THRESHOLD:.3f}")
        elif key == ord('-'):
            detector.BASE_EAR_THRESHOLD = max(0.15, detector.BASE_EAR_THRESHOLD - 0.01)
            print(f"📉 Base threshold: {detector.BASE_EAR_THRESHOLD:.3f}")
    
    cap.release()
    cv2.destroyAllWindows()
    
    print(f"\n📊 Final Results:")
    print(f"Total blinks detected: {detector.blink_count}")
    print(f"Adaptive threshold: {detector.ADAPTIVE_THRESHOLD:.3f}")

if __name__ == "__main__":
    main()