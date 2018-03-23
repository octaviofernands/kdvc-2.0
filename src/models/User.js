import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import moment from 'moment-timezone'

const USER_SCHEMA = new mongoose.Schema({
  name: String,
  email: { 
    type: String, 
    unique: false, 
    lowercase: true 
  },
  password: String,
  slug: String,
  location: {
    country: String,
    state: String,
    city: String,
    lat: Number,
    lng: Number
  },
  geo: {
    type: {type: String},
    coordinates: [Number]
  },
  locale: String,
  facebook: {
    user: String,
    userId: String,
    token: String,
    refreshToken: String,
    scope: [String],
    canPost: Boolean
  },
  twitter: {
    user: String,
    userId: String,
    token: String,
    tokenSecret: String,
    canPost: Boolean
  },
  picture: String,
  removed: { type: Boolean, default: false },
  volunteer: { type: Boolean, default: false },
  created: { type: Date, default: moment() },
  resetPasswordToken: String,
  resetPasswordExpires: Date
})

USER_SCHEMA.index({
  name: 'text',
  email: 'text',
  slug: 'text',
  geo: '2dsphere'
})

USER_SCHEMA.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

USER_SCHEMA.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.password)
}

export default mongoose.model('users', USER_SCHEMA)