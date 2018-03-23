import User from '../models/User'
import moment from 'moment'

export const simpleRegister = (req) => {
    return new Promise((resolve, reject) => {
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
        user.save().then((response) => {
            resolve(response)
        })
        .catch((response) => {
            reject(response)
        })
    })
}