const mongoose = require('mongoose')
const Schema = mongoose.Schema
const plm = require('passport-local-mongoose')

const nurseSchema = new Schema({
    name : {
        type : String
    },
    patient : {
        type : Schema.Types.ObjectId,
        ref : 'Patient',
        default : undefined
    },
    doctor : {
        type : Schema.Types.ObjectId,
        ref : 'Doctor',
        default : undefined
    }
})

// Schema method to assign a patient
nurseSchema.methods.assignPatient = async function (patientId) {
    this.patient = patientId;
    return await this.save();
    };
    
    // Schema method to assign a doctor
    nurseSchema.methods.assignDoctor = async function (doctorId) {
    this.doctor = doctorId;
    return await this.save();
};

nurseSchema.plugin(plm)

module.exports = mongoose.model('Nurse',nurseSchema)
