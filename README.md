# weather-dash-chal

## Description 
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
com.

# Content 

1. [Deployed Webpage](#deployed-webpage)
2. [Action Taken](#action-taken)

## Deployed Webpage

[Deployed Webpage]()

## Screenshot

![Screenshot](./app/Weather%20ss.png)

## Action Taken 

*Create a form input for users to search for a city.
*Create a section to display the current weather conditions.
*Create a section to display the 5-day forecast.
*Create a section to display the search history.
*Register for an API key on the OpenWeatherMap website.
*Wait for the API key to activate if necessary.
*Add an event listener to the form to handle the city search.
*Retrieve the user's input value.
*Construct the API URL with the provided base URL, latitude, longitude, and API key.
*Make an HTTP GET request to the API URL using JavaScript's fetch function.
*Handle the API response and extract the necessary data (e.g., city name, date, temperature, humidity, etc.).
*Extract the necessary data from the API response for the 5-day forecast.
*Dynamically create HTML elements for each day in the forecast.
*Update the HTML elements with the appropriate data.
*Store the searched cities in an array or local storage.
*Create a function to render the search history based on the stored data.
*Add event listeners to the search history elements to trigger a new search when clicked.