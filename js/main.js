// 1. Grab the elements from the page
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");
const forecastEl = document.getElementById("forecast");

// 2. Turn a weather code number into an emoji and a word
function describeWeather(code) {
  if (code === 0) return { icon: "☀️", text: "Clear" };
  if (code <= 3) return { icon: "⛅", text: "Partly cloudy" };
  if (code <= 48) return { icon: "🌫️", text: "Fog" };
  if (code <= 67) return { icon: "🌧️", text: "Rain" };
  if (code <= 77) return { icon: "❄️", text: "Snow" };
  if (code <= 82) return { icon: "🌦️", text: "Showers" };
  return { icon: "⛈️", text: "Thunderstorm" };
}

// 3. Show the 5 forecast cards
function showForecast(daily) {
  forecastEl.innerHTML = "";

  daily.time.forEach((date, i) => {
    const day = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
    const weather = describeWeather(daily.weathercode[i]);
    const high = Math.round(daily.temperature_2m_max[i]);
    const low = Math.round(daily.temperature_2m_min[i]);

    forecastEl.innerHTML += `
      <div class="day-card">
        <strong>${day}</strong>
        <div class="icon">${weather.icon}</div>
        <div>${weather.text}</div>
        <div>${high}° / ${low}°</div>
      </div>
    `;
  });
}

// 4. Find the city, then get its weather
async function getWeather(city) {
  result.textContent = "Loading...";
  forecastEl.innerHTML = "";

  try {
    // Turn the city name into coordinates
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geoData = await geoRes.json();

    if (!geoData.results) {
      result.textContent = "City not found.";
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Get current weather and the 5-day forecast
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
    );
    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;

    // Show current weather
    result.innerHTML = `
      <h2>${name}, ${country}</h2>
      <p>Temperature: ${current.temperature}°C</p>
      <p>Wind speed: ${current.windspeed} km/h</p>
    `;

    // Show the forecast cards
    showForecast(weatherData.daily);
  } catch (error) {
    result.textContent = "Something went wrong. Please try again.";
  }
}

// 5. Run the search when the button is clicked
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});