import express from 'express'
import mongoose from 'mongoose'
import expressValidator from 'express-validator'
import logger from 'morgan'
import session from 'express-session'
import connectMongo from 'connect-mongo'

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URL)

const MONGO_STORE = connectMongo(session)

const ROUTER = express.Router()
const APP = express()

APP.use(logger('dev'))
APP.use(session({
  store: new MONGO_STORE({ mongooseConnection: mongoose.connection }),
  secret: 'kdvcvader',
  'path': '/',
  cookie: {
    secure: false,
    httpOnly: false,
    domain: 'kdvc.vc'
  },
  resave: false,
  saveUninitialized: false
}))

APP.set('port', 3000)
APP.listen(APP.get('port'), () => {
  console.log('KDVC running on port %d in %s mode', APP.get('port'), 'dev')
})