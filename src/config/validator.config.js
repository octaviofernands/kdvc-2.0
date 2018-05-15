import User from '../models/User'

export default {
  customValidators: {
    isEmailAvailable: (email) => {
      return new Promise((resolve, reject) => {
        User.findOne({email: email})
        .then(user => {
          if(user) {
            reject()
          } else {
            resolve()
          }
        })
      });
    }
  }
}