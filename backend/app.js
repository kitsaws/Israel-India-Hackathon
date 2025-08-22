//CORE MODULES
const path = require('path');
//#endregion

//THIRD-PARTY MODULES
const callRoutes = require(path.join(__dirname,'routes','callRoutes'))
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
require('colors');
//#endregion

//INITIALIZATION
const app = express();
const PORT = 3000;
//#endregion

//MODELS
const Doctor = require(path.join(__dirname, 'models', 'doctor'));
const Patient = require(path.join(__dirname, 'models', 'patient'));
const Nurse = require(path.join(__dirname, 'models', 'nurse'));
const Family = require(path.join(__dirname, 'models', 'family'));
//#endregion

//SESSION STORE
const MemoryStore = session.MemoryStore;
const memoryStore = new MemoryStore();
//#endregion

//MIDDLEWARES & CONFIG
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const sessionConfig = {
    store: memoryStore,
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: false
    }
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//#endregion

//PASSPORT CONFIG
passport.use('doctor-local', new LocalStrategy(Doctor.authenticate()));
passport.use('nurse-local', new LocalStrategy(Nurse.authenticate()));
passport.use('patient-local', new LocalStrategy(Patient.authenticate()));
passport.use('family-local', new LocalStrategy(Family.authenticate()));

passport.serializeUser((user, done) => {
    done(null, { id: user._id, role: user.constructor.modelName });
});

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
//#endregion

//GLOBAL VARIABLES
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});
//endregion

//ROUTES

const { createRouter } = require(path.join(__dirname, 'routes', 'api'));
const apiRoutes = createRouter(memoryStore);
const patientRoutes = require(path.join(__dirname, 'routes', 'patients'));

app.use('/patients', patientRoutes);
app.use('/api/call',callRoutes)
app.use('/api', apiRoutes);
//#endregion

//BASIC ROUTES
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res, next) => {
    const model = req.body.role;
    if (!model || !['Doctor', 'Patient', 'Family', 'Nurse'].includes(model)) {
        req.flash('error', 'Invalid role selected');
        return res.redirect('/login');
    }

    passport.authenticate(`${model.toLowerCase()}-local`, { failureRedirect: '/login', failureFlash: true }, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash('error', 'Invalid username or password or role');
            return res.redirect('/login');
        }

        req.logIn(user, (err) => {
            if (err) return next(err);
            res.send(`${model} logged in`);
        });
    })(req, res, next);
});

app.get('/error', (req, res, next) => {
    const ApiError = require(path.join(__dirname, 'utils', 'ApiError'));
    next(new ApiError(444, "CUSTOM ERROR WORKING"));
});
//#endregion

//ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        data: err.data || null
    });
});
//#endregion

module.exports = app;
