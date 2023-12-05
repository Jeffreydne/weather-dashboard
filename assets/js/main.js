// DOM variables
const currentWeatherDiv = document.querySelector("#currentWeather");
const today = document.querySelector('#today');
// forecastP is an array of the 5 divs that will contain each of the 5 days of the 5-day forecast
const forecastP = document.querySelectorAll('.forecastWeather');
const cityInput = document.querySelector('#cityName');
const submitBtn = document.querySelector('#submitBtn');
const cityDiv = document.querySelector('#cityList');
// other variables
// accsess token for account jeff777AtUCB using jdnelson@berkeley.edu
const apiKey = '3c174ae84960a3091b2facf671fb569b';
let city;
let now = dayjs();
console.log(now);
// get & format today's date and add it to header
let dateToday = now.format('(M/D/YYYY)');
today.innerHTML = dateToday;



// fetches are made to api.openweathermap.org
// forecast API format
// api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid={API key}

//currentWeather API format
// https://api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}

// API variables
// initial forecast and Weather request URLs are for San Francisco as default city on load of page for the 1st time
let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=37.7749&lon=-122.4194&appid=${apiKey}`

let weatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?q=San Francisco,ca,us&appid=${apiKey}`

// functions

// getWeatherFxn first fetch is to get current weather for indicated city and add that to DOM then within this will do 2nd fetch using the obtained longitude and latitude to also fetch 5 day forecast for indicated city and put that info into DOM
const getWeatherFxn = () => {
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
        let cityWeather = data.weather[0].main;
        //call currentWeatherFxn to load current weather data obtained from api into DOM
        currentWeatherFxn(cityData, cityTemp, cityWind, cityHumid, cityWeather);
        // set new forcast URL using the latitude and longitude of chosen city (which is provided in data object of that city). This info is required for fetch of forecast data 
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=5501ff385f19fde5b8b984f2550fcae3`;
        // using new forecastUrl fetch forecast data of chosen (or default) city. This is part of getWeatherFxn so that 5-day forecast is always of same city as current weather
        fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            forecastWeatherFxn(data.list);
        });
    });
}
// on initial load call getWeatherFxn() to load weather for San Francisco into DOM as default
getWeatherFxn();

// getWeatherFxn will call currentWeatherFxn to load the current weather info for the chosen (or default) city into the currentWeatherDiv 
const currentWeatherFxn = (city, temp, wind, humid, icon) => {
    // First clear current contents then add an h2 for city name an h4 for text "current Weather: and <p> elements for temp, wind and humidity", 
    currentWeatherDiv.textContent = '';
    const newHead = document.createElement("h2");
    const h4 = document.createElement('h4');
    const newTemp = document.createElement("p");
    const newWind = document.createElement("p");
    const newHumid = document.createElement("p");
    // set icon to reflect actual weather using description from api
    let iconKey;
    switch (icon) {      
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
    // set paragraph content for current weather for selected city
    newHead.textContent = `${city} ${dateToday} ${iconKey}`; 
    h4.textContent = `Current Weather:`;
    newTemp.textContent = `Temp: ${Math.round((temp - 273.15) * 1.8 + 32)} deg F`; 
    newWind.textContent = `Wind: ${Math.round(wind)} MPH`;
    newHumid.textContent = `Humidity: ${Math.round(humid)} %`; 
// append each element to the DOM
    currentWeatherDiv.append(newHead);
    currentWeatherDiv.append(h4);
    currentWeatherDiv.append(newTemp);
    currentWeatherDiv.append(newWind);
    currentWeatherDiv.append(newHumid);
}
// weather forcast fxn to dynamically add in the 5-day forecast for the chosen city. A for loop is used to clear each element of existing content, then 5 paragraphs added with the forecast data for each of the next 5 days
const forecastWeatherFxn = (dataArr) => {
    console.log(dataArr);
    for(let i = 0; i < 5; i++) {
        forecastP[i].textContent = '';
        const subDate = document.createElement("p");
        const subIcon = document.createElement("p");
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
        // add content to each paragraph. Since forecast data are given in 3 hour increments (8 forecasts per 24 hour period) will use i*8+7 to get the forecast 24, 48, 72, 96 and 120 hours from current time. Use dayjs() to format date
        subDate.textContent = `${dayjs(dataArr[i * 8 + 7].dt_txt).format('(M/D/YYYY)')}`;
        // weather description from api converted into the appropriate icon immediately above
        subIcon.textContent = `${iconKey}`;
        //convert temp Kelvin into fahrenheit
        subTemp.textContent = `Temp: ${Math.round((dataArr[i * 8 + 7].main.temp - 273.15) * 1.8 + 32)} deg F`;
        subWind.textContent = `Wind: ${Math.round(dataArr[i * 8 + 7].wind.speed)} MPH`;
        subHumid.textContent = `Humidity: ${Math.round(dataArr[i * 8 + 7].main.humidity)} %`;
        //append each into DOM
        forecastP[i].append(subDate);
        forecastP[i].append(subIcon);
        forecastP[i].append(subTemp);
        forecastP[i].append(subWind);
        forecastP[i].append(subHumid);
    }
}
// function to get all city names previously selected by user and then display the most recent 10 in the DOM
let displayPreviousCities = () => {
    // When 1st called on loading website there will be no cities in local storage so no change will be made to DOM
    if(!localStorage.cityArr) {
        return;
    } 
    // if cityArr exists in localStorage parse it into an array of objects
    arrToPost = JSON.parse(localStorage.getItem('cityArr'));   
    //if length is 10 or more only post the most recent 10 cities saved by using for loop starting at last city saved
    if (arrToPost.length > 9) {
        for(let i = arrToPost.length - 1; i > arrToPost.length - 11; i--) {
            const newCity = document.createElement('h3');
            newCity.textContent = `${arrToPost[i].cityName}`;
            cityDiv.append(newCity);
        }
    } else {
        // if there are between 1 and 9 cities in localStorage all cities will be displayed by using for loop starting at last city saved
        for(let j = arrToPost.length - 1; j > -1; j--) {
            const newCity = document.createElement('h3');
            newCity.textContent = `${arrToPost[j].cityName}`;
            cityDiv.append(newCity);
        }
    }
}
// function to store city name in local storage & display it in DOM
const storeCityName = (cityToStore) => {
    let storageObj = {
        cityName: `${cityToStore}`
    }
    // existingCityArr will get an array of onjects from local storage, or if empty will add San Francisco as only member of the array
    const existingCityArr = JSON.parse(localStorage.getItem('cityArr')) || [{"cityName" : "San Francisco"}];
    // check to see if city already exists in localStorage and if so do not store again.
    for(let i = 0; i < existingCityArr.length; i++) {
        if(cityToStore === existingCityArr[i].cityName) {
            return;
        }
    }
    // if current city is a new city add it as an object to current array and set that array as the new localStorage array
    const newCityArr = [...existingCityArr, storageObj];
    localStorage.setItem('cityArr', JSON.stringify(newCityArr));
    // clear cityDiv of current contents then call displayPreviousCities() to fill this DIV with all cities in localStorage (most recently stored city will be on top).
    cityDiv.innerHTML = "";
    displayPreviousCities();
}
// fxn to get any city names in local storage. The fxn is called here to add them to the DOM on load of document
displayPreviousCities();
// Event Listeners
//event listener for submit button. On submit, the value inside the text input will be stored in the variable city, the text input will be cleared, the weather request URL will be made to include the city name, then 2 functions are called. First getWeatherFxn() will put the indicated cities weather info into DOM using fxn above and second storeCityName() will add the indicated city into localStorage 
submitBtn.addEventListener('click', function (event) {
    event.preventDefault();
    city = cityInput.value;
    cityInput.value = '';
    weatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    getWeatherFxn();
    storeCityName(city);
  });
// event listener for stored cities. Uses event delegation to listen for any event in #cityList div. When a city h3 is clicked on, the innerText of that element will be added to city variable and then getWeatherFxn is called to display weather info for that city
cityDiv.addEventListener("click", (event) => {
    event.preventDefault;
    city = event.target.innerText;
    weatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    getWeatherFxn(); 
})