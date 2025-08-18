const path = require('path')
const cors = require('cors')
const patientRoutes = require(path.join(__dirname,'routes','patients'))
const apiRoutes = require(path.join(__dirname,'routes','api'))
const ApiError = require(path.join(__dirname,'utils','ApiError'))

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

app.engine('ejs',ejsMate)
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'public')))


app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));


const sessionConfig = {
    secret : 'thisisasecret',
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7 ,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly : true
    }
}

app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.use('doctor-local', new LocalStrategy(Doctor.authenticate()));
passport.use('nurse-local', new LocalStrategy(Nurse.authenticate()));
passport.use('patient-local', new LocalStrategy(Patient.authenticate()));
passport.use('family-local', new LocalStrategy(Family.authenticate()));

// Shared serialize logic
passport.serializeUser((user, done) => {
    // Save both the user ID and their model type
    done(null, { id: user._id, role: user.constructor.modelName });
  });
  
  // Shared deserialize logic
  passport.deserializeUser(async (data, done) => {
    const { id, role } = data;
  
    let Model;
    if (role === 'Doctor') Model = Doctor;
    else if (role === 'Nurse') Model = Nurse;
    else if (role === 'Patient') Model = Patient;
    else if (role === 'Family') Model = Family;
    else return done(new Error('Unknown user role'));
  
    try {
      const user = await Model.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
});


app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currUser = req.user
    next()
})




app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))




app.use('/patients',patientRoutes)
app.use('/api',apiRoutes)



app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/login',(req,res)=>{
    res.render('login')
})


app.post('/login', (req, res, next) => {
    const model = req.body.role

    console.log(req.body)
  
    // Ensure model exists and is valid
    if (!model || !['Doctor', 'Patient', 'Family', 'Nurse'].includes(model)) {
        req.flash('error', 'Invalid role selected');
        return res.redirect('/login');
    }

    // Dynamically authenticate using the selected model's strategy
    passport.authenticate(`${model.toLowerCase()}-local`, { failureRedirect: '/login', failureFlash: true }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        
        if (!user) {
            req.flash('error', 'Invalid username or password or role');
            return res.redirect('/login');
        }

        // Log the user in and proceed to next logic
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            
            // Redirect to the user's dashboard based on the model
            if (model === 'Doctor') {
                return res.send('Doctor logged in')
            } else if (model === 'Patient') {
                return res.send('Patient logged in')
            } else if (model === 'Family') {
                return res.send('Family logged in')
            } else if (model === 'Nurse') {
                return res.send('Nurse logged in')
            }
        });
    })(req, res, next);
});

app.get('/error',(req,res,next)=>{
    next(new ApiError(444,"CUSTOM ERROR WORKING"))
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        data: err.data || null
    });
});

module.exports=app