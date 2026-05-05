import { STORAGE_KEY } from "./config.js";

/**
 * saveLastCity
 * Persist the city name so the user can quickly repeat it.
 * @param {string} city
 */
export function saveLastCity(city) {
  try {
    localStorage.setItem(STORAGE_KEY, city.trim());
  } catch (e) {
    console.warn("localStorage not available:", e);
  }
}

/**
 * getLastCity
 * Retrieve the previously searched city (or null if none).
 * @returns {string|null}
 */
export function getLastCity() {
  try {
    return localStorage.getItem(STORAGE_KEY) || null;
  } catch (e) {
    return null;
  }
}