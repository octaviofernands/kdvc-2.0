import User from '../models/User'
import { isUserEmailAvailable } from '../controllers/user'

export default {
  customValidators: {
    isEmailAvailable: (email) => {
      return isUserEmailAvailable(email)
    }
  }
}