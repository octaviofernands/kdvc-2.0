import moment from 'moment'
import slug from 'slug'
import uuidv1 from 'uuid/v1'
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
        gender: form.gender,
        volunteer: form.volunteer ? true : false,
        created_at: moment().format(),
        email_confirm_hash: uuidv1(),
        active: true
      }

      let user = new User(object)
      user.password = user.generateHash(user.password)

      getLocation(object.location).then((result) => {
        if(result && result.geo) {
          user.geo = {
            type : 'Point',
            coordinates : [result.geo.lng, result.geo.lat]
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

export const isUserFullRegistered = (user) => {
  return 
    user.password && 
    user.password !== '' &&
    user.volunteer !== undefined &&
    user.location && 
    user.location.city
}

export const facebookCallbackHandler = (user) => {
  return new Promise((resolve, reject) => {
    User.findOne({'facebook.userId': user.id, removed: false})
    .then((dbUser) => {
      if(dbUser) {
        // user exists
      } else {
        // register user
        let fullName = `${user._json.first_name} ${user._json.last_name}`
        let birthdate = user._json.birthday ? moment(user._json.birthday, 'MM/DD/YYYY').format('YYYY-MM-DD') : null
        let email = user._json.email

        isUserEmailAvailable(email)
          .then(() => {
            slugify(fullName)
              .then((slug) => {
                let objUser = {
                  name: fullName,
                  email: user._json.email || '',
                  slug: slug,
                  facebook: {
                    user_id: user.id,
                    access_token: user.access_token
                  },
                  gender: user.gender === 'male' ? 'M' : user.gender === 'female' ? 'F' : 'O',
                  birthdate: birthdate,
                  picture: user.photos[0].value,
                  location: {},
                  email_confirm_hash: uuidv1()
                }

                let objLocation = {
                  address: `${user._json.location.name}`
                }

                getLocation(objLocation).then((result) => {
                  if(result && result.geo) {
                    objUser.geo = {
                      type : 'Point',
                      coordinates : [result.geo.lng, result.geo.lat]
                    }
                  }

                  objUser.location.country = result.country
                  objUser.location.state = result.state
                  objUser.location.city = result.city

                  let newUser = new User(objUser)
                  newUser.save().then((response) => {
                    // TODO: send mail
                    resolve(response)
                  }).catch((response) => {
                    reject(response)
                  })
                })
              })
          })
          .catch(() => {
            // email already registered
          })
        
      }
    })
  })
}

export const isUserEmailAvailable = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({email: email})
    .then(user => {
      if(user) {
        reject()
      } else {
        resolve()
      }
    })
  })
}

export const facebookRegister = (user) => {

}

export const facebookRegisterCallback = (user) => {
  
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