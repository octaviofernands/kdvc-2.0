import fetch from 'node-fetch'

export default function(location) {
  let urlAddr = encodeURIComponent(location.address + ' ' + location.number + ' ' + location.district + ' ' + location.city + ' ' + location.state);
  
  return new Promise((resolve, reject) => {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?&address=' + urlAddr)
      .then(res => res.json())
      .then((json) => {
        console.log('json', json)
        if(json.status === 'OK') {
          try {
            let cityObj = json.results[0].address_components.filter((item) => {
              return item.types.indexOf('administrative_area_level_2') > -1
            })

            let stateObj = json.results[0].address_components.filter((item) => {
              return item.types.indexOf('administrative_area_level_1') > -1
            })

            let countryObj = json.results[0].address_components.filter((item) => {
              return item.types.indexOf('country') > -1
            })

            let location = {
              geo: json.results[0].geometry.location,
              city: cityObj[0].short_name,
              state: stateObj[0].short_name,
              country: countryObj[0].short_name
            }

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