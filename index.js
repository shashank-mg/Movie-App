const APIkey = "http://www.omdbapi.com/?i=tt3896198&apikey=bb6a13de";

let flag = 0;
let response;
const fetchData = async (title) => {
  if (!flag) {
    // for many movies
    response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: "bb6a13de",
        s: title,
      },
    });
  } else {
    // for single movie details
    flag = 0;
    console.log(title);
    response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: "bb6a13de",
        i: title,
      },
    });
    return response.data;
  }
  if (response.data.Error) {
    // if no such movie exists
    return [];
  }
  return response.data.Search;
};

const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
        <img src="${imgSrc}" />
        ${movie.Title}
        `;
  },
  onOptionSelect(movie) {
    return fetchData(movie.imdbID);
  },
  inputValue(movie) {
    return movie.Title;
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  autocomplete: document.querySelector("#left-autocomplete"),
  displayResult(movie) {
    document.querySelector("#left-summary").innerHTML = movieTemplate(movie);
    document.querySelector(".tutorial").classList.add("is-hidden");
  },
});

createAutoComplete({
  ...autoCompleteConfig,
  autocomplete: document.querySelector("#right-autocomplete"),
  displayResult(movie) {
    document.querySelector("#right-summary").innerHTML = movieTemplate(movie);
    document.querySelector(".tutorial").classList.add("is-hidden");
  },
});

const movieTemplate = (movieDetail) => {
  // Bulma CSS
  let objLen = Object.keys(movieDetail);
  if (objLen.length > 0) {
    return `
    <article class='media'>
      <figure class='media-left'>
        <p class='image'>
          <img src=${movieDetail.Poster}/>
        </p>
      </figure>
      <div class='media-content'>
        <div class='content'>
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class='notification is-primary'>
      <p class='subtitle'>Awards</p>
      <p class='title'>${movieDetail.Awards}</p>
    </article>
    <article class='notification is-primary'>
      <p class='subtitle'>Box Office</p>
      <p class='title'>${movieDetail.BoxOffice}</p>     
    </article>
     <article class='notification is-primary'>
      <p class='subtitle'>Meta Score</p>
      <p class='title'>${movieDetail.Metascore}</p>
    </article>
     <article class='notification is-primary'>
     <p class='subtitle'>IMDB Rating</p>
      <p class='title'>${movieDetail.imdbRating}</p>
    </article>
     <article class='notification is-primary'>
      <p class='subtitle'>Imdb Votes</p>
      <p class='title'>${movieDetail.imdbVotes}</p>
    </article>
  `;
  } else {
    return ``;
  }
};
