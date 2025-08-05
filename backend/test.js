const path = require('path')
const cors = require('cors')
const patientRoutes = require(path.join(__dirname,'routes','patients'))
const apiRoutes = require(path.join(__dirname,'routes','api'))

const Doctor = require(path.join(__dirname,'models','doctor'))
const Patient = require(path.join(__dirname,'models','patient'))
const Nurse = require(path.join(__dirname,'models','nurse'))
const Family = require(path.join(__dirname,'models','family'))


const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const flash = require('connect-flash')
const express = require('express')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const colors = require('colors')
const PORT = 3000
const app = express()





mongoose.connect('mongodb://localhost:27017/loadout')
    .then(()=>{
        console.log('Connected to the DB')
    })
    .catch(err=>{
        console.log('DB not connected')
    })


async function findPatient() {
    const k = await Patient.find({ name: 'karam' }).populate('nurse').populate('doctor');
    console.log(k);
}
    
findPatient();
    