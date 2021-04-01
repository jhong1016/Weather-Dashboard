// Set global variables, including Open Weather Maps API Key
var APIkey = "311ad2f7f09a1df9a71b2b60e7af05cc";
var currentCity = "";
var lastCity = "";

function currentWeather(){
    navigator.geolocation.getCurrentPosition(function (position){
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;
    
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" +  APIkey;

    $.ajax ({
        url: queryURL,
        method: "GET"
    })

    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {
    var iconCode = response.weather[0].icon;
    
    var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    $(".city").html("<h1> " + response.name + " </h1>");
    $(".temp").text("Temperature: " + response.main.temp + " ºC");
    $(".humidity").text("Humidity: " + response.main.humidity + " %");
    $(".wind").text("Wind Speed: " + response.wind.speed + " MPH");
    $("#wicon").attr("src", iconurl);
  });

  });
};

currentWeather();

////////////////////////

// Error handler for fetch,
var handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

