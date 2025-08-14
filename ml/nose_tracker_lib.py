import cv2
import mediapipe as mp
import pyautogui

pyautogui.FAILSAFE = False

class NoseTracker:
    def __init__(self, sensitivity: float = 3.0):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )
        self.NOSE_TIP_INDEX = 1
        self.screen_width, self.screen_height = pyautogui.size()

        self.sensitivity = sensitivity

        # Reference points for relative movement while SPACE is held
        self.ref_nose_x = None
        self.ref_nose_y = None
        self.ref_cursor_x = None
        self.ref_cursor_y = None
        self.space_held_last_frame = False

    def process_frame(self, frame, space_held: bool):
        """
        Process a BGR frame, draw nose marker, and move cursor if SPACE is held.
        Returns (frame, tracking_active_bool)
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)

        tracking_active = False

        if results.multi_face_landmarks:
            face_landmarks = results.multi_face_landmarks[0]
            nose = face_landmarks.landmark[self.NOSE_TIP_INDEX]
            nose_x = int(nose.x * frame.shape[1])
            nose_y = int(nose.y * frame.shape[0])

            # Draw nose marker
            cv2.circle(frame, (nose_x, nose_y), 5, (0, 255, 0), -1)

            if space_held:
                tracking_active = True
                # Ensure references are initialized before computing deltas
                if (self.ref_nose_x is None or self.ref_nose_y is None or
                    self.ref_cursor_x is None or self.ref_cursor_y is None or
                    not self.space_held_last_frame):
                    self.ref_nose_x, self.ref_nose_y = nose_x, nose_y
                    cx, cy = pyautogui.position()
                    self.ref_cursor_x, self.ref_cursor_y = int(cx), int(cy)

                dx = (nose_x - self.ref_nose_x) * self.sensitivity
                dy = (nose_y - self.ref_nose_y) * self.sensitivity

                target_x = max(0, min(self.screen_width - 1, self.ref_cursor_x + dx))
                target_y = max(0, min(self.screen_height - 1, self.ref_cursor_y + dy))

                pyautogui.moveTo(target_x, target_y, duration=0.01)
            else:
                # Reset when SPACE not held
                self.ref_nose_x = self.ref_nose_y = None
                self.ref_cursor_x = self.ref_cursor_y = None

            self.space_held_last_frame = space_held
        else:
            # No landmarks; if not holding space, ensure references are reset
            if not space_held:
                self.ref_nose_x = self.ref_nose_y = None
                self.ref_cursor_x = self.ref_cursor_y = None
            # Preserve last space_held state only if we successfully tracked in prior frame

        return frame, tracking_active
