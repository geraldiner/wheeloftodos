const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')
const mainController = require('../controllers/mainController')
const authController = require('../controllers/authController')

// @desc    Get main index page
// @route   GET /
router.get('/', mainController.getIndex)

// @desc    Get main index page
// @route   GET /
router.get('/dashboard', mainController.getDashboard)

// @desc    Get login page
// @route   GET /login
router.get('/login', authController.getLogin)

// @desc    Get signup page
// @route   GET /signup
router.get('/signup', authController.getSignup)

// @desc    Get login page
// @route   POST /login
router.post('/login', authController.postLogin)

// @desc    Get signup page
// @route   POST /signup
router.post('/signup', authController.postSignup)

// @desc    Logout user
// @route   GET /logout
router.get('/logout', authController.getLogout)

module.exports = router