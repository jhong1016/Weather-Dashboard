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

// Console.log(data);
function buildCurrentWeather(data){
    if (data != null) {
        console.log(units,metricUnits,data.wind.speed);
        currentWeatherDiv.empty();
        currentWeatherDiv.append(
            $("<h3>").text(correctCase(data.name)+", "
                +data.sys.country.toUpperCase())
            ,$("<h4>").text(moment.unix(data.dt).format("dddd, MMM Do YYYY"))
            .append($("<img>").attr("src", "https://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png")
                .addClass("currentWeatherImg")
                .attr("data-toggle", "tooltip")
                .attr("data-placement", "right")                                                      
                .attr("title", data.weather[0].description)
                .tooltip())
            ,$("<p>").text("Temperature: " + Math.round(data.main.temp) + "°"+units.deg)
            ,$("<p>").text("Humidity: " + data.main.humidity+"%")
            ,$("<p>").text("Wind Speed: " +(Math.round((units === metricUnits)?(data.wind.speed*3.6):data.wind.speed))+" "+units.speed)
            ,$("<p>").text("UV Index: ").append($("<div>").attr("id", "UVIndex"))
        );

    let UVqueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat="+data.coord.lat+"&lon="+data.coord.lon;
        
    performAPIGETCall(UVqueryURL,buildUV);

    if (addedCity.country == null){
        addedCity.country = data.sys.country;
        addedCity.city = data.name;
        addNewSearch(addedCity);
        addedCity = null;
    }
    } else {
        alert("There was an fetching current weather data. Please try again.");
    }            
}

// Create div to contain UV index
function buildUV(data){
    if (data != null){

        let UVIndex = data.value;
        let UVDiv = $("#UVIndex").attr("data-toggle", "tooltip");
        let severity = "";
        let UVbg = null;
        let textColor = null;
        let borderColor = null;
        
        // Determine severity of UV Index for color coding
        if (UVIndex < 2){
            UVbg = "green";
            textColor = "white";
            severity = "Low";
            borderColor = "rgb(16, 129, 16)";
        } else if (UVIndex < 6){
            UVbg = "yellow";
            severity = "Moderate";
            borderColor = "rgb(245, 245, 56)";
        } else if (UVIndex < 8){
            UVbg = "orange";
            severity = "High";
            borderColor = "rgb(255, 184, 51)";
        } else if (UVIndex < 11){
            UVbg = "red";
            textColor = "white";
            severity = "Very high";
            borderColor = "rgb(255, 54, 54)";
        } else {
            UVbg = "violet";
            severity = "Extreme";
            borderColor = "rgb(236, 151, 236)";
        }
        UVDiv.attr("title", severity)
             .attr("data-placement", "right")  
             .tooltip()
             .css("backgroundColor", UVbg)
             .css("borderColor", borderColor);
        
        if(textColor != null){
            UVDiv.css("color",textColor);
        }
        UVDiv.text(UVIndex);
        } else {
            alert("There was an error fetching UV data. Please try again.");
        }
    }

// For loop to display 5 day forecast
function buildForecastWeather(data){
    if (data != null){
        
        forecastDiv.empty();
        
        let dayCardContainer = $("<div>").attr("id","dayCardContainer").addClass("row")

        forecastDiv.append($("<h3>").text("5-Day Forecast:"),dayCardContainer);        
        dailyData = parseDailyData(data);        

        dailyData.forEach(element => {
            dayCardContainer.append(buildForecastCard(element));
        });
        
    } else {
        alert("There was an error fetching forecast data. Please try again.");
    }
}


    
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
