const axios = require("axios");
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;


async function handleWeather (request, response)  {
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
};

module.exports = handleWeather