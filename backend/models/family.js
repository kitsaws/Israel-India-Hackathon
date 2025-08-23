const mongoose = require('mongoose')
const Schema = mongoose.Schema
const plm = require('passport-local-mongoose')


const familySchema = new Schema({
    name : {
        type : String,
        default : 'John Doe'
    },
    email: {
        type: String,
        default: 'fam@gmail.com'
    },
    age: {
        type: Number,
        default: 0
    },
    gender: {
        type: String,
        default: 'Male'
    },
    telephone : {
        type : String,
    },
    relation : {
        type : String,
        default : 'default-relative'
    },
    image: {
        type: String,
        default: '/images/default-user.jpg'
    },
    patient : {
        type : Schema.Types.ObjectId,
        ref : 'Patient'
    }
})


familySchema.methods.addPatient = async function (patient) {
    this.patient = patient
    await this.save()
};

familySchema.plugin(plm)

module.exports = mongoose.model('Family',familySchema)
