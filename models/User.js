const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  password: {
    type: String
  }
})

// Hash the password before it's saved
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) { return next(err) }
      this.password = hash
      next()
    })
  })
  let firstLetter = this.firstName.slice(0, 1).toUpperCase()
  let restOfName = this.firstName.slice(1)
  this.firstName = firstLetter + restOfName
})

// Helper method to validate user's password
UserSchema.methods.comparePassword = function comparePassword(plaintext, callback) {
  bcrypt.compare(plaintext, this.password, (err, isMatch) => {
    callback(err, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)