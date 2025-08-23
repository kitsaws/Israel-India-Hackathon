const path = require('path')
const express = require('express');
const passport = require('passport');

const Patient = require(path.join(__dirname,'..','models','patient')); 
const Doctor = require(path.join(__dirname,'..','models','doctor'));
const Nurse = require(path.join(__dirname,'..','models','nurse'));
const Family = require(path.join(__dirname,'..','models','family'));

const { isPatient, isLoggedIn } = require(path.join(__dirname,'..','middlewares'));
const models = require(path.join(__dirname,'..','utils','mapModel'));

// Middleware for dynamic passport auth
const passAuth = (req, res, next) => {
  const { role } = req.params;

  if (!['patient', 'doctor', 'nurse', 'family'].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid Role" });
  }

  return passport.authenticate(`${role}-local`, { session: true })(req, res, next);
};

const middlewares = {
    passAuth,
    isPatient,
    isLoggedIn
};

function createRouter(memoryStore) {
    const router = express.Router();

    // SESSION INSPECTION ROUTE (memoryStore)
    router.get('/nurse/sessions', (req, res) => {
        memoryStore.all((err, sessions) => {
            if (err) return res.status(500).send('Error retrieving sessions');

            const parsedSessions = Object.entries(sessions).map(([sid, session]) => {
            const s = typeof session === 'string' ? JSON.parse(session) : session;

            return {
                sessionID: sid,
                userID: s?.passport?.user || null,
                cookie: s.cookie
            };
            });

            res.json(parsedSessions);
        });
    });

    // Get current logged-in user
    router.get('/:role/me', isLoggedIn, async (req, res) => {
        try {
            const roleFromSession = req.session.role || (req.user && req.user.constructor && req.user.constructor.modelName);
            if (!req.user || !roleFromSession) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
            }

            const role = String(roleFromSession).toLowerCase();
            const Model = models[role];
            if (!Model) return res.status(400).json({ success: false, message: "Invalid role" });

            const user = await Model.findById(req.user._id);
            if (!user) return res.status(400).json({ success: false, message: "User not found" });

            return res.json({ success: true, user, role });
        } catch (err) {
            res.status(500).json({ success: false, message: "Error fetching profile" });
        }
    });

    // Signup patient
    router.post('/auth/signup/patient', async (req, res) => {
        try {
            const { fullName: name, age, gender, password, telephone } = req.body;
            const username = name.toLowerCase().replace(/\s+/g, '.');
            const newPatient = new Patient({
            name,
            age,
            username,
            gender,
            telephone,
            family: []
            });
            await Patient.register(newPatient, password);
            console.log(`Created patient: ${name} | username: ${username} | password: ${password}`);
            return res.json({ success: true });
        } catch (err) {
            console.log(err);
            return res.send(err);
        }
    });

    // Signup nurse
    router.post('/auth/signup/nurse', async (req, res) => {
        try {
            const { fullName: name, age, gender, password, telephone, email } = req.body;
            const username = name.toLowerCase().replace(/\s+/g, '.');
            const newNurse = new Nurse({
            name,
            age,
            username,
            gender,
            telephone,
            email
            });
            await Nurse.register(newNurse, password);
            console.log(`Created nurse: ${name} | username: ${username} | password: ${password}`);
            return res.json({ success: true });
        } catch (err) {
            console.log(err);
            return res.send(err);
        }
    });

    // Auth check
    router.get('/auth/:role/check', passAuth, async (req, res) => {
        try {
            const { role } = req.params;
            const Model = models[role.toLowerCase()];
            if (!Model) return res.status(400).json({ success: false, message: "Invalid role" });
            if (!req.user) return res.json({ success: false, message: "Auth failed" });

            const user = await Model.findById(req.user._id);
            if (!user) return res.status(400).json({ success: false, message: "User not found" });

            return res.json({ success: true, user, role });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Error fetching user data' });
        }
    });

    // Login handler
    router.post('/auth/login/:role', passAuth, async (req, res) => {
        const { role } = req.params;
        if (!['patient', 'doctor', 'nurse', 'family'].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const Model = models[role.toLowerCase()];
        if (!Model) return res.status(400).json({ success: false, message: "Invalid role" });

        const user = await Model.findById(req.user._id);
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        console.log(user);

        req.login(req.user, (err) => {
            if (err) return res.status(501).json(err);
            req.session.role = role;
            return res.json({ success: true, user, role });
        });
    });

    // Logout
    router.post('/auth/logout', (req, res, next) => {
        req.logout(function(err) {
            if (err) return next(err);

            req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Could not log out, please try again.' });
            }

            res.clearCookie('connect.sid');
            return res.json({ success: true, message: "Logged out successfully" });
            });
        });
    });

    //------------------- Nurse dash routes--------------------------
    router.post('/nurse/set-goal', async (req, res) => {
        console.log('************ set-goal nurse dash ******************');
        console.log(req.user);
        const { description, title } = req.body;

        const nurse = await Nurse.findById(req.user._id);
        const goals = await nurse.setGoal(title, description);

        return res.json(goals);
        });
    
    // Assign Patient To Nurse
    router.post('/nurse/assign-patient', async (req, res) => {
        console.log('************ assign-patient nurse dash ******************');
        console.log(req.user);

        const nurse = await Nurse.findById(req.user._id);
        const { username } = req.body;
        await nurse.assignPatient(username);
        return res.json({ success: true });
    });

    //Nurse Can Get Patient's Details
    router.get('/nurse/get-patient',async(req,res)=>{
        console.log('************ set-patient nurse dash ******************');
        console.log(req.user);

        const nurse = await Nurse.findById(req.user._id);
        if(!nurse){
            return res.status(404).json({ success: false, message: 'Nurse not found' });
        }

        if(!nurse.patient){
            return res.status(400).json({ success: false, message: 'No patient assigned to this nurse' });
        }

        const patient = await Patient.findById(nurse.patient);
        if(!patient){
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        return res.json({ success: true, patient });
    })

    //Nurse Can Edit Patient's Details
    router.post('/nurse/patient/edit',async(req,res)=>{
        const {username, name, age, gender, telephone}=req.body;

        const patient=await Patient.findOne({ username });
        if(!patient){
            return res.status(400).json({success: false,messgae:"Patient Not Found"});
        }

        patient.name=name;
        patient.age=age;
        patient.gender=gender;
        patient.telephone=telephone;

        await patient.save();
        return res.json({ success: true, patient });
    })

    //Nurse Can Edit Patient's Family Details
    router.post('/nurse/patient/family/edit',async(req,res)=>{
        const {username,familyId,newTelephone}=req.body;

        const patient=await Patient.findOne({ username }).populate('family');
        if(!patient){
            return res.status(400).json({success: false,messgae:"Patient Not Found"});
        }

        const familyMember=patient.family.find(familyMem=>familyMem._id.toString()===familyId);

        familyMember.contact=newTelephone;
        await familyMember.save();

        return res.json({ success: true, familyMember });
    })

    //Nurse can delete the entry of family from patient
    router.post('/nurse/patient/family/delete',async(req,res)=>{
    const {username,familyId}=req.body;

    const patient=await Patient.findOne({ username });
    if(!patient){
        return res.status(400).json({success: false,messgae:"Patient Not Found"});
    }

    patient.family=patient.family.filter(famId=>famId.toString()!==familyId);

    await patient.save();

    return res.json({ success: true, patient });
    })

    //Logout a specific patient session by SID
    router.post('/nurse/patient/logout', async (req, res) => {
        try {
            const nurse = await Nurse.findById(req.user._id).populate('patient');

            const patientId = nurse.patient._id.toString();

            memoryStore.all((err, sessions) => {
                if (err) {
                    console.error("Error accessing session store:", err);
                    return res.status(500).json({ success: false, message: "Session store error" });
                }

                let sessionFound = false;

                for (const [sessionID, sessionData] of Object.entries(sessions)) {
                    const parsed = typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData;

                    if (
                        parsed.passport &&
                        parsed.passport.user &&
                        parsed.passport.user.id === patientId
                    ) {
                        memoryStore.destroy(sessionID, (err) => {
                            if (err) {
                                console.error("Error destroying session:", err);
                                return res.status(500).json({ success: false, message: "Failed to log out patient" });
                            }

                            sessionFound = true;
                            return res.json({
                                success: true,
                                message: `User (${nurse.patient.name}) logged out successfully.`,
                                redirect: 'http://localhost:5173/'
                            });
                        });

                        return; // Exit the loop once session is destroyed
                    }
                }

                if (!sessionFound) {
                    return res.status(404).json({
                        success: false,
                        message: `No active session found for User (${nurse.patient.name})`,
                    });
                }
            });
        } catch (error) {
            console.error("Logout error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    });

    //Nurse can toggle goals completion status
    router.put('/nurse/patient/togglegoal',async(req,res)=>{
        const {username,goalId}=req.body;

        const patient=await Patient.findOne({username});
        if(!patient){
            return res.status(404).json({success: false,messgae:"Patient Not Found"});
        }

        const updatedGoal=await patient.toggleGoalCompletion(goalId);

        return res.status(200).json({success: true,message: "Goal status updated successfully",goals: patient.goals
        });
    });

    //Nurse can delete patient's goal
    router.delete('/nurse/patient/deletegoal',async(req,res)=>{
        const {username,goalId} = req.body;
        const patient = await Patient.findOne({username});
        if(!patient){
            return res.status(404).json({ success: false, messgae:"Patient Not Found" });
        }

        const goal = patient.goals.id(goalId);
        if(!goal){
            return res.status(404).json({ success: false, message: "Goal Not Found" });
        }

        goal.deleteOne();
        await patient.save();

        return res.status(200).json({ success: true, message: "Goal Deleted", goals: patient.goals });
    });

    //------------------- Doctor dash routes--------------------------
    router.post('/auth/signup/doctor', async (req, res) => {
        try {
            const { fullName: name, email, age, gender, password, telephone, department } = req.body;
            const username = name.toLowerCase().replace(/\s+/g, '.');
            const newDoctor = new Doctor({
                name,
                email,
                age,
                username,
                gender,
                telephone,
                department
            });
            await Doctor.register(newDoctor, password);
            console.log(`Created Doctor: ${name} | username: ${username} | password: ${password}`);
            return res.json({ success: true });
        } catch (err) {
            console.log(err);
            return res.send(err);
        }
    });

    // DOCTOR GET-PATIENTS
    router.get('/doctor/get-patient', async (req,res)=>{
        const patients = await Doctor.findById(req.user._id).populate('patients').patients
        return res.send(patients)
    })

    // DOCTOR GET-NURSES
    router.get('/doctor/get-nurse', async (req,res)=>{
        console.log('************* GET: /api/doctor/get-nurses************')
        const doctor = await Doctor.findById(req.user._id).populate({
            path: 'patients',
            populate: {
                path:'nurse'
            }
        });
        const patients = doctor.patients || [];
        const nurses = []
        for (const patient of patients) {
            if (patient.nurse) {
                nurses.push(patient.nurse)
            }
        }
        console.log('************* returning array of nurses *************')
        return res.send(nurses)
    })

    // Assign Patient To Doctor
    router.post('/doctor/assign-patient', async (req, res) => {
        console.log('************ assign-patient doctor dash ******************');
        console.log(req.user);

        const doctor = await Doctor.findById(req.user._id);
        const { username } = req.body;
        const patient = await Patient.findOne({ username });
        await doctor.addPatient(patient._id);
        return res.json({ success: true ,message: "Patient Assigned Successfully To Doctor ",patient});
    });

  return router;
}

module.exports = { createRouter,...middlewares };




