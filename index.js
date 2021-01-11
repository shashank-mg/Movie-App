const APIkey = "http://www.omdbapi.com/?i=tt3896198&apikey=bb6a13de";

let flag = 0;
let response;
let leftMovie;
let rightMovie;

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
    let objLen = Object.keys(movie);
    document.querySelector("#left-summary").innerHTML = movieTemplate(movie);
    if (objLen.length > 0) runComparision(movie, "left");
    else runComparision(undefined, "left");
    document.querySelector(".tutorial").classList.add("is-hidden");
  },
});

createAutoComplete({
  ...autoCompleteConfig,
  autocomplete: document.querySelector("#right-autocomplete"),
  displayResult(movie) {
    let objLen = Object.keys(movie);
    document.querySelector("#right-summary").innerHTML = movieTemplate(movie);
    if (objLen.length > 0) runComparision(movie, "right");
    else runComparision(undefined, "right");
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
    <article class='notification is-primary boxoffice'>
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

const runComparision = (movie, choose) => {
  let rightSelected = document.querySelector("#right-summary");
  let leftSelected = document.querySelector("#left-summary");

  if (choose === "left") {
    leftMovie = movie;
  } else {
    rightMovie = movie;
  }

  if (leftMovie && rightMovie) {
    let leftAmt = parseInt(leftMovie.BoxOffice.slice(1).replace(/,/g, ""));
    let rightAmt = parseInt(rightMovie.BoxOffice.slice(1).replace(/,/g, ""));

    if (!isNaN(leftAmt) && !isNaN(rightAmt)) {
      if (leftAmt > rightAmt) {
        leftSelected.querySelector(".boxoffice").style.backgroundColor =
          "lightgreen";
        rightSelected.querySelector(".boxoffice").style.backgroundColor =
          "#FFFF33";
      } else if (rightAmt > leftAmt) {
        leftSelected.querySelector(".boxoffice").style.backgroundColor =
          "#FFFF33";
        rightSelected.querySelector(".boxoffice").style.backgroundColor =
          "lightgreen";
      } else {
        rightSelected.querySelector(".boxoffice").style.backgroundColor =
          "#00d1b2";
        leftSelected.querySelector(".boxoffice").style.backgroundColor =
          "#00d1b2";
      }
    } else {
      rightSelected.querySelector(".boxoffice").style.backgroundColor =
        "#00d1b2";
      leftSelected.querySelector(".boxoffice").style.backgroundColor =
        "#00d1b2";
    }
  } else if (leftMovie) {
    leftSelected.querySelector(".boxoffice").style.backgroundColor = "#00d1b2";
  } else if (rightMovie) {
    rightSelected.querySelector(".boxoffice").style.backgroundColor = "#00d1b2";
  }
};
