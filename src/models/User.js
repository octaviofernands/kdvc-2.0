import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import moment from 'moment-timezone'

const USER_SCHEMA = new mongoose.Schema({
  name: {type: String, index: true},
  email: { 
    type: String, 
    unique: true,
    lowercase: true,
    index: true
  },
  password: String,
  slug: {type: String, index: true},
  location: {
    country: String,
    state: String,
    city: String
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
    refresh_token: String,
    scope: [String],
    canPost: Boolean
  },
  twitter: {
    user: String,
    user_id: String,
    token: String,
    token_secret: String,
    canPost: Boolean
  },
  picture: String,
  removed: { type: Boolean, default: false },
  volunteer: { type: Boolean, default: false },
  created: { type: Date, default: moment() },
  reset_password_token: String,
  reset_password_expires: Date,
  email_confirm_hash: String,
  confirmed_email: { type: Boolean, default: false }
})

USER_SCHEMA.index({geo: '2dsphere'})

USER_SCHEMA.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

USER_SCHEMA.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

export default mongoose.model('users', USER_SCHEMA)