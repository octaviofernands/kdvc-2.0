import moment from 'moment'
import slug from 'slug'
import User from '../models/User'
import getLocation from '../utils/get-location'

export const simpleRegister = (req) => {
  return new Promise((resolve, reject) => {
    validateSimpleRegister(req).then(() => {
      return slugify(req.body.name)
    }).then((slug) => {
      let form = req.body
      let object = {
        name: form.name,
        email: form.email,
        password: form.password,
        slug: slug,
        location: {
          country: form.location.country,
          state: form.location.state,
          city: form.location.city
        },
        volunteer: form.volunteer ? true : false,
        created_at: moment().format(),
        active: true
      }

      let user = new User(object)
      user.password = user.generateHash(user.password)

      getLocation(object.location).then((result) => {
        if(result) {
          user.geo = {
            type : 'Point',
            coordinates : [result.lng, result.lat]
          }
        }

        user.save().then((response) => {
          // TODO: send mail
          resolve(response)
        }).catch((response) => {
          reject(response)
        })
      })
      
    }).catch((error) => {
      reject(error)
    })
  })
}

export const getUserPayload = (user) => {
  return {
    name: user.name,
    email: user.email,
    location: user.location,
    slug: user.slug,
    volunteer: user.volunteer
  }
}

export const facebookRegister = (user) => {

}

export const facebookRegister = (user) => {
  
}

function validateSimpleRegister(req) {
  req.checkBody('name', 'Nome inválido').notEmpty()
  req.checkBody('email', 'E-mail inválido').notEmpty()
  req.checkBody('email', 'E-mail existente').isEmailAvailable()
  req.checkBody('password', 'Senha inválida').notEmpty()
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

function slugify(value, attempt = 0) {
  let nameToSlug = value
  if(attempt > 0) {
    nameToSlug += ` ${attempt}`
  }

  let slugged = slug(nameToSlug, {lower: true})

  return User.findOne({slug: slugged, removed: false}).then(user => {
    if(!user) {
      return slugged
    } else {
      return slugify(value, ++attempt)
    }
  })
}