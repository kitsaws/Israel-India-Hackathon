const mongoose = require('mongoose')
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
    ]
})

doctorSchema.methods.addPatient = function (patientId) {
    if (!this.patients.includes(patientId)) {
      this.patients.push(patientId);
    }
    return this.save();
};

doctorSchema.plugin(plm)

module.exports = mongoose.model('Doctor',doctorSchema)
