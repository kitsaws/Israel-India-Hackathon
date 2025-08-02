const mongoose = require('mongoose')
const Schema = mongoose.Schema
const plm = require('passport-local-mongoose')

const nurseSchema = new Schema({
    name : {
        type : String
    },
    patient : {
        type : Schema.Types.ObjectId,
        ref : 'Patient'
    },
    doctor : {
        type : Schema.Types.ObjectId,
        ref : 'Doctor'
    }
})

nurseSchema.plugin(plm)

module.exports = mongoose.model('Nurse',nurseSchema)
