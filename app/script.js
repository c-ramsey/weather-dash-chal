// Import the necessary libraries
const moment = require('moment');
const dotenv = require('dotenv');
const $ = require('jquery');

// Load environment variables from .env file
dotenv.config();

// Define the API key variable using environment variable
const apiKey = process.env.OW_API_KEY;

// Initialize variables to store weather data
let cityLat = 0;
let cityLon = 0;
let cityName = '';
let countryCode = '';
let tempInK = 0;
let humidity = 0;
let windSpeed = 0;
let uvIndex = 0;
let iconName = '';
let iconURL = 'https://openweathermap.org/img/wn/';
let weatherIcon = '';
let weatherInfoRequestPrefix = 'https://api.openweathermap.org/data/2.5/';
let fiveDayRequestPrefix = 'https://api.openweathermap.org/data/2.5/forecast?q=';
let uviQuery = 'uvi?';

// Document ready function to load search history
$(document).ready(() => {
    initializeLocalStorage();
    renderSearchHistory();
});

// Function to initialize local storage
let initializeLocalStorage = () => {
    if (!localStorage.getItem('searchHistory')) {
        localStorage.setItem('searchHistory', '[]');
    }
};

// Function to render the search history on the page
const renderSearchHistory = () => {
    let searchHx = JSON.parse(localStorage.getItem('searchHistory'));
    if (searchHx) {
        let arrayLength = searchHx.length;
        for (let i = 0; i < arrayLength; ++i) {
            $(`#row${i}`).html(
                `<td><button class="recent btn btn-link p-0 text-muted">${searchHx[i].searchString}</button></td>`
            );
        }
    }
};

// Function to handle click on search history buttons
$('table').on('click', 'button.recent', function () {
    event.preventDefault();
    getWeatherInformation($(this).text());
});

// Function to handle search button click
$('#city-search').click(() => {
    event.preventDefault();
    let citySearchString = validatedSearchString(
        $('input').attr('placeholder', 'City Name').val()
    );
    getWeatherInformation(citySearchString);
});

// Function to handle Enter key press in search input
$('input').keypress((event) => {
    if (event.which == 13) {
        event.preventDefault();
        let citySearchString = validatedSearchString(
            $('input').attr('placeholder', 'City Name').val()
        );
        getWeatherInformation(citySearchString);
    }
});

// Function to retrieve weather information for a city
let getWeatherInformation = (citySearchString) => {
    // Clear previous data
    cityName = '';
    countryCode = '';
    tempInK = 0;
    humidity = 0;
    windSpeed = 0;
    uvIndex = 0;
    iconName = '';

    let cityQuery = 'weather?q=' + citySearchString;
    $.ajax({
        url: weatherInfoRequestPrefix + cityQuery + '&appid=' + apiKey,
        method: 'GET',
        error: (err) => {
            alert(
                'Your city was not found. Check your spelling, or enter a city name with a country code, separated by a comma'
            );
            return;
        },
    })
        .then((response) => {
            cityLat = response.coord.lat;
            cityLon = response.coord.lon;
            cityName = response.name;
            countryCode = response.sys.country;
            tempInK = response.main.temp;
            humidity = response.main.humidity;
            windSpeed = response.wind.speed;
            iconName = response.weather[0].icon;
        })
        .then(() => {
            return $.ajax({
                url: weatherInfoRequestPrefix + uviQuery + '&appid=' + apiKey + '&lat=' + cityLat + '&lon=' + cityLon,
                method: 'GET',
            })
                .then((response) => {
                    uvIndex = response.value;
                })
                .then(() => {
                    showValuesOnPage();
                });
        });

    $.ajax({
        url: fiveDayRequestPrefix + citySearchString + '&appid=' + apiKey,
        method: 'GET',
    }).then((response) => {
        return setFiveDayData(response);
    });
};

// Function to validate the city search string
let validatedSearchString = (city) => {
    let search = city.split(',');
    if (search.length > 1) {
        // make sure neither string is empty
        let first = search[0].length;
        let second = search[1].length;
        if (first === 0 || second === 0) {
            return first > second ? search[0] : search[1];
        }
        return search[0] + ',' + search[1];
    } else {
        return city;
    }
};

// Function to format date string
let dateString = (unixTime) => {
    return moment(unixTime * 1000).format('MM/DD/YYYY');
};

// Function to update weather data on the page
let showValuesOnPage = () => {
    let searchString = cityName + ', ' + countryCode;
    $('#city-name').text(searchString + ' (' + dateString(Date.now()) + ')');
    addToSearchHistory(searchString, Date.now());
    renderSearchHistory();
    $('#weather-icon').attr('src', iconURL + iconName + '.png');
    $('#temperature-data').text(
        'Temperature: ' +
        (tempInK - 273.15).toFixed(2) +
        ' ' +
        String.fromCharCode(176) +
        'C (' +
        (((tempInK - 273.15) * 9) / 5 + 32).toFixed(2) +
        ' ' +
        String.fromCharCode(176) +
        'F)'
    );
    $('#humidity-data').text('Humidity: ' + humidity + '%');
    $('#wind-data').text('Wind Speed: ' + windSpeed + ' MPH');
    $('#uvindex-data').text('UV Index: ' + uvIndex);
};

// Function to set five-day forecast data
let setFiveDayData = (response) => {
    let dataArray = response.list;
    let size = dataArray.length;
    let dayNumber = 1;
    for (let i = 0; i < size; i += 8) {
        $(`#five-day-${dayNumber}`)
            .find('h6')
            .text(dateString(dataArray[i].dt));
        $(`#five-day-${dayNumber}`)
            .find('.weather-icon')
            .attr('src', iconURL + dataArray[i].weather[0].icon + '.png');
        $(`#five-day-${dayNumber}`)
            .find('.temp-5')
            .text(
                'Temperature: ' +
                (dataArray[i].main.temp - 273.15).toFixed(2) +
                ' ' +
                String.fromCharCode(176) +
                'C (' +
                (((dataArray[i].main.temp - 273.15) * 9) / 5 + 32).toFixed(2) +
                ' ' +
                String.fromCharCode(176) +
                'F)'
           
