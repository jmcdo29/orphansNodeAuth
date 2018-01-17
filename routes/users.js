const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// Register
router.get('/register', (req,res,next)=>{
  res.render('register')
})

// Register User
router.post('/register', (req,res,next)=>{
  let email = req.body.email
  let name = req.body.name
  let username = req.body.username
  let pass = req.body.password
  let passConf = req.body.passwordConf

  // Validation
  req.checkBody('name', 'Name is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('username', 'Username is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('passwordConf', 'Passwords do not match').equals(req.body.password)

  var errors = req.validationErrors()

  if(errors){
    console.error('There are errors',errors)
    res.render('register',{errors:errors})
  }else{
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: pass
    })
    
    User.createUser(newUser, (err, user)=>{
      console.log('Trying to create user');
      if(err){
        req.flash('error_msg',err.message)
        res.render('register',{errors:err})
      } 
      console.log(user);
    })
    
    req.flash('success_msg', 'You are registered and can now login!')
    res.redirect('/users/login');
  } 
})

// Login
router.get('/login', (req,res,next)=>{
  res.render('login')
})

passport.use(new LocalStrategy(
  (username,password,done)=>{
    User.getUserByUsername(username, (err,user)=>{
      if(err){
        console.error(err)
        throw err
      }else if(!user){
        return done(null, false, {message:'Unknown user'})
      }
      User.comparePassword(password, user.password, (err, isMatch)=>{
        if(err){
          console.log(err)
          throw err
        }
        if(!isMatch){
          return done(null, false, {message:'Incorrect password'})
        }
        return done(null, user)
      })
    })
  }
))

passport.serializeUser((user,done)=>{
  done(null,user.id)
})

passport.deserializeUser((id,done)=>{
  User.getUserById(id, (err,user)=>{
    done(err, user)
  })
})

router.post('/login',
 passport.authenticate('local',{successRedirect:'/', failureRedirect:'/users/login',failureFlash:true}),
 (req,res,next)=>{
  res.redirect('/')
})

router.get('/logout',(req,res,next)=>{
  req.logout();
  req.flash('success_msg', 'You have successfully logged out')
  res.redirect('/users/login')
})

module.exports = router