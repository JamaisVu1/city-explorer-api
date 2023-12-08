const axios = require("axios");
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const MOVIE_READ_TOKEN = process.env.MOVIE_READ_TOKEN;

async function handleMovies (request, response) {
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
};

module.exports = handleMovies