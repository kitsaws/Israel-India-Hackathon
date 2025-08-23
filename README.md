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

We propose a **webcam + IoT-based AI system** with the following key components:

### 1. 👁️ Nose / Blink–Based UI (Assistive Interaction)

Patients interact hands-free by blinking or nose movements.
Provides simple communication options like "need repositioning," "pain relief," "nurse call."

- Patients select options by gazing or blinking at buttons for 2 seconds.
- Allows hands-free operation of the interface for communication and requests.

### 2. 🧠 Facial Emotion Recognition

- Real-time emotion monitoring via webcam.
- Detects signs of pain, sadness, fatigue, or fear.
- Alerts staff if emotional well-being drops.

### 3. 🌬️ Predictive Weaning Readiness 

- ML model predicts the best time to remove mechanical ventilation.
- Uses historical vitals (RR, FiO2, PEEP, etc.) and comorbidities.
- Visual dashboard for doctors to align clinical judgment.

### 4. 🤖 AI Proxy Nurse (ML Model)

-Learns from patient vitals + nurse feedback.
-Predicts patient needs (e.g., repositioning, suctioning, oxygen adjustment).
-Provides nurses with decision support instead of fixed threshold alerts.

### 5. 📞 Patient–Nurse Connection (Twilio Integration)

-If needed the patient can place a call to the nurse.
-Ensures rapid response to urgent needs.

### 6. 🛋️ Vitals Monitoring via IoT (ESP32)

-Collects heart rate, blood pressure, oxygen level, ventilator status.
-Feeds data into the AI model for continuous monitoring.

---

### 💡 Slide Title: Novelty & Show-Stopper Features

**What's Unique:**

- **Multi-Modal Full Non-Touch Interface:** Patients can use nose tracking, blink, or emotion cues to communicate..
- **Emotion + Health Integration:** Combines emotional AI with clinical AI.
- **Adaptive Proxy Nurse AI:** Goes beyond fixed thresholds → ML model learns from nurse feedback + patient history..
- **Predictive Ventilation Timing:** Addresses real ICU problem with data.
- **Seamless Nurse Connectivity:** Real-time alerts via Twilio, ensuring quick interventions.

**Show-Stopper:**

→ *Patients control their environment and express emotions - with just subtle facial cues.*
→ *An AI “proxy nurse” that understands both the patient’s body (vitals) and emotions — predicting needs before words are possible.*

---

### 🛠️ Slide Title: Methodology & Approach

- **Blink/Gaze Detection:** OpenCV + dlib/MediaPipe for real-time gaze & blink tracking.
- **Emotion Detection:** Pre-trained CNN (e.g., FER2013 or AffectNet) running per frame.
- **Weaning Readiness Model:** Trained Gradient Boosting or LSTM using ICU vitals data.
- **Simulation Interface:** React or Flutter-based UI that mimics real control buttons.
- **IoT Vitals Monitoring:** ESP32-based sensors stream heart rate, blood pressure, SpO₂, and ventilator status to backend.
- **AI Proxy Nurse Model:** RandomForest + IsolationForest trained on labeled patient vitals to predict needs (repositioning, suctioning, oxygen adjustment).

---

### 📦 Slide Title: Deliverables

**Final Deliverable: A Web Application**

Accessible via browser or tablet with webcam access.

**Modules Include:**

- 👁️ Blink/Nose UI
- 🧠 Mood Monitoring Panel
- 📊 Weaning Prediction Dashboard (for doctors)
- 🛋️ Vitals Monitoring Dashboard
- 🤖 AI Proxy Nurse
- 📞 Nurse Alert System

---
