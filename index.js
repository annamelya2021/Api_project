const apiKey = "523f61468ef50f89408cd3c6eee9a9a0";
let genres;
async function fetchPopularMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const movies = data.results;

    const moviesContainer = document.getElementById("movies-container");

    moviesContainer.innerHTML = "";

    genres = await fetchGenres();
    movies.forEach((movie) => {
      const movieElement = createMovieCard(movie, genres); 
      moviesContainer.appendChild(movieElement);
    });
  } catch (error) {
    console.error("Error fetching popular movies:", error);
  }
}
function createMovieCard(movie, genres) {
 
  if (!genres) return; 

  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  const imageElement = document.createElement("img");
  imageElement.src = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://img.freepik.com/free-photo/adorable-looking-kitten-with-yarn_23-2150886290.jpg?size=626&ext=jpg&ga=GA1.1.1599609068.1706814988&semt=ais'; // Замість 'default_poster.jpg' вставте шлях до вашого зображення за замовчуванням
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
    const searchQuery = document.getElementById("search-input").value.trim();
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;

        const moviesContainer = document.getElementById("movies-container");
        const searchFeedbackText = document.getElementById("search-feedback-text");
        const searchFeedbackInvalid = document.getElementById("search-feedback-invalid");

        if (searchQuery === "") {
            moviesContainer.innerHTML = "";
            fetchPopularMovies();
            // searchFeedbackText.textContent = "";
            searchFeedbackInvalid.style.display = "none";
        } else if (movies.length === 0) {
            moviesContainer.innerHTML = "hhhhhhh";
            const defaultImage = document.createElement("img"); // Створюємо елемент <img>
defaultImage.src = "https://avatars.dzeninfra.ru/get-zen_doc/59126/pub_5b9d6799bd0e2f00a9af9f39_5b9d67bd0739a700a9796316/scale_1200"; // Встановлюємо шлях до зображення
defaultImage.alt = "Default Image"; // Встановлюємо альтернативний текст для зображення
moviesContainer.appendChild(defaultImage); 
            // searchFeedbackText.textContent = "No movies found.";
            searchFeedbackInvalid.style.display = "block";
            // searchFeedbackInvalid.style.display = "none";
        } else {
            moviesContainer.innerHTML = "";
            const genres = await fetchGenres();
            movies.forEach((movie) => {
                const movieElement = createMovieCard(movie, genres);
                moviesContainer.appendChild(movieElement);
            });
            searchFeedbackText.textContent = "";
            searchFeedbackInvalid.style.display = "none";
        }
    } catch (error) {
        console.error("Error searching movies:", error);
    }
}

document.getElementById("search-input").addEventListener("input", searchMovies);

fetchPopularMovies();



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


let page = 1; // Початкова сторінка для підгрузки
let loading = false; // Флаг для позначення процесу завантаження

// Функція для підгрузки додаткових фільмів
async function fetchMoreMovies() {
  if (loading) return;
  loading = true;

  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      const movies = data.results;

      const moviesContainer = document.getElementById("movies-container");

      if (movies.length > 0) {
          movies.forEach((movie) => {
              const movieElement = createMovieCard(movie, genres); // Використання genres
              if (movieElement) {
                  moviesContainer.appendChild(movieElement);
              }
          });
          page++;
      } else {
          console.log("No more movies to load");
      }
  } catch (error) {
      console.error("Error fetching more movies:", error);
  } finally {
      loading = false;
  }
}

// Додайте обробник подій для події прокручування
window.addEventListener('scroll', () => {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    // Перевірте, чи користувач дійшов до низу сторінки
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        fetchMoreMovies(); // Викличте функцію для підгрузки додаткових фільмів
    }
});

// Початкове завантаження популярних фільмів
fetchPopularMovies();
