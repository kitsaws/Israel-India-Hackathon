const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema
const plm = require('passport-local-mongoose')

const doctorSchema = new Schema({
    name : {
        type : String
    },
    patients : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Patient'
        }
    ],
    email:{
        type: String
    },
    age:{
        type : String,
        default : 25 
    },
    gender:{
      type: String,
      default: 'Male'
    },
    telephone:{
        type: String,
        trim: true
    },
    department:{
        type: String
    },

},{timestamps: true})



doctorSchema.methods.addPatient = function (patientId) {
    if (!this.patients.some(id => id.equals(patientId))) {
      this.patients.push(patientId);
    }
    return this.save();
};

// --- AutoIncrement ---
doctorSchema.plugin(AutoIncrement, {
  id: "doctor_id_seq",
  inc_field: "doctorId",
  start_seq: 1,
});

doctorSchema.plugin(plm)

module.exports = mongoose.model('Doctor',doctorSchema)
