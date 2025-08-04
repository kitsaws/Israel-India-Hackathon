const mongoose = require('mongoose')
const Schema = mongoose.Schema
const plm = require('passport-local-mongoose')


const familySchema = new Schema({
    name : {
        type : String,
        default : 'John Doe'
    },
    relation : {
        type : String,
        default : 'default-relative'
    },
    contact : {
        type : String,
        default : '000-000-000'
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
    
familySchema.method.addContact = async function (cont){
    this.contact = cont
    await this.save()
}

familySchema.plugin(plm)

module.exports = mongoose.model('Family',familySchema)
