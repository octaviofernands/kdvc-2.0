import {Router} from 'express'
import {simpleRegister} from './controllers/user-controller'

const ROUTER = Router()

ROUTER.post('/user/signup', (req, res) => {
    simpleRegister(req).then((data) => {
        res.json(data)
    })
})

export default ROUTER