import fetch from 'node-fetch'

export default function(location) {
  let urlAddr = encodeURIComponent(location.address + ' ' + location.number + ' ' + location.district + ' ' + location.city + ' ' + location.state);
  
  return new Promise((resolve, reject) => {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?&address=' + urlAddr)
      .then(res => res.json())
      .then((json) => {
        if(json.status === 'OK') {
          try {
            let location = json.results[0].geometry.location
            resolve(location)
          } catch(e) {
            resolve(false)
          }
        } else {
          resolve(false)
        }
      })
      .catch((err) => {
        resolve(false)
      })
  })
}