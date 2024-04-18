
// const apiKey = "523f61468ef50f89408cd3c6eee9a9a0";
import {apiKey} from "./src/js/Api_key.js";
let genres;
let loadedMovies = new Set();


async function fetchPopularMovies(genreId = null) {
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`;
  
  if (genreId) {
    url += `&with_genres=${genreId}`;
  }

  try {
    const response = await fetch(url);
    const { results: movies } = await response.json();

    const moviesContainer = document.getElementById("movies-container");
    
    genres = await fetchGenres(apiKey);
    
    if (movies.length > 0) {
      moviesContainer.innerHTML = ""; 
      loadedMovies.clear(); 
      movies.forEach((movie) => {
        const movieElement =  createMovieCard(movie, genres); 
        moviesContainer.appendChild(movieElement);
        loadedMovies.add(movie.id); 
      });
    } else {
      moviesContainer.textContent = "No se encontraron películas.";
    }
  } catch (error) {
    console.error("Error fetching popular movies:", error);
  }
}

document.getElementById("genre-filter").addEventListener("change", function() {
  const genreId = this.value;
  fetchPopularMovies(genreId);
});



export function createMovieCard(movie, genres) {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  const imageElement = document.createElement("img");
  imageElement.src = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://img.freepik.com/free-photo/adorable-looking-kitten-with-yarn_23-2150886290.jpg?size=626&ext=jpg&ga=GA1.1.1599609068.1706814988&semt=ais'; 
  movieCard.appendChild(imageElement);
  imageElement.addEventListener("click", () => openModal(movie));

  const movieInfo = document.createElement("div");
  movieInfo.classList.add("movie-info");

  const titleElement = document.createElement("h2");
  titleElement.textContent = movie.title;
  movieInfo.appendChild(titleElement);

  const genreNames = movie.genre_ids.map((genreId) => {
    const genre = genres.find((g) => g.id === genreId);
    return genre ? genre.name : "";
  });

  const genresText = genreNames.join(", ");

  const genresElement = document.createElement("p");
  genresElement.textContent = "Genres: " + genresText;
  movieInfo.appendChild(genresElement);

  const ratingElement = document.createElement("p");
  ratingElement.textContent = "Rating: " + movie.vote_average.toFixed(1);
  movieInfo.appendChild(ratingElement);

  movieCard.appendChild(movieInfo);

   const newButton = document.createElement("button");
         newButton.textContent = "Add to Favorites";
         newButton.innerHTML = "Favorite";
         newButton.addEventListener("click", () => addToFavorites(movie));
         movieCard.appendChild(newButton);
    

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
          fetchPopularMovies();
          searchFeedbackInvalid.style.display = "none";
      } else if (movies.length === 0) {
          moviesContainer.innerHTML = "";
          const defaultImage = document.createElement("img");
          defaultImage.src = "https://avatars.dzeninfra.ru/get-zen_doc/59126/pub_5b9d6799bd0e2f00a9af9f39_5b9d67bd0739a700a9796316/scale_1200"; 
          defaultImage.alt = "Default Image"; 
          defaultImage.classList.add("defaultmSearchImage");
          moviesContainer.appendChild(defaultImage); 
          searchFeedbackInvalid.style.display = "block";
        
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



document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("genre-filter").addEventListener("change", function() {
      fetchPopularMovies(this.value);
  });
});




let page = 1; 
let loading = false; 

async function fetchMoreMovies() {
  if (loading) return;
  loading = true;

  let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;

  const genreFilter = document.getElementById("genre-filter");
  const selectedGenre = genreFilter.value;

  if (selectedGenre !== "") {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&with_genres=${selectedGenre}&page=${page}`;
  }

  try {
      const response = await fetch(url);
      const data = await response.json();
      const movies = data.results;

      const moviesContainer = document.getElementById("movies-container");

      if (movies.length > 0) {
          movies.forEach((movie) => {
              if (!loadedMovies.has(movie.id)) {
                  const movieElement = createMovieCard(movie, genres);
                  if (movieElement) {
                      moviesContainer.appendChild(movieElement);
                      loadedMovies.add(movie.id);
                  }
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


window.addEventListener('scroll', () => {
  const {
      scrollTop,
      scrollHeight,
      clientHeight
  } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight * 0.9) {
      fetchMoreMovies();
  }
});
fetchPopularMovies();


async function openModal(movie) {
  const modal = document.getElementById("modal");
  modal.innerHTML = "";

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const modalPoster = document.createElement("div");
  modalPoster.id = "modal-poster";
  const posterImg = document.createElement("img");
  posterImg.src = movie.poster_path ? "https://image.tmdb.org/t/p/w500" + movie.poster_path : "https://img.freepik.com/free-photo/adorable-looking-kitten-with-yarn_23-2150886290.jpg?size=626&ext=jpg&ga=GA1.1.1599609068.1706814988&semt=ais";
  posterImg.alt = movie.title + " Poster";
  modalPoster.appendChild(posterImg);

  const modalInfo = document.createElement("div");
  modalInfo.id = "modal-info";
  
  const titleElement = document.createElement("h2");
  titleElement.textContent = movie.title;
  modalInfo.appendChild(titleElement);

  const releaseDateElement = document.createElement("p");
  releaseDateElement.innerHTML = "<strong>Release Date:</strong> " + movie.release_date;
  modalInfo.appendChild(releaseDateElement);

  const plotElement = document.createElement("p");
  plotElement.innerHTML = "<strong>Plot:</strong> " + movie.overview;
  modalInfo.appendChild(plotElement);

  const genresElement = document.createElement("p");
  genresElement.innerHTML = "<strong>Genres:</strong> ";
  const genresPlaceholder = document.createElement("span");
  genresElement.appendChild(genresPlaceholder);

  modalInfo.appendChild(genresElement);

  modalContent.appendChild(modalPoster);
  modalContent.appendChild(modalInfo);

  const modalButton = document.createElement("button");
  modalButton.classList.add("modalButton");
  if (window.location.pathname.includes("favourite.html")) {
    modalButton.textContent = "Remove from Favorites";
    modalButton.addEventListener("click", () => removeFromFavorites(movie));
  } else {
    modalButton.textContent = "Favorite";
    modalButton.addEventListener("click", () => addToFavorites(movie));
  }
  
  
        modalContent.appendChild(modalButton)

  modal.appendChild(modalContent);

  modal.style.display = "block";

  try {
      const genres = await getGenres(movie.genre_ids);
      genresPlaceholder.textContent = genres;
  } catch (error) {
      console.error("Error fetching genres:", error);
  }

  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
}

async function getGenres(genreIds) {
  const genres = await fetchGenres();
  const genreNames = genreIds.map(genreId => {
      const genre = genres.find(g => g.id === genreId);
      return genre ? genre.name : "";
  });
  return genreNames.join(", ");
}



// PARTE DE LANDER

// function addToFavorites(movie) {
//   let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
//   const isDuplicate = favorites.some(favorite => favorite.id === movie.id);
//   if (isDuplicate) {
//     alert("This movie is already in favorites!");
//     return;
//   }
//   favorites.push(movie);
//   localStorage.setItem("favorites", JSON.stringify(favorites));
//   alert("Movie added to Favorites");
// }

function addToFavorites(movie) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const isDuplicate = favorites.some(favorite => favorite.id === movie.id);
  if (isDuplicate) {
    Swal.fire("This movie is already in favorites!");
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    return;
  }
  favorites.push(movie);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  Swal.fire("Movie added to Favorites");

  const modal = document.getElementById("modal");
  modal.style.display = "none";
}


async function showFavorites() {
  const favoritesContainer = document.getElementById("favorites-container");
  favoritesContainer.innerHTML = "";
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.length === 0) {
    favoritesContainer.textContent = "No movie added to Favorites";
  } else {
    const genres = await fetchGenres();
    favorites.forEach((movie) => {
      const favoriteMovieCard = createMovieCard(movie, genres);
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove from Favorites";
      removeButton.addEventListener("click", () => removeFromFavorites(movie));
      favoriteMovieCard.appendChild(removeButton);
      favoritesContainer.appendChild(favoriteMovieCard);
    });
  }
}

function removeFromFavorites(movie) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter((fav) => fav.id !== movie.id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  showFavorites(); 

  const modal = document.getElementById("modal");
  modal.style.display = "none";
}



window.onload = function() {
  if (window.location.pathname.includes("favourite.html")) {
      showFavorites();
  } else {
    
  }
};
