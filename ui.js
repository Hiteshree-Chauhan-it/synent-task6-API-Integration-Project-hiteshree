import { ICON_URL, UNITS } from "./config.js";
const loader      = document.getElementById("loader");
const errorBox    = document.getElementById("errorBox");
const errorMsg    = document.getElementById("errorMsg");
const weatherCard = document.getElementById("weatherCard");
const cityNameEl   = document.getElementById("cityName");
const weatherDate  = document.getElementById("weatherDate");
const weatherIcon  = document.getElementById("weatherIcon");
const temperature  = document.getElementById("temperature");
const feelsLike    = document.getElementById("feelsLike");
const weatherDesc  = document.getElementById("weatherDesc");
const humidity     = document.getElementById("humidity");
const windSpeed    = document.getElementById("windSpeed");
const visibility   = document.getElementById("visibility");
const pressure     = document.getElementById("pressure");
const sunrise      = document.getElementById("sunrise");
const sunset       = document.getElementById("sunset");
export function hideAll() {
  loader.hidden      = true;
  errorBox.hidden    = true;
  weatherCard.hidden = true;
}
export function showLoader() {
  hideAll();
  loader.hidden = false;
}

/**
 * showError
 * Display an error message to the user.
 * @param {string} message - Human-readable error text
 */
export function showError(message) {
  hideAll();
  errorMsg.textContent = message;
  errorBox.hidden      = false;
}


/**
 * renderWeather
 * Take raw API data and paint it onto the weather card.
 * @param {Object} data - Raw JSON object from OpenWeatherMap API
 */
export function renderWeather(data) {

  cityNameEl.textContent  = `${data.name}, ${data.sys.country}`;
  weatherDate.textContent = formatDate(new Date());
  const iconCode  = data.weather[0].icon;
  weatherIcon.src = `${ICON_URL}/${iconCode}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  const unitSymbol = UNITS === "metric" ? "°C" : UNITS === "imperial" ? "°F" : "K";
  temperature.textContent = `${Math.round(data.main.temp)}${unitSymbol}`;
  feelsLike.textContent   = `Feels like ${Math.round(data.main.feels_like)}${unitSymbol}`;
  weatherDesc.textContent = data.weather[0].description;

  humidity.textContent  = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} m/s`;
  visibility.textContent= data.visibility
    ? `${(data.visibility / 1000).toFixed(1)} km`
    : "N/A";
  pressure.textContent  = `${data.main.pressure} hPa`;
  sunrise.textContent = formatTime(new Date((data.sys.sunrise + data.timezone) * 1000));
  sunset.textContent  = formatTime(new Date((data.sys.sunset  + data.timezone) * 1000));

  hideAll();
  weatherCard.hidden = false;
  weatherCard.classList.remove("card");
  void weatherCard.offsetWidth;   
  weatherCard.classList.add("card");
}

const refreshIcon = document.getElementById("refreshIcon");
export function startRefreshSpin() {
  refreshIcon.classList.add("refresh-icon--spinning");
}

export function stopRefreshSpin() {
  refreshIcon.classList.remove("refresh-icon--spinning");
}


const lastSearchChip = document.getElementById("lastSearchChip");
const lastSearchBtn  = document.getElementById("lastSearchBtn");

/**
 * updateLastSearchChip
 * Show or hide the "last search" chip below the search bar.
 * @param {string|null} city - City name or null to hide chip
 */
export function updateLastSearchChip(city) {
  if (city) {
    lastSearchBtn.textContent = `🔁 ${city}`;
    lastSearchChip.hidden = false;
  } else {
    lastSearchChip.hidden = true;
  }
}
/**
 * formatDate
 * Returns a human-friendly date string like "Monday, 27 April 2026".
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  });
}

/**
 * formatTime
 * Converts a UTC Date (offset by timezone from API) to HH:MM string.
 * @param {Date} date
 * @returns {string}
 */
function formatTime(date) {
  const h = String(date.getUTCHours()).padStart(2, "0");
  const m = String(date.getUTCMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}