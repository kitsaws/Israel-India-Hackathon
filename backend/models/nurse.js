
const path = require('path')
const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema
const Patient = require(path.join(__dirname,'patient'))
const Doctor = require(path.join(__dirname,'doctor'))
const plm = require('passport-local-mongoose')


// #region NURSE-SCHEMA
const nurseSchema = new Schema({
    name : {
        type : String
    },
    patient : {
        type : Schema.Types.ObjectId,
        ref : 'Patient',
        default : undefined
    },
    email : {
      type : String
    },
    doctor : {
        type : Schema.Types.ObjectId,
        ref : 'Doctor',
        default : undefined
    },
    age : {
      type : String,
      default : 25
    },
    gender : {
      type : String,
      default : 'Male'
    },
    telephone :{
      type : String
    }
})
// #endregion


// #region SCHEMA-METHODS
// Schema method to assign a patient

nurseSchema.methods.assignPatient = async function (username) {
  const patient = await Patient.findOne({username:username})
  this.patient = patient
  await patient.assignNurse(this._id)
  return await this.save();
};
    
// Schema method to assign a doctor
nurseSchema.methods.assignDoctor = async function (username) {
  const doctor = await Doctor.findOne({username:username})
  this.doctor = doctor
  return await this.save();
};

// Add goal
nurseSchema.methods.setGoal = async function (title,description) {
  if (!this.patient) throw new Error("No patient assigned to this nurse");

  const patient = await Patient.findById(this.patient);
  if (!patient) throw new Error("Patient not found");

  patient.goals.push({ title, description });
  await patient.save();

  return patient.goals;
};
  
// Mark goal completed
nurseSchema.methods.completeGoal = async function (goalId) {
  if (!this.patient) throw new Error("No patient assigned to this nurse");

  const patient = await Patient.findById(this.patient);
  if (!patient) throw new Error("Patient not found");

  const goal = patient.goals.id(goalId);
  if (!goal) throw new Error("Goal not found");

  goal.completed = true;
  goal.completedAt = new Date();

  await patient.save();
  return patient.goals;
};
  
// Remove goal
nurseSchema.methods.removeGoal = async function (goalId) {
  if (!this.patient) throw new Error("No patient assigned to this nurse");

  const patient = await Patient.findById(this.patient);
  if (!patient) throw new Error("Patient not found");

  patient.goals.id(goalId).remove();
  await patient.save();
  return patient.goals;
};
// #endregion


// --- AutoIncrement ---
nurseSchema.plugin(AutoIncrement, {
  id: "nurse_id_seq",
  inc_field: "nurseId",
  start_seq: 1,
});


nurseSchema.plugin(plm)
module.exports = mongoose.model('Nurse',nurseSchema)

