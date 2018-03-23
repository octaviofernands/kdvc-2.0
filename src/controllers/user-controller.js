import User from '../models/User'
import moment from 'moment'

export const simpleRegister = (req) => {
    return new Promise((resolve, reject) => {
        validate(req).then(() => {
            let form = req.body
            let object = {
                name: form.name,
                email: form.email,
                password: form.password,
                location: {
                    country: form.country,
                    state: form.state,
                    city: form.city,
                    zipCode: form.zipCode
                },
                volunteer: form.volunteer == 1 ? true : false,
                created_at: moment().format(),
                active: true
            }

            let user = new User(object)
            user.password = user.generateHash(user.password);

            user.save().then((response) => {
                resolve(response)
            }).catch((response) => {
                reject(response)
            })
        }).catch((error) => {
            reject(error)
        })
    })
}

function validate(req) {

    req.checkBody('name', "Nome inválido").notEmpty()
    req.checkBody('email', "E-mail inválido").notEmpty()
    req.checkBody('email', "E-mail existente").isEmailAvailable()
    req.checkBody('password', "Senha inválida").notEmpty()
    let promise = new Promise((resolve, reject) => {
        req.getValidationResult().then((result) => {
          let errors = result.useFirstErrorOnly().array()
          if(errors.length > 0) {
            reject(errors)
          } else {
            resolve(true)
          }
        })
    })

    return promise
}