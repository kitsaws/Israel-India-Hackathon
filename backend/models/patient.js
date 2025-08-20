const mongoose = require('mongoose')
const Schema = mongoose.Schema
const plm = require('passport-local-mongoose')

const alertSchema = new Schema({
    message: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    createdAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: true }
});

const goalSchema = new Schema({
    title : { type : String , default : null },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null }
});

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
    ],
    goals: [goalSchema],
    alerts : [alertSchema]
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

// Add an alert
patientSchema.methods.addAlert = function (message, severity = "low") {
  this.alerts.push({ message, severity });
  return this.save().then(() => {
    return this.alerts[this.alerts.length - 1]; // return the new alert
  });
};

// Mark an alert inactive
patientSchema.methods.deactivateAlert = function (alertId) {
  const alert = this.alerts.id(alertId);
  if (alert) {
    alert.active = false;
  }
  return this.save();
};

// -------- Middleware --------

// Auto-remove inactive alerts before saving

patientSchema.pre("save", function (next) {
  const removedIds = this.alerts
    .filter((alert) => !alert.active)
    .map((alert) => alert._id.toString());

  if (removedIds.length > 0) {
    console.log("Cleaning inactive alerts:", removedIds);
  }

  this.alerts = this.alerts.filter((alert) => alert.active);
  next();
});



patientSchema.plugin(plm)

module.exports = mongoose.model('Patient',patientSchema)
