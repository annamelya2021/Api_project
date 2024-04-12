const apiKey = "523f61468ef50f89408cd3c6eee9a9a0";
async function fetchPopularMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const movies = data.results;

    const moviesContainer = document.getElementById("movies-container");

    moviesContainer.innerHTML = "";

    const genres = await fetchGenres();
    movies.forEach((movie) => {
      const movieElement = createMovieCard(movie, genres); // Передати жанри як аргумент
      moviesContainer.appendChild(movieElement);
    });
  } catch (error) {
    console.error("Error fetching popular movies:", error);
  }
}

function createMovieCard(movie, genres) {
  // Додано аргумент genres
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  const imageElement = document.createElement("img");
  imageElement.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  movieCard.appendChild(imageElement);

  const movieInfo = document.createElement("div");
  movieInfo.classList.add("movie-info");

  const titleElement = document.createElement("h2");
  titleElement.textContent = movie.title;
  movieInfo.appendChild(titleElement);

  const overviewElement = document.createElement("p");
  overviewElement.textContent = movie.overview;
  movieInfo.appendChild(overviewElement);

  const genresElement = document.createElement("div");
  genresElement.classList.add("genres");
  movie.genre_ids.forEach((genreId) => {
    const genre = genres.find((g) => g.id === genreId);
    if (genre) {
      const genreSpan = document.createElement("span");
      genreSpan.textContent = genre.name;
      genresElement.appendChild(genreSpan);
    }
  });
  movieInfo.appendChild(genresElement);

  movieCard.appendChild(movieInfo);

  return movieCard;
}

async function searchMovies() {
  const searchQuery = document.getElementById("search-input").value;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const movies = data.results;

    const moviesContainer = document.getElementById("movies-container");

    moviesContainer.innerHTML = "";

    const genres = await fetchGenres(); // Отримати жанри

    movies.forEach((movie) => {
      const movieElement = createMovieCard(movie, genres); // Передати жанри як аргумент
      moviesContainer.appendChild(movieElement);
    });
  } catch (error) {
    console.error("Error searching movies:", error);
  }
}

document.getElementById("search-input").addEventListener("input", searchMovies);

fetchPopularMovies();

async function fetchGenres() {
  const genreListUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;

  try {
    const response = await fetch(genreListUrl);
    const data = await response.json();
    const genres = data.genres;
    return genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}
