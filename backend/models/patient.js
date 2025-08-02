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
        type : String
    },
    nurse : {
        type : Schema.Types.ObjectId,
        ref : 'Nurse'
    },
    doctor : {
        type : Schema.Types.ObjectId,
        ref : 'Doctor'
    },
    family : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Family'
        }
    ]
})

patientSchema.plugin(plm)

module.exports = mongoose.model('Patient',patientSchema)
