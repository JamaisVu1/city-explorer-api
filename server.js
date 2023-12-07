//chatGPT assisted
// Use a library called "dotenv" to "read" my .env file
// And put all of the "key/value" pairs into an object called process.env

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.get("/weather", async (request, response) => {
  const { lat, lon } = request.query;

  try {
    const apiResponse = await axios.get("https://api.weatherbit.io/v2.0/current", {
      params: {
        key: WEATHER_API_KEY,
        lat,
        lon,
        days: 5,
      },
    });

    const forecastArray = apiResponse.data.data.map(day => {
      return new Forecast(day.datetime, day.weather.description);
    });

    const formattedResponse = forecastArray.map(day => ({
      date: day.date,
      description: day.description,
    }));

    console.log(formattedResponse);
    response.send({ city: apiResponse.data.city_name, forecast: formattedResponse });
  } catch (error) {
    console.error("Error making API request:", error.message);
    console.error("Error details:", error.response ? error.response.data : "No response data");
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));




