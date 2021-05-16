const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')

module.exports = {
  getLogin: (req,res) => {
    if (req.user) {
      return res.redirect('/dashboard')
    }
    const locals = {
      title: 'Login',
      layout: '../views/layouts/main.ejs'
    }
    res.render('login.ejs',locals)
  },
  getSignup: (req,res) => {
    if (req.user) {
      return res.redirect('/dashboard')
    }
    const locals = {
      title: 'Signup',
      layout:'../views/layouts/main.ejs'
    }
    res.render('signup.ejs', locals)
  },
  postLogin: (req,res,next) => {
    try {
      const validationErrors = []
      if (validator.isEmpty(req.body.password)) {
        validationErrors.push({ message: 'Please enter your password' })
      }
      // if there are any validation errors from above, display and redirect to the sign up apge
      if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect('../login')
      }

      passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err) }
        if (!user) {
          req.flash('errors', info)
          return res.redirect('/login')
        }
        req.logIn(user, (err) => {
          if (err) { return next(err) }
          req.flash('success', { message: 'Successful login' })
          res.redirect(req.session.returnTo || '/dashboard')
        })
      })(req, res, next)
    } catch (error) {
      console.error(error)
    }
  },
  postSignup: (req, res, next) => {
    try {
      const validationErrors = []
      // validation for a password that is >= 8 characters
      if (!validator.isLength(req.body.password, { min: 8 })) {
        validationErrors.push({ message: 'Password must be at least 8 characters long' })
      }
      // validation that the viewer enter the password correctly twice
      if (req.body.password !== req.body.confirmPassword) {
        validationErrors.push({ message: 'Passwords do not match' })
      }
      // if there are any validation errors from above, display and redirect to the sign up apge
      if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect('../signup')
      }

      User.findOne({ username: req.body.username },
        (err, existingUser) => {
          if (err) { return next(err) }
          if (existingUser) {
            req.flash('errors', { message: 'An account with that username already exists.' })
            return res.redirect('../signup')
          }
          const user = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            password: req.body.password,
          })
          user.save((err) => {
            if (err) { return next(err) }
            req.logIn(user, (err) => {
              if (err) { return next(err) }
              res.redirect('/dashboard')
            })
          })
        })
    } catch (err) {
      console.error(err)
    }
  },
  getLogout: (req, res) => {
    req.logout()
    req.session.destroy((err) => {
      if (err) {
        console.log('Error: Failed to destroy during logout.', err)
      }
      req.user = null
      res.redirect('/')
    })
  }
}