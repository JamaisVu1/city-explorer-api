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

const handleMovies = require("./handlers/movies");
const handleWeather = require("./handlers/weather");


app.get("/movies", handleMovies);
app.get("/weather", handleWeather);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
