const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = (passport) => {
  // use local authentication
  passport.use(new LocalStrategy({ usernameField: 'username' },
    // check if an account with the username exists
    (username, password, done) => {
      User.findOne({ username: username.toLowerCase() },
        (err, user) => {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, { message: `${username} not found` });
          }
          if (!user.password) {
            return done(null, false, { message: `Please check your password again.` })
          }

          // check if the password is correct with the UserSchema's helper method
          user.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err) }
            if (isMatch) {
              return done(null, user)
            }
            return done(null, false, { message: `Invalid username or password.` })
          })
        })
    }
  ))

  passport.serializeUser((user, next) => {
    next(null, user.id)
  })

  passport.deserializeUser((id, next) => {
    User.findById(id, (err, user) => next(err, user))
  })
}