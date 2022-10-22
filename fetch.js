let url = 'https://api.wheretheiss.at/v1/satellites/25544'

let issLat = document.querySelector('#iss-lat')
let issLong = document.querySelector('#iss-long')
let timeIssLocationFetched = document.querySelector('#time')

let update = 10000
let maxFailedAttempts = 3
let issMarker
let issIcon = L.icon({
    iconUrl: 'iss_icon.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25]
})


// Add the tile layer - roads, streets etc. Without this, nothing to see
let map = L.map('iss-map').setView([0, 0], 1)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copywrite">OpenStreetMap</a>',
}).addTo(map)

iss(maxFailedAttempts) //call function one time to start
    //setInterval(iss, update)  // 10 seconds
function iss(attempts) {
    fetch(url).then( (res) => {
        return res.json() //process response into JSON
    }).then( (issData) => {
        console.log(issData) //TODO-display data on web page
        let lat = issData.latitude
        let long = issData.longitude
        issLat.innerHTML = lat
        issLong.innerHTML = long

        //Create marker if it doesn't exist
        //move marker if it does exist

        if (!issMarker){  //create marker
            issMarker = L.marker([lat, long], {icon:issIcon}).addTo(map)
        } else{
            issMarker.setLatLng([lat, long])
        }

        // update the time element to the current date and time
        let now = Date()
        timeIssLocationFetched.innerHTML = `This data was fetched at ${now}`

    }).catch( (err) => {
        attempts -- //subtracts 1 from number of attempts
        console.log('ERROR!', err)
})
    // Recursive setTimeout function runs whether the fetch() worked or not
    // calls the iss function after a delay of update milliseconds to update position
        .finally( () => {
            setTimeout(iss, update, attempts)
        })
}