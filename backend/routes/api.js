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
        return res.redirect('/patients/login')
    }catch(err){
        console.log(err)
        return res.send(err)
    }
})

router.post('/auth/login/patient', 
  passport.authenticate('patient-local', { failureRedirect: '/patients/login' }),
  async (req, res) => {
    const id = req.user._id;
    console.log(id);
    
    const patient = await Patient.findById(id);
    console.log(patient);
    

    req.login(req.user, (err) => {
      if (err) {
        // login again
        return res.redirect('/api/auth/login/patient');
      }
      
      // Now the session is established, and you can proceed
      return res.render('patients/view', { patient });
    });
  }
);


module.exports = router;
