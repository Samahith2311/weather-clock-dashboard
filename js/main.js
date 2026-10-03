const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");

async function getWeather(city) {
  result.textContent = "Loading...";

  try {
    // Step 1: turn the city name into coordinates
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geoData = await geoRes.json();

    if (!geoData.results) {
      result.textContent = "City not found.";
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: get the current weather for those coordinates
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weatherData = await weatherRes.json();
    const w = weatherData.current_weather;

    result.innerHTML = `
      <h2>${name}, ${country}</h2>
      <p>Temperature: ${w.temperature}°C</p>
      <p>Wind speed: ${w.windspeed} km/h</p>
    `;
  } catch (error) {
    result.textContent = "Something went wrong. Please try again.";
  }
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});