//chatGPT assisted
// Use a library called "dotenv" to "read" my .env file
// And put all of the "key/value" pairs into an object called process.env

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const weather = require('./data/weather.json');

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.get("/weather", (request, response) => {
  const { lat, lon } = request.query;

  // Assuming that your weather.json data structure has latitude and longitude fields
  const foundCity = weather.find(city => city.lat === parseFloat(lat) && city.lon === parseFloat(lon));

  if (foundCity) {
    
    const forecastArray = foundCity.data.map(day => {
      const forecast = new Forecast(day.valid_date, day.weather.description);
      return forecast;
    });

    console.log(forecastArray);
    response.send({ city: foundCity.city_name, forecast: forecastArray });

  } else {

    const errorMessage = { error: `City not found for lat=${lat} and lon=${lon}.` };
    console.error(errorMessage.error);
    response.status(404).json(errorMessage);

  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

