
// #region REQUIREMENTS
const path = require('path')
const express = require('express');
const passport = require('passport')
const router = express.Router();

const Patient = require(path.join(__dirname,'..','models','patient')); 
const Doctor = require(path.join(__dirname,'..','models','doctor'));
const Nurse = require(path.join(__dirname,'..','models','nurse'));
const Family = require(path.join(__dirname,'..','models','family'));

const {isPatient} = require(path.join(__dirname,'..','middlewares'));

const {isLoggedIn} = require(path.join(__dirname,'..','middlewares'));

const models = require(path.join(__dirname,'..','utils','mapModel'));
// #end region





// #region MW
const passAuth = (req, res, next) => {
  const { role } = req.params;

  if (!['patient','doctor','nurse','family'].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid Role" });
  }

  return passport.authenticate(`${role}-local`, { session: true })(req, res, next);
};
// #endregion



// #region IDK
router.get('/:role/me',isLoggedIn,async(req,res)=>{
    try{
      const roleFromSession = req.session.role || (req.user && req.user.constructor && req.user.constructor.modelName);
      if(!req.user || !roleFromSession){
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const role = String(roleFromSession).toLowerCase();
      const Model = models[role];
      if(!Model){
        return res.status(400).json({ success: false, message: "Invalid role" });
      }

      const user = await Model.findById(req.user._id);
      if(!user){
        return res.status(400).json({ success: false, message: "User not found" });
      }

      return res.json({ success: true, user, role });
      
    }catch(err){
      res.status(500).json({success: false, message: "Error fetching profile"});
    }
})
// #endregion




// #region SIGNUP PATIENT
router.post('/auth/signup/patient',async(req,res)=>{
    try {
        const {fullName:name,age,gender,password,telephone} = req.body
        const username = name.toLowerCase().replace(/\s+/g, '.')
        const newPatient = new Patient({
            name,
            age,
            username,
            gender,
            telephone,
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
// #regionend





// #region SIGNUP NURSE
router.post('/auth/signup/nurse',async(req,res)=>{
  try {
      const {fullName:name,age,gender,password,telephone} = req.body
      const username = name.toLowerCase().replace(/\s+/g, '.')
      const newNurse = new Nurse({
          name,
          age,
          username,
          gender,
          telephone
      })
      await Nurse.register(newNurse,password)
      console.log(`Created nurse: ${name} | username: ${username} | password: ${password}`);
      return res.json({'success':true})
  }catch(err){
      console.log(err)
      return res.send(err)
  }
})
// #regionend




// #region IDK
router.get('/auth/:role/check',passAuth,async (req, res) => {
    try {
      const {role}=req.params;
      const Model = models[role.toLowerCase()];

      if(!Model){
        return res.status(400).json({ success: false, message: "Invalid role" });
      }

      if(!req.user){
        return res.json({success: false,message: "Auth failed"});
      }

      const user=await Model.findById(req.user._id);
      if(!user){
        return res.status(400).json({ success: false, message: "User not found" });
      }

      return res.json({
        success: true,
        user,
        role
      });
      
    } catch (error) {
      // In case there's an error in fetching user data
      return res.status(500).json({ success: false, message: 'Error fetching user data' });
    }
  }
);
// #regionend




// #region LOGIN ROUTE
router.post('/auth/login/:role',passAuth,async (req, res) => {
    const {role} = req.params;
    if(!['patient', 'doctor', 'nurse', 'family'].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    
    const Model = models[role.toLowerCase()];
    if(!Model){
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    
    const user = await Model.findById(req.user._id);
    if(!user){
      return res.status(400).json({ success: false, message: "User not found" });
    }
    console.log(user);
    
    req.login(req.user, (err) => {
      if (err) {
        // login again
        return res.status(501).json(err)
      }
      
      // Now the session is established, and you can proceed
      req.session.role = role;
      return res.json({
        success: true,
        user,
        role
      })
    });
  }
);
// #endregion




// #region LOGOUT ROUTE
router.post('/auth/logout', (req, res, next) => {
  // req.logout() is a Passport.js function that removes the req.user property 
  // and clears the login session.
  req.logout(function(err) {
    if (err) {
      // If an error occurs during logout, pass it to the next middleware.
      return next(err);
    }
    // req.session.destroy() removes the session from the store.
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Could not log out, please try again.'
        });
      }
      // Clear the session cookie from the client's browser.
      res.clearCookie('connect.sid'); // The default session cookie name is 'connect.sid'
      // Send a success response.
      return res.json({
        success: true,
        message: "Logged out successfully"
      });
    });
  });
});
// #endregion




// #region Nurse dash routes
router.post('/nurse/set-goal', async (req,res)=>{

  console.log('************ set-goal nurse dash ******************')
  console.log(req.user)
  const {description,title} = req.body;


  // find the nurse with that id
  const nurse = await Nurse.findById(req.user._id)

  const goals = await nurse.setGoal(title,description)

  return res.json(goals)
})

router.post('/nurse/assign-patient',async (req,res)=>{
  console.log('************ assign-patient nurse dash ******************')
  console.log(req.user)

    const nurse = await Nurse.findById(req.user._id)
    const {username} = req.body
    await nurse.assignPatient(username)
    return res.json({
      'success' : true
    })
})
// #endregion




module.exports = router;