import cv2
import mediapipe as mp
import pyautogui

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
)

cap = cv2.VideoCapture(0)
screen_width, screen_height = pyautogui.size()
NOSE_TIP_INDEX = 1

sensitivity = 3.0  # sensitivity multiplier

print("🟢 Nose tracker started.")
print("Hold SPACE to move cursor.")
print("Use '+' and '-' keys to adjust sensitivity.")
print("Press 'q' to quit.")

ref_nose_x = None
ref_nose_y = None
ref_cursor_x = None
ref_cursor_y = None

space_held_last_frame = False

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    frame_height, frame_width = frame.shape[:2]
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    key = cv2.waitKey(1) & 0xFF
    space_held = (key == 32)  # SPACE pressed this frame

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            nose = face_landmarks.landmark[NOSE_TIP_INDEX]
            nose_x = int(nose.x * frame_width)
            nose_y = int(nose.y * frame_height)

            cv2.circle(frame, (nose_x, nose_y), 5, (0, 255, 0), -1)

            if space_held:
                if not space_held_last_frame:
                    # Just started holding SPACE: set reference points
                    ref_nose_x, ref_nose_y = nose_x, nose_y
                    ref_cursor_x, ref_cursor_y = pyautogui.position()

                # Calculate how much nose moved from reference position
                dx = (nose_x - ref_nose_x) * sensitivity
                dy = (nose_y - ref_nose_y) * sensitivity

                # Compute new cursor position relative to ref cursor position
                target_x = ref_cursor_x + dx
                target_y = ref_cursor_y + dy

                # Clamp cursor inside screen boundaries
                target_x = max(0, min(screen_width - 1, target_x))
                target_y = max(0, min(screen_height - 1, target_y))

                pyautogui.moveTo(target_x, target_y, duration=0.01)

            else:
                # SPACE not held, reset references
                ref_nose_x, ref_nose_y = None, None
                ref_cursor_x, ref_cursor_y = None, None

    # Update space held state for next frame
    space_held_last_frame = space_held

    # Adjust sensitivity live
    if key == ord('+') or key == ord('='):
        sensitivity = min(10.0, sensitivity + 0.5)
    elif key == ord('-'):
        sensitivity = max(0.5, sensitivity - 0.5)

    # Show sensitivity on the frame
    cv2.putText(
        frame,
        f"Sensitivity: {sensitivity:.1f}",
        (10, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 255),
        2,
        cv2.LINE_AA,
    )

    cv2.imshow("Nose Tracker", frame)

    if key == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
