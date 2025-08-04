const path = require('path')
const express = require('express');
const passport = require('passport');
const router = express.Router();
const Patient = require(path.join(__dirname,'..','models','patient')); 
const {isPatient} = require(path.join(__dirname,'..','middlewares'))




router.get('/login',(req,res)=>{
  res.render('patients/login')
})

router.post('/login',passport.authenticate('patient-local',{failureRedirect:'/patients/login'}),async(req,res)=>{
  const id = req.user._id
  const patient = await Patient.findById(id)
  res.json(patient)
})



router.get('/:id',(req,res)=>{
  const {id} = req.params
  console.log(id)
  res.send(`Viewing patient with id : ${id}`)
})

module.exports = router;
