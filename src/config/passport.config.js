import User from '../models/User'

import {Strategy as LocalStrategy} from 'passport-local'
import {Strategy as FacebookStrategy} from 'passport-facebook'
import {Strategy as TwitterStrategy} from 'passport-twitter'

export default (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(null, user)
    })
  })

  passport.use('local', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    }, (req, email, password, done) => {
      console.log(123)
      User.findOne({email: email, removed: false})
        .then((user) => {
          console.log('login User', user)
          if(!user) {
            return done(null, false, {path: 'login_user_not_found', msg: 'User not found'})
          }

          if(!user.validPassword(password)) {
            return done(null, false, {path: 'login_invalid_credentials', msg: 'Invalid credentials'})
          }

          return done(null, user)
        })
    })
  )
}