import {Router} from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import {simpleRegister, getUserPayload} from './controllers/user'
import {createMissing} from './controllers/missing'

const ROUTER = Router()

ROUTER.post('/user/signup', (req, res) => {
  simpleRegister(req).then((data) => {
    res.json(data)
  }).catch((error) => {
    res.status(400).json(error)
  })
})

ROUTER.post('/login', (req, res) => {
  passport.authenticate('local', {}, (err, user, info) => {
    if(err) {
      res.status(401).json(info)
    }

    let payload = getUserPayload(user)
    let token = jwt.sign(payload, process.env.JWT_SECRET)

    payload.token = token

    if(user) {
      res.json(payload)
    } else {
      res.status(401).json(info)
    }
  })(req, res)
})

ROUTER.get('/user/self', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(getUserPayload(req.user))
})

ROUTER.get('/auth/facebook', passport.authenticate('facebook', { 
  scope: ['email', 'user_link', 'user_birthday', 'user_gender', 'user_location', 'publish_actions', 'user_photos'] 
}))

ROUTER.get('/auth/facebook/callback', passport.authenticate('facebook'), (req, res) => {
  res.json({})
})

// ROUTER.post('/missing/create', (req, res) => {
//     createMissing(req).then((data) => {
//         res.json(data)
//     })
// })

export default ROUTER


