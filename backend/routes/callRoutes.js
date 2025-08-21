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
  console.log(req.user)
  console.log('**************')


  try {
    // 1. Get the logged-in patient from the session
    const patient = await Patient.findById(req.user._id);
    if (!patient || !patient.telephone) {
      return res.status(404).json({
        success: false,
        message: "Patient or their phone number not found."
      });
    }

    // 2. Get the nurse assigned to that patient

    const nurse = await Nurse.findById(patient.nurse);
    console.log(nurse)

    if (!nurse || !nurse.telephone) {
      return res.status(404).json({
        success: false,
        message: "Assigned nurse or their phone number not found."
      });
    }

    // 3. Use the Twilio client to create the call
    console.log(
      `Initiating call from ${twilioPhoneNumber} to patient at ${patient.telephone}`
    );

    const call = await client.calls.create({
      // TwiML tells Twilio what to do when the patient answers.
      // In this case, it immediately dials the nurse's number.
      twiml: `<Response><Dial>${nurse.telephone}</Dial></Response>`,
      to: patient.telephone, // The patient's phone number (call this number first)
      from: twilioPhoneNumber, // Your Twilio phone number
    });

    console.log(`Call initiated with SID: ${call.sid}`);

    // 4. Send a success response back
    res.json({
      success: true,
      message: "Call initiated. Your phone will ring shortly.",
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
