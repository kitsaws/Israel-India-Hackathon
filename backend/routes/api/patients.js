const path = require('path')
const express = require('express');
const passport = require('passport')
const router = express.Router();
const Patient = require(path.join(__dirname,'..','..','models','patient')); 
const {isPatient} = require(path.join(__dirname,'..','..','middlewares'))


router.get('/me',isPatient,async(req,res)=>{
    const id = req.user._id
    const patient = await Patient.findById(id)
    res.json(patient)
})

module.exports = router;
