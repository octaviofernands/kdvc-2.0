import mongoose from 'mongoose'

const MISSING_SCHEMA = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  name: {type: String, index: true},
  alias: String,
  age: Number,
  sex: String,
  slug: {type: String, index: true},
  location: {
    address: String,
    number: Number,
    district: String,
    city: String,
    state: String
  },
  geo: {
    type: {type: String},
    coordinates: [Number]
  },
  dth_missing: Date,
  skin_color: { type: mongoose.Schema.Types.ObjectId, ref: 'skinColors' },
  eye_color: { type: mongoose.Schema.Types.ObjectId, ref: 'eyeColors' },
  hair_color: { type: mongoose.Schema.Types.ObjectId, ref: 'hairColors' },
  weight: Number,
  height: Number,
  description: String,
  docs: [
    /*{
      type: String,
      number: String
    }
    */
  ],
  has_mental_problems: Boolean,
  contact: [
    /*
    {
      type: String,
      value: String
    },
    {
      type: String,
      value: String
    }
    */
  ],
  poster: String,
  social: {
    facebook: {
      post_id: String
    },
    twitter: {
      post_id: String
    }
  },
  found: { type: Boolean, default: false },
  alive: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  page: {
    facebook: {
      posted: Boolean,
      dth_posted: Date,
      post_id: String,
      data: {}
    },
    twitter: {
      posted: Boolean,
      dth_posted: Date,
      post_id: String,
      data: {}
    },
    google_plus: {
      posted: Boolean,
      dth_posted: Date,
      post_id: String,
      data: {}
    },
    instagram: {
      posted: Boolean,
      dth_posted: Date,
      post_id: String,
      data: {}
    }
  },
  images: [
    /*
    {
      path: String,
      main: Boolean
    }
    */
  ],
  history: [
    {
      seen_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
      location: {
        country: String,
        state: String,
        city: String,
        place: String,
        lat: String,
        lng: String
      },
      dth_occurency: Date,
      created: Date,
      picture: String,
    }
  ],
  abuse: {
    reported: { type: Boolean, default: false },
    report: String,
    reported_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    dth_reported: Date,

  },
  removed: { type: Boolean, default: false }
})

MISSING_SCHEMA.index({geo: '2dsphere'})

export default mongoose.model('missings', MISSING_SCHEMA)