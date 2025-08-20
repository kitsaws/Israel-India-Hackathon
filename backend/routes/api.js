
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




const passAuth = (req, res, next) => {
  const { role } = req.params;

  if (!['patient','doctor','nurse','family'].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid Role" });
  }

  return passport.authenticate(`${role}-local`, { session: true })(req, res, next);
};
// #endregion




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



// #region SIGNUP ROUTES
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

// router.post('/auth/patients/check', 
//   passport.authenticate('patient-local', { session: false }), // Disable session if API-based
//   async (req, res) => {
//     try {
//       // If authentication is successful, get user data
//       const user = await Patient.findById(req.user._id);

//       if (!user) {
//         // If no user is found, send failure
//         return res.json({ success: false, message: 'User not found' });
//       }

//       // Send success and user data
//       return res.json({ success: true, user });
//     } catch (error) {
//       // In case there's an error in fetching user data
//       return res.status(500).json({ success: false, message: 'Error fetching user data' });
//     }
//   }
// );

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


// router.post('/auth/login/patient', 
//   passport.authenticate('patient-local', { failureRedirect: '/patient/login' }),
//   async (req, res) => {
//     const id = req.user._id;
//     console.log(id);
    
//     const patient = await Patient.findById(id);
//     console.log(patient);
    

//     req.login(req.user, (err) => {
//       if (err) {
//         // login again
//         return res.status(501).json(err)
//       }
      
//       // Now the session is established, and you can proceed
//       return res.json(patient)
//     });
//   }
// );

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






// #region Nurse dash routes
router.post('/nurses/:id/setGoal', async (req,res)=>{
  const {description,title} = req.body;
  const {id} = req.params

  // find the nurse with that id
  const nurse = await Nurse.findById(id)
  const goals = await nurse.setGoal(title,description)

  return res.json(goals)
})

router.post('/nurses/:n_id/assignPatient/:p_id',async (req,res)=>{
  const {n_id,p_id} = req.params
  // find the nurse with that id
  const nurse = await Nurse.findById(n_id)
  const patient = await nurse.assignPatient(p_id)
  return res.json(patient)
})
// #endregion







module.exports = router;