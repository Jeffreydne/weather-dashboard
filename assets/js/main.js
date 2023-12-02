console.log("I work");
// DOM variables
const currentWeatherDiv= document.querySelector("#currentWeather");
// other variables
// accsess token for account jeff777AtUCB using jdnelson@berkeley.edu
const apiKey = '3c174ae84960a3091b2facf671fb569b';
let city;

// https://api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}

// let requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent('San Francisco')},CA,US&appid=3c174ae84960a3091b2facf671fb569b`;

let requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=San Francisco,ca,us&appid=3c174ae84960a3091b2facf671fb569b`

// let requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=Sacramento,ca,us&appid=3c174ae84960a3091b2facf671fb569b`;
fetch(requestUrl)
.then(function (response) {
  return response.json();
})
.then(function (data) {
    let cityData = data
  console.log(cityData);
});