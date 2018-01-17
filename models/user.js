const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

let userSchema = mongoose.Schema({
  username:{
    type: String,
    index: true,
    unique: true
  },
  password:{type: String},
  email: {
    type: String,
    unique: true
  },
  name: {type: String}
})

let User = module.exports = mongoose.model('User', userSchema)

module.exports.createUser = (newUser, callback)=>{
  bcrypt.genSalt(10, (err,salt)=>{
    console.log('generating salt',salt)
    bcrypt.hash(newUser.password, salt, (err, hash)=>{
      if(err){
        console.error(err)
      }
      console.log('Hashing password',hash)
      newUser.password = hash
      newUser.save(callback)
    })
  })
}

module.exports.getUserByUsername = (username, callback)=>{
  let query = {username:username}
  User.findOne(query,callback)
}

module.exports.comparePassword = (pass, userPass, callback)=>{
  bcrypt.compare(pass, userPass, (err, isMatch)=>{
    if(err){
      throw err
    }
    callback(null, isMatch)
  })
}

module.exports.getUserById = (id, callback)=>{
  User.findById(id, callback)
}