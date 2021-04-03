// Set global variables
const APIKey = "e2f667cde55a60ea38271c0834d19b9e";
const lsKey = "weatherSearches"
const searchesDiv = $("#searches");
const searchInput = $("#searchInput");
const searchButton = $("#searchBtn");
const currentWeatherDiv = $("#currentWeather");
const forecastDiv = $("#forecast");
const clearBtn = $("#clear");
var storedSearches = getStoredSearches();
// Variable used to store and determine if the city needs to be added to the search history
var addedCity = newCity();
// Unit variables for future development of switching between unit systems.
const metricUnits = {deg:"C", speed:"KPH"};
const impUnits = {deg:"F", speed:"MPH"};
var units = metricUnits;

function init(){

    // Enable tooltips
    $(function (){
        $('[data-toggle="tooltip"]').tooltip()
    });
    
    buildSearchHistory();

    if (storedSearches != null){
        getWeather(storedSearches[0]);
    }

    // Function to fetch weather API key - city is received from searchEvent function as searchValue 
    searchInput.on("keyup", function (event){

        // "13" represents the enter key
        if (event.key === "Enter"){
            searchButtonClicked();
        }
    });

    searchButton.on("click", searchButtonClicked);
    clearBtn.on("click",clearSearches);    
}

// Search button function 
function buildSearchHistory(){
    
    searchesDiv.empty();
    
    if (storedSearches != null){
        storedSearches.forEach(element => {
            searchesDiv.append(
                $("<button>")
                    .text(correctCase(element.city) +", "+element.country.toUpperCase())
                    .addClass("btn btnCitySearch")
                    .on("click", function (){                        
                        getWeather(element);
                    })
                );
            });
        }
    }

// Clicking search button submits value 
function searchButtonClicked(){
    
        let cityVal = searchInput.val().trim();
        let city = newCity(cityVal, null);       
        getWeather(city);

        // Clear the value once the search is activated
        searchInput.val("");        
    }

// Fetch the weather for searched city
function getWeather(city){
    addedCity = city; 
    let queryURLCurrent = "";
    let queryURLForecast = "";
    
    if (city.country == null){
        queryURLCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+city.city+"&units=metric&appid="+APIKey;
        queryURLForecast = "https://api.openweathermap.org/data/2.5/forecast?q="+city.city+"&units=metric&appid="+APIKey;
    } else {        
        queryURLCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+city.city+","+city.country+"&units=metric&appid="+APIKey;
        queryURLForecast = "https:////api.openweathermap.org/data/2.5/forecast?q="+city.city+","+city.country+"&units=metric&appid="+APIKey;
    }
        
    performAPIGETCall(queryURLCurrent, buildCurrentWeather);
    performAPIGETCall(queryURLForecast, buildForecastWeather);    
}









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

var searchEvent = function (event) {
    event.preventDefault();

    // Clicking search button submits value and calls weatherRequest function
    var searchValue = searchBar.value.trim().toUpperCase();

    if (searchValue) {
        // Correct way to implement is to catch any errors happening from weatherRequest and skip createBtn/storeHistory
        weatherRequest(searchValue);
        createBtn(searchValue);
        storeHistory();

        // Document.querySelector("#search-bar").value = ""
    } else {

        // If search is empty, throw an alert
        alert("Please enter a city to see its current weather.");
    };
};

function createBtn(city) {
    // Create buttons
    var citySearch = document.createElement("button");
    citySearch.textContent = city;
    citySearch.classList = "btn btn-info btn-block";
    citySearch.setAttribute("data-city", city);
    citySearch.setAttribute("type", "submit");
    citySearch.setAttribute("id", "city-" + city);
    searchHistoryDiv.prepend(citySearch);
};

function clearHistory() {
    var searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
    for (var i = 0; i < searchedCities.length; i++) {
        document.getElementById("city-" + searchedCities[i]).remove();
    }
    localStorage.clear("searchedCities");
};

function storeHistory() {
    // Variables to store storage keys for if statements
    var userSearch = document.querySelector("#search-bar").value.trim().toUpperCase();
    if (!userSearch) {
        return;
    };

    var previousSearchCity = JSON.parse(localStorage.getItem("searchedCities")) || [];
    previousSearchCity.push(userSearch);
    localStorage.setItem("searchedCities", JSON.stringify(previousSearchCity));

    // Clear search bar after clicking search button
    document.querySelector("#search-bar").value = "";

    // Call function to remove previously searched weather
    removePrevious();
};

function loadHistory() {
    if (localStorage.getItem("searchedCities")) {
        var previousSearchCity = JSON.parse(localStorage.getItem("searchedCities"));
        for (var i = 0; i < previousSearchCity.length; i++) {
            createBtn(previousSearchCity[i]);
        }
    };

    for (i = 0; i < document.getElementsByClassName("btn").length; i++) {
        document.getElementsByClassName("btn")[i].addEventListener('click', function () {
            var btnClicked = this.getAttribute("data-city");
            weatherRequest(btnClicked);
            console.log(btnClicked);
            removePrevious();
        });
    }
};

// Remove previously searched weather information
var removePrevious = function () {
    cityNameEl.remove();
    uvIndexContainer.remove();
    forecastContainer.innerHTML = "";
    currentTempEl.remove();
    humidityEl.remove();
    windEl.remove();
};

searchHandler.addEventListener("submit", searchEvent);
deleteBtn.addEventListener("click", clearHistory);

loadHistory();
