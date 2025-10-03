const API_KEY = "";
//  OMDb API key

const searchBtn = document.querySelector("button");
const searchInput = document.querySelector("input");
const resultsContainer = document.querySelector(".results");

searchBtn.addEventListener("click", searchMovies);

async function searchMovies() {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  resultsContainer.innerHTML = "<h3>Loading...</h3>";

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    const data = await res.json();
    


    if (!data.Search) {
      resultsContainer.innerHTML = "<h3>No results found</h3>";
      return;
    }

    // Fetch full details for each movie
    const movies = await Promise.all(
      data.Search.map(async m => {
        const detailsRes = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${m.imdbID}&plot=short`);
        return await detailsRes.json();
      })
    );

    // Display
    resultsContainer.innerHTML = movies.map(m => `
      <div class="movie-card">
        <img src="${m.Poster !== "N/A" ? m.Poster : 'https://via.placeholder.com/300x450'}" alt="${m.Title}">
        <h3>${m.Title} (${m.Year})</h3>
        <p><strong>Genre:</strong> ${m.Genre}</p>
        <p><strong>IMDb Rating:</strong> ${m.imdbRating}</p>
        <p>${m.Plot}</p>
      </div>
    `).join("");// Join all movie cards into one big HTML string
  } catch (err) {
    resultsContainer.innerHTML = "<h3>Error fetching data</h3>";
    console.error(err);
  }
}


const selector = document.getElementById("language-selector");
const elements = document.querySelectorAll("[data-key]");

selector.addEventListener("change", (event) => {
  const selectedLang = event.target.value;
  elements.forEach(el => {
    const key = el.getAttribute("data-key");
    el.textContent = translations[selectedLang][key];
  });
});
