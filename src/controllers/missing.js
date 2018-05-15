import Missing from '../models/Missing'
import moment from 'moment'
import getLocation from '../utils/get-location'

export const createMissing = (req) => {
  return new Promise((resolve, reject) => {
    let form = req.body
    let object = {
      alias: form.alias,
      age: form.age,
      sex: form.sex,
      slug: form.slug,
      
      location: {
        address: form.location.address,
        number: form.location.number,
        district: form.location.district,
        city: form.location.city,
        state: form.location.state
      },
      dth_missing: form.dth_missing,
      weight: form.weight,
      height: form.height,
      description: form.description,
      created_at: moment().format(),
      
    }
    
    getLocation(object.location).then((result) => {
      if(result) {
        object.geo = {
          type : 'Point',
          coordinates : [result.lng, result.lat]
        }
      }

      let missing = new Missing(object)

      missing.save().then((response) => {
        resolve(response)
      }).catch((response) => {
        reject(response)
      })
    })
  })
}