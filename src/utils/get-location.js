import fetch from "node-fetch"

export default function(location) {
  let urlAddr = encodeURIComponent(location.address + ' ' + location.number + ' ' + location.district + ' ' + location.city + ' ' + location.state);
  console.log(urlAddr)
  return fetch('https://maps.googleapis.com/maps/api/geocode/json?&address=' + urlAddr)
    .then((res) => { return res.json() })
    .then((json) => {
      console.log(json)
      if(json.status === 'OK') {
        try {
          let location = json.results[0].geometry.location;
          return location;
        } catch(e) {
          return false
        }
      } else {
        return false
      }
    })
    .catch((err) => {
      return false
    })
}