const mongoose = require('mongoose')
const Schema = mongoose.Schema
const plm = require('passport-local-mongoose')

const patientSchema = new Schema({
    name : {
        type : String,
    },
    age : {
        type : Number
    },
    gender : {
        type : String,
        enum : ['Male','Female','Other'],
        default : 'Female'
    },
    nurse : {
        type : Schema.Types.ObjectId,
        ref : 'Nurse',
        default : undefined
    },
    doctor : {
        type : Schema.Types.ObjectId,
        ref : 'Doctor',
        default : undefined
    },
    family : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Family'
        }
    ]
})

// Add doctor
patientSchema.methods.assignDoctor = function (doctorId) {
    this.doctor = doctorId;
    return this.save();
};
    
    // Add nurse
    patientSchema.methods.assignNurse = function (nurseId) {
        this.nurse = nurseId;
        return this.save();
    };
    
    // Add a family member (push into array)
    patientSchema.methods.addFamilyMember = function (familyId) {
        if (!this.family.includes(familyId)) {
        this.family.push(familyId);
        }
        return this.save();
    };

patientSchema.plugin(plm)

module.exports = mongoose.model('Patient',patientSchema)
