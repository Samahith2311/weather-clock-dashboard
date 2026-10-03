// 1. Grab the elements from the page
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const statusEl = document.getElementById("status");

const hero = document.getElementById("hero");
const heroTemp = document.getElementById("heroTemp");
const heroPlace = document.getElementById("heroPlace");
const heroTime = document.getElementById("heroTime");
const heroDay = document.getElementById("heroDay");

const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");
const rainTodayEl = document.getElementById("rainToday");
const rainTotalEl = document.getElementById("rainTotal");

const chartEl = document.getElementById("chart");
const chartLabelsEl = document.getElementById("chartLabels");

// These remember which city is currently shown in the hero banner
let currentTimezone = null;
let currentDescription = "";

// These keep the last weather data, so we can redraw when °C / °F changes
let lastPlace = null;
let lastData = null;

// 2. Save and load the last shown city (name, country and coordinates)
function loadLastPlace() {
  try {
    const saved = localStorage.getItem("lastPlace");
    if (saved) return JSON.parse(saved);
  } catch (error) {
    // if storage fails, we use the default city
  }
  return null;
}

function saveLastPlace(place) {
  try {
    localStorage.setItem("lastPlace", JSON.stringify(place));
  } catch (error) {
    // the app still works, it just won't remember
  }
}

// 3. Turn "2026-10-03T06:12" into "6:12 AM"
function to12Hour(isoString) {
  const [hourText, minute] = isoString.split("T")[1].split(":");
  let hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${suffix}`;
}

// 4. Update the local time in the hero banner (runs every second)
function updateHeroClock() {
  if (!currentTimezone) return;

  const now = new Date();

  heroTime.textContent = now.toLocaleTimeString("en-US", {
    timeZone: currentTimezone,
    hour: "2-digit",
    minute: "2-digit"
  });

  const weekday = now.toLocaleDateString("en-US", {
    timeZone: currentTimezone,
    weekday: "long"
  });

  heroDay.textContent = `${currentDescription}: ${weekday}`;
}

// 5. Draw the 5-day temperature curve and the labels below it
function drawChart(daily) {
  const temps = daily.temperature_2m_max;
  const width = 500;
  const height = 160;
  const top = 34;
  const bottom = 14;

  const max = Math.max(...temps);
  const min = Math.min(...temps);
  const range = max - min || 1;
  const step = width / temps.length;

  // Work out the position of each point on the curve
  const points = temps.map((temp, i) => ({
    x: step * i + step / 2,
    y: top + ((max - temp) / range) * (height - top - bottom)
  }));

  // Draw a smooth line through the points
  let line = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const point = points[i];
    const mid = (prev.x + point.x) / 2;
    line += ` C ${mid} ${prev.y}, ${mid} ${point.y}, ${point.x} ${point.y}`;
  }

  // Close the shape at the bottom so it can be filled with color
  const first = points[0];
  const last = points[points.length - 1];
  const area = `${line} L ${last.x} ${height} L ${first.x} ${height} Z`;

  // A dot and a temperature number on each point
  const dots = points
    .map(
      (p, i) => `
      <circle cx="${p.x}" cy="${p.y}" r="4" class="chart-dot"></circle>
      <text x="${p.x}" y="${p.y - 12}" text-anchor="middle" class="chart-text">${formatTemp(temps[i])}</text>
    `
    )
    .join("");

  chartEl.innerHTML = `
    <path d="${area}" class="chart-area"></path>
    <path d="${line}" class="chart-line"></path>
    ${dots}
  `;

  // Weekday and weather icon under each point
  chartLabelsEl.innerHTML = daily.time
    .map((date, i) => {
      const day = new Date(date + "T12:00:00")
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();
      const weather = describeWeather(daily.weather_code[i]);

      return `
        <div class="chart-label">
          <div class="chart-day">${day}</div>
          <div class="chart-icon">${weather.icon}</div>
        </div>
      `;
    })
    .join("");
}

// 6. Put all the weather data on the page
function showWeather(place, data) {
  // Keep the data so the °C / °F toggle can redraw it later
  lastPlace = place;
  lastData = data;

  const current = data.current;
  const daily = data.daily;
  const weather = describeWeather(current.weather_code);
  const isDay = current.is_day === 1;

  // Hero banner: sky style, temperature, place
  hero.classList.toggle("sky-day", isDay);
  hero.classList.toggle("sky-night", !isDay);

  heroTemp.textContent = formatTemp(current.temperature_2m, true);
  heroPlace.textContent = place.country ? `${place.name}, ${place.country}` : place.name;

  currentTimezone = data.timezone;
  currentDescription = weather.text;
  updateHeroClock();

  // Stat cards
  humidityEl.textContent = `${current.relative_humidity_2m}%`;
  windEl.textContent = `${current.wind_speed_10m} km/h`;
  sunriseEl.textContent = to12Hour(daily.sunrise[0]);
  sunsetEl.textContent = to12Hour(daily.sunset[0]);

  // Rain bar
  const rainTotal = daily.precipitation_sum.reduce((sum, mm) => sum + mm, 0);
  rainTodayEl.textContent = `${daily.precipitation_sum[0].toFixed(1)} mm`;
  rainTotalEl.textContent = `${rainTotal.toFixed(1)} mm`;

  // Chart
  drawChart(daily);
}

// 7. Get the weather for a place we already know (name, country, latitude, longitude)
async function loadCity(place) {
  statusEl.textContent = "Loading...";

  try {
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum` +
        `&timezone=auto&forecast_days=5`
    );
    const data = await weatherRes.json();

    showWeather(place, data);
    saveLastPlace(place);
    statusEl.textContent = "";
  } catch (error) {
    statusEl.textContent = "Something went wrong. Please try again.";
  }
}

// 8. Find a city by name, then load it
async function getWeather(query) {
  statusEl.textContent = "Loading...";

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`
    );
    const geoData = await geoRes.json();

    if (!geoData.results) {
      statusEl.textContent = "City not found.";
      return;
    }

    const found = geoData.results[0];

    await loadCity({
      name: found.name,
      country: found.country,
      latitude: found.latitude,
      longitude: found.longitude
    });
  } catch (error) {
    statusEl.textContent = "Something went wrong. Please try again.";
  }
}

// 9. Search when the button is clicked or Enter is pressed
function handleSearch() {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
}

searchBtn.addEventListener("click", handleSearch);
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleSearch();
});

// 10. When the °C / °F toggle changes, redraw with the saved data
document.addEventListener("unitchange", () => {
  if (lastPlace && lastData) showWeather(lastPlace, lastData);
});

// 11. Start: show the last city (or London the first time), and keep the clock ticking
const savedPlace = loadLastPlace();
if (savedPlace) {
  loadCity(savedPlace);
} else {
  getWeather("London");
}
setInterval(updateHeroClock, 1000);