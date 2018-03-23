import Missing from '../models/Missing'
import moment from 'moment'

export const createMissing = (req) => {
    return new Promise((resolve, reject) => {
        let form = req.body
        let object = {
            alias: form.alias,
            age: form.age,
            sex: form.sex,
            slug: form.slug,

            location: {
                country: form.country,
                state: form.state,
                city: form.city,
                place: form.place,                
            },

            // geo: {
            //     type: {type: String},
            //     coordinates: [Number]
            // },
            dth_missing: form.dth_missing,
            weight: form.weight,
            height: form.height,
            description: form.description,
            created_at: moment().format(),

        }
        let missing = new Missing(object)
        missing.save().then((response) => {
            resolve(response)
        })
        .catch((response) => {
            reject(response)
        })
    })
}