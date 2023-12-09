const axios = require("axios");
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

let cache = require("../data/cache");

async function handleWeather(request, response) {
  const { lat, lon } = request.query;
  const cacheKey = `${lat},${lon}`;

  // Check if data is in cache and not expired
  if (cache[cacheKey] && cache[cacheKey].timestamp && isCacheValid(cache[cacheKey].timestamp)) {
    console.log("Using cache for:", cacheKey);
    response.send(cache[cacheKey].data);
    return;
  }

  try {
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

    class Forecast {
      constructor(date, description) {
        this.date = date;
        this.description = description;
      }
    }

    const forecastArray = apiResponse.data.data.map(
      (day) => new Forecast(day.datetime, day.weather.description)
    );

    const formattedResponse = forecastArray.map((day) => ({
      date: day.date,
      description: day.description,
    }));

    const weatherData = {
      city: apiResponse.data.city_name,
      forecast: formattedResponse,
    };

    // Store data in cache with timestamp
    cache[cacheKey] = {
      data: weatherData,
      timestamp: Date.now(),
    };

    console.log("Storing data in cache for:", cacheKey);
    response.send(weatherData);
  } catch (error) {
    console.error("Error making API request:", error.message);
    console.error(
      "Error details:",
      error.response ? error.response.data : "No response data"
    );
    response.status(500).json({ error: "Internal Server Error" });
  }
}

// gpt assisted
function isCacheValid(timestamp) {
  const expirationTime = 5 * 60 * 1000; 
  return Date.now() - timestamp <= expirationTime;
}

module.exports = handleWeather;

