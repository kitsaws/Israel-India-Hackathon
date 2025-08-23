const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;
const plm = require('passport-local-mongoose');

const alertSchema = new Schema({
    message: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    createdAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: true }
});

const goalSchema = new Schema({
    title: { type: String, default: null },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null }
});

const patientSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Patient name is required.'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Patient age is required.'],
        min: 0
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Female'
    },
    nurse: {
        type: Schema.Types.ObjectId,
        ref: 'Nurse',
        default: null
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        default: null
    },
    telephone: {
        type: String,
        trim: true
    },
    family: [{
        type: Schema.Types.ObjectId,
        ref: 'Family'
    }],
    goals: [goalSchema],
    alerts: [alertSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    condition : {
        type : String,
        default : "stable"
    }
    // Correct: `id` and `room` are NOT defined here.
});

// -------- Methods (using async/await) --------

patientSchema.methods.assignDoctor = async function(doctorId) {
    this.doctor = doctorId;
    return this.save();
};

patientSchema.methods.assignNurse = async function(nurseId) {
    this.nurse = nurseId;
    return this.save();
};

patientSchema.methods.addFamilyMember = async function(familyId) {
    if (!this.family.includes(familyId)) {
        this.family.push(familyId);
    }
    return this.save();
};

patientSchema.methods.addAlert = async function(message, severity = "low") {
    this.alerts.push({ message, severity });
    await this.save();
    return this.alerts[this.alerts.length - 1];
};

patientSchema.methods.deactivateAlert = async function(alertId) {
    const alert = this.alerts.id(alertId);
    if (alert) {
        alert.active = false;
    }
    return this.save();
};

patientSchema.methods.addGoal = async function(title, description) {
    const newGoal = { title, description };
    this.goals.push(newGoal);
    await this.save();
    return this.goals[this.goals.length - 1];
};

patientSchema.methods.toggleGoalCompletion = async function(goalId) {
    const goal = this.goals.id(goalId);
    if(!goal){
        throw new Error("Goal not found");
    }

    if(goal.completed){
        //complete to not complete
        goal.completed = false;
        goal.completedAt = null;
    }else{ 
        //not complete to complete
        goal.completed = true;
        goal.completedAt = new Date();
    }

    await this.save();
    return goal;
};

// -------- Middleware --------

patientSchema.pre("save", function(next) {
    this.alerts = this.alerts.filter((alert) => alert.active);
    next();
});


// --- AutoIncrement ---
patientSchema.plugin(AutoIncrement, {
  id: "patient_id_seq",
  inc_field: "patientId",
  start_seq: 1,
});

patientSchema.plugin(AutoIncrement, {
  id: "room_id_seq",
  inc_field: "room",
  start_seq: 1,
});
  


// Attach passport-local-mongoose last.
patientSchema.plugin(plm);

module.exports = mongoose.model('Patient', patientSchema);