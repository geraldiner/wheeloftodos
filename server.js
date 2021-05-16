const path = require('path')
const express = require('express')
const expressLayouts = require('express-layouts')
const session = require('express-session')
const flash = require('express-flash')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const MongoStore = require('connect-mongo')

dotenv.config({path: './config/config.env'})
require('./config/passport')(passport)
const app = express()
connectDB()

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Set up template with ejs
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.set("trust proxy",1)

// Session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    mongooseConnection: mongoose.connection
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 //one day
  }
}))
app.use(flash())

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/', require('./routes/main'))
app.use('/stufftodo', require('./routes/todos'))

app.listen(process.env.PORT, console.log(`Server running on ${process.env.PORT}`))