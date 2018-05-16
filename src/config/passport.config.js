import User from '../models/User'

import {Strategy as LocalStrategy} from 'passport-local'
import {Strategy as FacebookStrategy} from 'passport-facebook'
import {Strategy as TwitterStrategy} from 'passport-twitter'
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'

export default (passport) => {

  const JWT_OPTIONS = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.JWT_SECRET
  }

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(null, user)
    })
  })

  passport.use('facebook', new FacebookStrategy({
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: process.env.FB_CALLBACK_URL,
      profileFields: ['id','name','email','location','gender','birthday', 'picture']
    }, (accessToken, refreshToken, profile, done) => {
      console.log('accessToken', accessToken)
      console.log('refreshToken', refreshToken)
      console.log('profile', profile)
      return done(null, profile)
    }
  ))

  passport.use('local', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    }, (req, email, password, done) => {
      User.findOne({email: email, removed: false})
        .then((user) => {
          if(!user) {
            return done(null, false, {path: 'login_user_not_found', msg: 'User not found'})
          }

          if(!user.validPassword(password)) {
            return done(null, false, {path: 'login_invalid_credentials', msg: 'Invalid credentials'})
          }

          return done(null, user)
        })
    }
  ))

  passport.use('jwt', new JwtStrategy(JWT_OPTIONS, (jwtPayload, done) => {
    User.findOne({email: jwtPayload.email})
      .then((user) => {
        if(!user) return done(null, false)
        
        let objUser = user
        return done(null, objUser)
      })
      .catch((err) => {
        return done(err)
      })
  }))

}