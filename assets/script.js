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
    
    var weatherApi = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=e2f667cde55a60ea38271c0834d19b9e";
    
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

        // Fetch UV Index
        return fetch("https://api.openweathermap.org/data/2.5/uvi?appid=c83c5006fffeb4aa44a34ffd6a27f135&lat=" + response.coord.lat + "&lon=" + response.coord.lon);
    })

    .then(function (uvFetch) {
        return uvFetch.json();
    })

    .then(function (uvResponse) {
        // Create div to contain UV index
        uvIndexContainer.setAttribute("id", "uv-value");
        uvIndexContainer.classList = "secondary-text uv-class";
        cityDetailsDiv.appendChild(uvIndexContainer);

        // Set UV Value
        var uvValue = uvResponse.value;
        uvIndexEl.innerHTML = "UV Index: ";
        uvValueDisplay.setAttribute("id", "uv-index");
        uvValueDisplay.innerHTML = uvValue;
        uvIndexContainer.appendChild(uvIndexEl);
        uvIndexContainer.appendChild(uvValueDisplay);

        if (uvResponse.value > 7) {
            document.querySelector("#uv-index").classList = "uv-result rounded bg-danger";
        } else if (uvResponse.value >= 2 && uvResponse.value <= 7) {
            document.querySelector("#uv-index").classList = "uv-result rounded bg-warning";
        } else if (uvResponse.value <= 2) {
            document.querySelector("#uv-index").classList = "uv-result rounded bg-success";
        }
        return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + uvResponse.lat + "&lon=" + uvResponse.lon + "&appid=e2f667cde55a60ea38271c0834d19b9e&units=imperial");
    })

    .then(function (forecastResponse) {
        return forecastResponse.json();
    })

    .then(function (forecastResponse) {
        // For loop to display 5 day forecast
        for (var i = 1; i < 6; i++) {
            var forecastEl = document.createElement("div");
            forecastEl.classList = "forecast-card card-body rounded-lg border-dark bg-info text-light";
            forecastContainer.appendChild(forecastEl);

            // Display date 
            var dateDiv = document.createElement("div");
            dateDiv.classList = "secondary-text card-title";
            var forecastDate = moment.utc(forecastResponse.daily[i].dt * 1000).format("dddd, MMM DD");
            dateDiv.innerHTML = "<h5 class='font-weight-bold'>" + forecastDate + "</h5>";
            forecastEl.appendChild(dateDiv);

            // Weather icon
            var iconDiv = document.createElement("div");
            iconDiv.innerHTML = "<img src='http://openweathermap.org/img/w/" + forecastResponse.daily[i].weather[0].icon + ".png' class='forecast-icon' alt=Current weather icon/>";
            forecastEl.appendChild(iconDiv);

            // Display day temperature forecast
            var tempDiv = document.createElement("div");
            tempDiv.classList = "card-text secondary-text";
            tempDiv.innerHTML = "<h6>Day Temp:<span>" + " " + Math.round(forecastResponse.daily[i].temp.day) + "&#176F</span></h6>" + "<h6>Night Temp:<span>" + " " + Math.round(forecastResponse.daily[i].temp.night) + " &#176F</span></h6>";
            forecastEl.appendChild(tempDiv);

            // Display humidity forecast
            var humidDiv = document.createElement("div");
            humidDiv.classList = "card-text secondary-text";
            humidDiv.innerHTML = "<h6>Humidity:<span>" + " " + forecastResponse.daily[i].humidity + "%</span></h6>";
            forecastEl.appendChild(humidDiv);
        }
    })
    
    .catch(function (error) {
        removePrevious();
        alert(error.message);
        document.querySelector("#search-bar").value = "";
        return;
    });
};
