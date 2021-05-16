const express = require('express')
const router = express.Router()
const {
  ensureAuth,
  ensureGuest
} = require('../middleware/auth')
const todosController = require('../controllers/todosController')

// @desc    Get the list stuff to do
// @route   GET /

module.exports = router