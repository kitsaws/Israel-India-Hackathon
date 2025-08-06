const path = require('path')
const express = require('express');
const passport = require('passport')
const router = express.Router();
const Patient = require(path.join(__dirname,'..','models','patient')); 
const {isPatient} = require(path.join(__dirname,'..','middlewares'))


router.get('/patients/me',isPatient,async(req,res)=>{
    const id = req.user._id
    const patient = await Patient.findById(id)
    res.json(patient)
})

router.post('/auth/signup/patient',async(req,res)=>{
    try {
        const {fullName:name,age,gender,password} = req.body
        const username = name.toLowerCase().replace(/\s+/g, '.')
        const newPatient = new Patient({
            name,
            age,
            username,
            gender,
            family:[]
        })
        await Patient.register(newPatient,password)
        console.log(`Created patient: ${name} | username: ${username} | password: ${password}`);
        return res.json({'success':true})
    }catch(err){
        console.log(err)
        return res.send(err)
    }
})


router.post('/auth/patients/check', 
  passport.authenticate('patient-local', { session: false }), // Disable session if API-based
  async (req, res) => {
    try {
      // If authentication is successful, get user data
      const user = await Patient.findById(req.user._id);

      if (!user) {
        // If no user is found, send failure
        return res.json({ success: false, message: 'User not found' });
      }

      // Send success and user data
      return res.json({ success: true, user });
    } catch (error) {
      // In case there's an error in fetching user data
      return res.status(500).json({ success: false, message: 'Error fetching user data' });
    }
  }
);

router.post('/auth/login/patient', 
  passport.authenticate('patient-local', { failureRedirect: '/patient/login' }),
  async (req, res) => {
    const id = req.user._id;
    console.log(id);
    
    const patient = await Patient.findById(id);
    console.log(patient);
    

    req.login(req.user, (err) => {
      if (err) {
        // login again
        return res.status(501).json(err)
      }
      
      // Now the session is established, and you can proceed
      return res.json(patient)
    });
  }
);


module.exports = router;
