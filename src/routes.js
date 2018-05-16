import {Router} from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import {simpleRegister} from './controllers/user'
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
  passport.authenticate('localLogin', {}, (err, user, info) => {
    if(err) {
      res.status(401).json(info)
    }

    let payload = {
      name: user.name,
      email: user.email,
      id: user.id
    }

    let token = jwt.sign(payload, process.env.JWT_SECRET)

    payload.token = token

    if(user) {
      res.json(payload)
    } else {
      res.status(401).json(info)
    }
  })(req, res)
})

// ROUTER.post('/missing/create', (req, res) => {
//     createMissing(req).then((data) => {
//         res.json(data)
//     })
// })

export default ROUTER


