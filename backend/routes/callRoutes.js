const path = require('path')
const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const Patient = require(path.join(__dirname, '../models/patient'))
const Nurse = require(path.join(__dirname, '../models/nurse'))


// --- Twilio Configuration ---
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Check if Twilio credentials are provided
if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error("Twilio environment variables are not set!");
}

const client = twilio(accountSid, authToken);

/**
 * @route   POST /api/call/connect
 * @desc    Initiates a click-to-call between a logged-in patient and their assigned nurse
 * @access  Private
 */
router.post("/connect", async (req, res) => {

  console.log('**************')
  console.log('PRINTING FROM /api/call/connect')
  console.log('Authenticated User (req.user):', req.user)
  console.log('**************')

  try {
    // 1. Check for logged-in user
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication error. No user found in session."
      });
    }

    // 2. Get the logged-in patient from the session
    const patient = await Patient.findById(req.user._id);
    console.log('--- Found Patient Details ---');
    console.log(patient);
    console.log('-----------------------------');
    if (!patient || !patient.telephone) {
      return res.status(404).json({
        success: false,
        message: "Patient or their phone number not found."
      });
    }

    // 3. Get the nurse assigned to that patient
    const nurse = await Nurse.findById(patient.nurse);
    console.log('--- Found Nurse Details ---');
    console.log(nurse);
    console.log('---------------------------');
    if (!nurse || !nurse.telephone) {
      return res.status(404).json({
        success: false,
        message: "Assigned nurse or their phone number not found."
      });
    }
    
    // 4. Clean the phone numbers to remove any invisible characters
    const cleanPatientPhone = patient.telephone.replace(/[^\d+]/g, '');
    const cleanNursePhone = nurse.telephone.replace(/[^\d+]/g, '');
    
    console.log('--- Cleaned Phone Numbers ---');
    console.log(`Patient Phone for Dialing: ${cleanPatientPhone}`);
    console.log(`Nurse Phone to Call First: ${cleanNursePhone}`);
    console.log('-----------------------------');


    // 5. Use the Twilio client to create the call
    console.log(
      `Initiating call from ${twilioPhoneNumber} to NURSE at ${cleanNursePhone}`
    );

    const call = await client.calls.create({
      // TwiML tells Twilio what to do when the NURSE answers.
      // In this case, it immediately dials the PATIENT's number.
      twiml: `<Response><Dial>${cleanPatientPhone}</Dial></Response>`,
      to: cleanNursePhone, // The NURSE's phone number (call this number first)
      from: twilioPhoneNumber, // Your Twilio phone number
    });

    console.log(`Call initiated with SID: ${call.sid}`);

    // 6. Send a success response back
    res.json({
      success: true,
      message: "Call initiated. The nurse's phone will ring shortly.",
    });
  } catch (error) {
    console.error("Error initiating Twilio call:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place the call. Please check server logs.",
    });
  }
});

module.exports = router;
