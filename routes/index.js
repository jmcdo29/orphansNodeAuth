const express = require('express')
const router = express.Router()

// Get Homepage
router.get('/', ensureAuth, (req,res,next)=>{
  res.render('index')
})


function ensureAuth(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }else{
    req.flash('error_msg','You are not logged in')
    res.redirect('/users/login')
  }
}
module.exports = router