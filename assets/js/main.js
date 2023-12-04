console.log("I work");
// DOM variables
const currentWeatherDiv = document.querySelector("#currentWeather");
const today = document.querySelector('#today');
const forecastP = document.querySelectorAll('.forecastWeather');
// other variables
// accsess token for account jeff777AtUCB using jdnelson@berkeley.edu
const apiKey = '3c174ae84960a3091b2facf671fb569b';
let city;
let now = dayjs();
console.log(now);
let dateToday = now.format('(M/D/YYYY)');
// the &#x2600; is symbol for sun emoji. Need to figure out clouds, rain etc and move it to current weather and forecast divs
today.innerHTML = dateToday + " &#x2600;";


// API variables
// forecast API format
// api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid={API key}

//THIS WORKS
// let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=5501ff385f19fde5b8b984f2550fcae3`


let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=37.7749&lon=-122.4194&appid=5501ff385f19fde5b8b984f2550fcae3`
// appid=5501ff385f19fde5b8b984f2550fcae3

//currentWeather API format
// https://api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}

// let weatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent('San Francisco')},CA,US&appid=3c174ae84960a3091b2facf671fb569b`;

let weatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?q=San Francisco,ca,us&appid=5501ff385f19fde5b8b984f2550fcae3`

// appid=3c174ae84960a3091b2facf671fb569b

// let weatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?q=Sacramento,ca,us&appid=3c174ae84960a3091b2facf671fb569b`;

// fetches to api.openweathermap.org
// first to get current weather
fetch(weatherRequestUrl)
.then(function (response) {
  return response.json();
})
.then(function (data) {
    let cityData = data.name;
    let cityTemp =data.main.temp;
    let cityWind = data.wind.speed;
    let cityHumid = data.main.humidity;
    let cityLon = data.coord.lon;
    let cityLat = data.coord.lat;
  console.log(cityData, cityTemp, cityWind, cityHumid);
  console.log(cityLon, cityLat);
  currentWeatherFxn(cityData, cityTemp, cityWind, cityHumid);
  forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=5501ff385f19fde5b8b984f2550fcae3`;

  fetch(forecastUrl)
.then(function (response) {
  return response.json();
})
.then(function (data) {
    forecastWeatherFxn(data.list);
});
});
// fetch to get forecast weather

// fetch(forecastUrl)
// .then(function (response) {
//   return response.json();
// })
// .then(function (data) {
//     console.log(data);
// });
//functions
const currentWeatherFxn = (city, temp, wind, humid) => {
    const newHead = document.createElement("h2");
    const newTemp = document.createElement("p");
    const newWind = document.createElement("p");
    const newHumid = document.createElement("p");
    
    newHead.textContent = `${city} ${dateToday}`; 
    newTemp.textContent = `Temp: ${Math.round((temp - 273.15) * 1.8 + 32)} deg F`; 
    newWind.textContent = `Wind: ${Math.round(wind)} MPH`;
    newHumid.textContent = `Humidity: ${Math.round(humid)} %`; 

    currentWeatherDiv.append(newHead);
    currentWeatherDiv.append(newTemp);
    currentWeatherDiv.append(newWind);
    currentWeatherDiv.append(newHumid);
}
// currentWeatherFxn("San Francisco", 47, 5, 95);
// weather forcast fxn
const forecastWeatherFxn = (dataArr) => {
    console.log(dataArr);
    for(let i = 0; i < 5; i++) {
        const subDate = document.createElement("p");
        const subTemp = document.createElement("p");
        const subWind = document.createElement("p");
        const subHumid = document.createElement("p");
        // select icon to reflect actual weather
        let iconKey;
        switch (dataArr[i * 8 + 7].weather[0].main) {      
            case "Clear":
                iconKey = "🌞";
                break; 
            case "Clouds":
                iconKey = "🌥️";
                break;
            case "Snow":
                iconKey = "❄️";
                break;
            default:
                iconKey = "🌧️";
        }
        // add content to each paragraph
        subDate.textContent = `${dayjs(dataArr[i * 8 + 7].dt_txt).format('(M/D/YYYY)')} ${iconKey}`;
        subTemp.textContent = `Temp: ${Math.round((dataArr[i * 8 + 7].main.temp - 273.15) * 1.8 + 32)} deg F`;
        subWind.textContent = `Wind: ${Math.round(dataArr[i * 8 + 7].wind.speed)} MPH`;
        subHumid.textContent = `Humidity: ${Math.round(dataArr[i * 8 + 7].main.humidity)} %`;

        forecastP[i].append(subDate);
        forecastP[i].append(subTemp);
        forecastP[i].append(subWind);
        forecastP[i].append(subHumid);
    }
}
