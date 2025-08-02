const path = require('path')
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
app.use(cookieParser())


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

// passport.use(new LocalStrategy(User.authenticate()))
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currUser = req.user   
    next()
})




app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


mongoose.connect('mongodb://localhost:27017/swizz')
    .then(()=>{
        console.log('Connected to the DB'.bgWhite.black)
    })
    .catch(err=>{
        console.log('DB not connected'.red)
    })

app.listen(PORT,()=>{
    console.log(`Server live on http://localhost:${PORT}`.bgWhite.black)
})


app.get('/',(req,res)=>{
    res.send('<h1>Home</h1>')
})