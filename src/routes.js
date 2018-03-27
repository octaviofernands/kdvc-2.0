import {Router} from 'express'
import {simpleRegister} from './controllers/user-controller'
import {createMissing} from './controllers/missing-controller'


const ROUTER = Router()

ROUTER.post('/user/signup', (req, res) => {
    simpleRegister(req).then((data) => {
        res.json(data)
    }).catch((error) => {
        res.status(400).json(error)
    })
})

ROUTER.post('/missing/create', (req, res) => {
    createMissing(req).then((data) => {
        res.json(data)
    })
})

export default ROUTER


