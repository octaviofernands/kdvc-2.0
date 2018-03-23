import {Router} from 'express'
import {simpleRegister} from './controllers/user-controller'
import multer from 'multer'

const ROUTER = Router()
const UPLOAD = multer({ dest: 'uploads/' })

ROUTER.post('/uploads', UPLOAD.single('image'), function (req, res, next) {
    // console.log(req.file)
    console.log(req.headers)
    res.json(req.file)
})
// (req, res) => {
//   console.log(req.file)
//   res.json(req.file)
// })

ROUTER.post('/user/signup', (req, res) => {
    simpleRegister(req).then((data) => {
        res.json(data)
    }).catch((error) => {
        res.status(400).json(error)
    })
})

export default ROUTER
