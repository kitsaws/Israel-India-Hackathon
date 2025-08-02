const path = require('path')
const express = require('express');
const router = express.Router();
const Patient = require(path.join(__dirname,'..','models','patient')); 
const {isPatient} = require(path.join(__dirname,'..','middlewares'))


// checking for auth type

router.use(
  isPatient
)


router.get('/:id',(req,res)=>{
  const {id} = req.params
  console.log(id)
  res.send(`Viewing patient with id : ${id}`)
})

module.exports = router;
