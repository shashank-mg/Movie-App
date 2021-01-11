const createAutoComplete = ({
  autocomplete,
  renderOption,
  onOptionSelect,
  inputValue,
  displayResult,
}) => {
  //   const autocomplete = document.querySelector(".autocomplete");
  autocomplete.innerHTML = `
  <label><b>Search for a movie</b></label>
  <input class='input'/>
  <div class='dropdown'>
    <div class='dropdown-menu'>
      <div class='dropdown-content results'></div>
    </div>
  </div>
`;

  const input = autocomplete.querySelector("input");
  const dropdown = autocomplete.querySelector(".dropdown");
  const resultsWrapper = autocomplete.querySelector(".results");

  const onInput = async (e) => {
    const movies = await fetchData(e.target.value.trim());
    if (movies.length > 0) {
      resultsWrapper.innerHTML = "";
      dropdown.classList.add("is-active");
      for (let movie of movies) {
        const option = document.createElement("a");
        option.classList.add("dropdown-item");
        option.innerHTML = renderOption(movie); // renderOption(movie)
        option.addEventListener("click", () => {
          input.value = inputValue(movie);
          flag = 1;
          let singleData = onOptionSelect(movie);
          dropdown.classList.remove("is-active");
          Promise.resolve(singleData).then((data) => displayResult(data));
        });
        resultsWrapper.appendChild(option);
      }
    } else {
      displayResult({});
      dropdown.classList.remove("is-active");
    }
  };

  input.addEventListener("input", debounce(onInput, 500));
  input.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      let q = { target: { value: e.target.value } };
      onInput(q);
    }
  });

  document.addEventListener("click", (e) => {
    if (!autocomplete.contains(e.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
