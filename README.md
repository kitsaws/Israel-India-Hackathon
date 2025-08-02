# Israeli Indian Hackathon
### 🧠 Slide Title: Problem Statement

**Challenge by Reut Hospital**

Enhance patient experience in restorative healthcare — particularly for patients who are bedridden, on ventilators, or have limited motor functions.

---

### 🎯 Slide Title: Objectives & Expected Outcomes

**Primary Objectives:**

1. Empower patients with limited mobility through AI-powered interaction.
2. Detect mood/emotional well-being to ensure holistic recovery.
3. Predict ventilator weaning readiness using historical vitals data.
4. Provide patients control over their environment (comfort simulation).

**Expected Outcomes:**

- Improved patient independence and mental well-being.
- Reduced staff workload via automation.
- Data-driven decisions on ventilation weaning.
- Simulated patient comfort systems.

---

### 🧬 Slide Title: Proposed Solution

We propose a **webcam-based AI system** with the following key components:

### 1. 👁️ Blink/Gaze-Based UI (Assistive Interaction) (for round 1)

- Patients select options by gazing or blinking at buttons for 2 seconds.
- Allows hands-free operation of the interface for communication and requests.

### 2. 🧠 Facial Emotion Recognition

- Real-time emotion monitoring via webcam.
- Detects signs of pain, sadness, fatigue, or fear.
- Alerts staff if emotional well-being drops.

### 3. 🌬️ Predictive Weaning Readiness (for round 1)

- ML model predicts the best time to remove mechanical ventilation.
- Uses historical vitals (RR, FiO2, PEEP, etc.) and comorbidities.
- Visual dashboard for doctors to align clinical judgment.

### 4. 🛏️ Comfort Control Simulation (No Hardware Required)

- Simulated control over lights, fan, and bed recline.
- Enhances a sense of autonomy and future readiness.

---

### 💡 Slide Title: Novelty & Show-Stopper Features

**What's Unique:**

- **Full Non-Touch Interface:** Patients control UI with gaze or blink alone.
- **Emotion + Health Integration:** Combines emotional AI with clinical AI.
- **Zero Hardware Dependency:** Simulates room control without actual IOT.
- **Predictive Ventilation Timing:** Addresses real ICU problem with data.

**Show-Stopper:**

→ *Patients control their environment and express emotions — with just their eyes.*

---

### 🛠️ Slide Title: Methodology & Approach

- **Blink/Gaze Detection:** OpenCV + dlib/MediaPipe for real-time gaze & blink tracking.
- **Emotion Detection:** Pre-trained CNN (e.g., FER2013 or AffectNet) running per frame.
- **Weaning Readiness Model:** Trained Gradient Boosting or LSTM using ICU vitals data.
- **Simulation Interface:** React or Flutter-based UI that mimics real control buttons.

---

### 📦 Slide Title: Deliverables

**Final Deliverable: A Web Application**

Accessible via browser or tablet with webcam access.

**Modules Include:**

- 👁️ Blink/Gaze UI
- 🧠 Mood Monitoring Panel
- 📊 Weaning Prediction Dashboard (for doctors)
- 🛋️ Simulated Comfort Control Interface

---
