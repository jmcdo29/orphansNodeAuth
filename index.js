const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('flash')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local'),Strategy
const mongo = require('mongodb')
const mongoose = require('mongoose')
const dbName = 'users'
const uri = process.env.MONGODB_URI || 'mongodb://heroku_8hxb5clq:mvdd0rsevpa3vpke010dkqffrd@ds127883.mlab.com:27883/heroku_8hxb5clq'
mongoose.connect(uri+'/'+dbName, {useMongoClient:true})
let db = mongoose.connection

const routes = require('./routes/index')
const users = require('./routes/users')

// Init App
const app = express()

// Set view Enigine
app.set('view engine','pug')

// BodyParser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())

// Set static Folder
app.use(express.static('./public'))

// Express Session Middleware
app.use(session({
  secret: 's3cret',
  saveUninitialized: true,
  resave: true
}))

// Passport Init
app.use(passport.initialize())
app.use(passport.session())

// Express Validator
app.use(expressValidator({
  errorFormatter: (params, msg, value)=>{
    let namespace = param.split('.')
    , root = namespcae.shift()
    , formParam = root

    while(namepace.length){
      formParam += '[' + namepace.shift() + ']'
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

// Connect Flash
app.use(flash())

//Global Vars
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// Router Middleware
app.use('/', routes)
app.use('/users', users)

app.set('port', (process.env.PORT || 3040))

app.listen(app.get('port'),()=>{
  console.log(`Server started on port ${app.get('port')}`)
})