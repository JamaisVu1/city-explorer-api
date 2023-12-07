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
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const MOVIE_READ_TOKEN = process.env.MOVIE_READ_TOKEN;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

class Movies {
  constructor(image_url, title) {
    this.image_url = image_url;
    this.title = title;
  }
}

app.get("/movies", async (request, response) => {
  const { city } = request.query;

  try {
    const tmdbResponse = await axios.get(
      "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1",
      {
        params: { query: `${city}` },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${MOVIE_READ_TOKEN}`,
        },
      }
    );

     const moviesData = tmdbResponse.data.results
      .slice(0, 10) 
      .map((movie) => ({
        image_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        title: movie.title,
      }));

    console.log(moviesData);

    response.json(moviesData);

  } catch (error) {
    console.error("Error making TMDb API request:", error.message);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/weather", async (request, response) => {
  const { lat, lon } = request.query;
  // console.log(request.query);

  try {
    //URL from Brenden Huddleston
    const apiResponse = await axios.get(
      `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lat=${lat}&lon=${lon}&units=I&days=7`,
      {
        params: {
          key: WEATHER_API_KEY,
          lat,
          lon,
          days: 7,
        },
      }
    );

    const forecastArray = apiResponse.data.data.map(
      (day) => new Forecast(day.datetime, day.weather.description)
    );

    const formattedResponse = forecastArray.map((day) => ({
      date: day.date,
      description: day.description,
    }));

    console.log(formattedResponse);
    response.send({
      city: apiResponse.data.city_name,
      forecast: formattedResponse,
    });
  } catch (error) {
    console.error("Error making API request:", error.message);
    console.error(
      "Error details:",
      error.response ? error.response.data : "No response data"
    );
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
