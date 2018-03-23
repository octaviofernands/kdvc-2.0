import {Router} from 'express'
import {simpleRegister} from './controllers/user-controller'

const ROUTER = Router()

ROUTER.post('/user/signup', (req, res) => {
    simpleRegister(req).then((data) => {
        res.json(data)
    }).catch((error) => {
        res.status(400).json(error)
    })
})

export default ROUTER