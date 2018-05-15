import {Router} from 'express'
import passport from 'passport'
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
  passport.authenticate('local', {}, (err, user) => {
    if(err) {
      res.status(400).json({})
    }
    console.log('user', user)
    if(user) {
      res.json(user)
    }
  })
})

// ROUTER.post('/missing/create', (req, res) => {
//     createMissing(req).then((data) => {
//         res.json(data)
//     })
// })

export default ROUTER


