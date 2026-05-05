import { fetchWeather }          from "./api.js";
import {
  showLoader,
  showError,
  renderWeather,
  updateLastSearchChip,
  startRefreshSpin,
  stopRefreshSpin,
}                                from "./ui.js";
import { saveLastCity, getLastCity } from "./storage.js";

const cityInput   = document.getElementById("cityInput");
const searchBtn   = document.getElementById("searchBtn");
const refreshBtn  = document.getElementById("refreshBtn");
const lastSearchBtn = document.getElementById("lastSearchBtn");

let currentCity = "";

/**
 * loadWeather
 * Orchestrates the full fetch → render cycle.
 * @param {string} city - City name to look up
 * @param {boolean} [isRefresh=false] - Whether triggered by Refresh button
 */
async function loadWeather(city, isRefresh = false) {
  const trimmed = city.trim();
  if (!trimmed) {
    showError("Please enter a city name before searching.");
    return;
  }

  if (isRefresh) {
    startRefreshSpin();          
  } else {
    showLoader();                
  }

  try {
    const data = await fetchWeather(trimmed);

    renderWeather(data);
    currentCity = trimmed;
    saveLastCity(trimmed);
    updateLastSearchChip(trimmed);

  } catch (error) {
    showError(error.message);

  } finally {
    
    if (isRefresh) stopRefreshSpin();
  }
}

searchBtn.addEventListener("click", () => {
  loadWeather(cityInput.value);
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadWeather(cityInput.value);
  }
});

refreshBtn.addEventListener("click", () => {
  if (currentCity) {
    loadWeather(currentCity, true);   
  }
});

lastSearchBtn.addEventListener("click", () => {
  const last = getLastCity();
  if (last) {
    cityInput.value = last;          
    loadWeather(last);
  }
});


(function init() {
  const lastCity = getLastCity();
  updateLastSearchChip(lastCity);
  cityInput.focus();
})();