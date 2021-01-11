// Debouncing : waiting for some time till event stops
const debounce = (func, delay = 0) => {
  let clear;
  return (...args) => {
    // NOTE: function should be returned since the'e' has to work
    if (clear) clearTimeout(clear);
    clear = setTimeout(() => func.apply(null, args), delay);
  };
};
