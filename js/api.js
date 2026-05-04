import { API_KEY, BASE_URL, UNITS } from "./config.js";

/**
 * fetchWeather
 * ─────────────
 * Sends a GET request to the OpenWeatherMap Current Weather API.
 *
 * @param {string} city  - City name entered by the user
 * @returns {Promise<Object>} - Raw JSON response from the API
 * @throws {Error} - Descriptive error for any failure scenario
 */
export async function fetchWeather(city) {

  // Build the full request URL with query parameters
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${UNITS}`;

  // ── Network / Fetch layer ──
  let response;
  try {
    response = await fetch(url);          // Send the HTTP GET request
  } catch (networkError) {
    // fetch() itself throws when there's no internet / DNS failure
    throw new Error("Network error — please check your internet connection.");
  }

  // ── HTTP error layer ──
  // A non-2xx status means the server responded but with an error
  if (!response.ok) {
    // Parse the API's own error message when possible
    let apiMessage = "";
    try {
      const errBody = await response.json();
      apiMessage = errBody.message || "";
    } catch (_) { /* ignore JSON parse failure on error body */ }

    switch (response.status) {
      case 401:
        throw new Error("Invalid API key. Please check your API key in js/config.js.");
      case 404:
        throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
      case 429:
        throw new Error("Too many requests — you've hit the API rate limit. Try again shortly.");
      default:
        throw new Error(`API error (${response.status}): ${apiMessage || "Something went wrong."}`);
    }
  }

  // ── Parse JSON ──
  const data = await response.json();
  return data;   
}