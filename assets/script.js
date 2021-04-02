// Set global variables
var date = moment().format("ll");
var searchHandler = document.querySelector("#search-form");
var searchBar = document.querySelector("#search-bar");
var responseContainer = document.querySelector("#current-result");
var deleteBtn = document.getElementById("dlt-btn");

// Current temperature variables
const cityTempDiv = document.createElement('div');
const cityDetailsDiv = document.createElement('div');
var cityNameEl = document.createElement("div");
var currentTempEl = document.createElement("div");
var humidityEl = document.createElement("div");
var windEl = document.createElement("div");
var uvIndexContainer = document.createElement("div");
var uvIndexEl = document.createElement("h4");
var uvValueDisplay = document.createElement("div");

// 5 day forecast variables
var forecastContainer = document.querySelector("#forecast-result");
var searchWrapperEl = document.querySelector("#search-wrapper");
var searchHistoryDiv = document.querySelector("#search-history");
var cityCount = 1;

// Function to fetch weather API key - city is received from searchEvent function as searchValue 
var weatherRequest = function (city) {
    if (!city) {
        return;
    };
    var weatherApi = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=311ad2f7f09a1df9a71b2b60e7af05cc";
    // Fetch the response
    fetch(weatherApi)
    .then(function (response) {
        if (!response || !response.ok) {
            throw new Error('There was an error!');
        };
        return response.json();
    })

    .then(function (response) {
        // Div to contain city name and current temperature
        cityTempDiv.classList = 'temp-div';
        responseContainer.appendChild(cityTempDiv);

        // Div to contain other details - humidity, wind speed, UV index
        cityDetailsDiv.classList = 'detail-div';
        responseContainer.appendChild(cityDetailsDiv);

        // Create element for the city name response   
        cityNameEl.innerHTML = "<h2 class='secondary-text'>Current Weather for <span class='font-weight-bold'>" + response.name + "</span></h2><br><img class='icon' src='http://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt=Current weather icon/><br><br><h2 class='font-weight-bold secondary-text'>" + date + "</h2><br>";
        cityTempDiv.appendChild(cityNameEl);

        // Create element to display the current temperature
        currentTempEl.innerHTML = "<h3 class='secondary-text'>Current Temperature:<span class='font-weight-bold'>" + " " + Math.round(response.main.temp) + "&#176F</span></h3><br>";
        cityTempDiv.appendChild(currentTempEl);

        // Create element to display humidity
        humidityEl.innerHTML = "<h4 class='secondary-text'>Humidity:<span class='font-weight-bold'>" + " " + response.main.humidity + "%</span></h4>";
        cityDetailsDiv.appendChild(humidityEl);

        // Create element to display wind speed
        windEl.innerHTML = "<h4 class='secondary-text'>Wind Speed:<span class='font-weight-bold'>" + " " + Math.round(response.wind.speed) + " MPH</span></h4>";
        cityDetailsDiv.appendChild(windEl);
