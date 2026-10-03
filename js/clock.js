// 1. Default cities (shown the first time you open the page)
const defaultCities = [
  { name: "New York", zone: "America/New_York", lat: 40.71, lon: -74.01 },
  { name: "London", zone: "Europe/London", lat: 51.51, lon: -0.13 },
  { name: "Dubai", zone: "Asia/Dubai", lat: 25.2, lon: 55.27 },
  { name: "Mumbai", zone: "Asia/Kolkata", lat: 19.08, lon: 72.88 },
  { name: "Tokyo", zone: "Asia/Tokyo", lat: 35.68, lon: 139.69 },
  { name: "Sydney", zone: "Australia/Sydney", lat: -33.87, lon: 151.21 },
  { name: "Los Angeles", zone: "America/Los_Angeles", lat: 34.05, lon: -118.24 }
];

// 2. Grab elements from the page
const clockGrid = document.getElementById("clockGrid");
const addCityInput = document.getElementById("addCityInput");
const addCityBtn = document.getElementById("addCityBtn");
const addMessage = document.getElementById("addMessage");

// 3. Load saved cities from the browser (or use the defaults)
function loadCities() {
  try {
    const saved = localStorage.getItem("dashboardCities");
    if (saved) return JSON.parse(saved);
  } catch (error) {
    // if storage fails, just use the defaults
  }
  return [...defaultCities];
}

// 4. Save the current list of cities in the browser
function saveCities() {
  try {
    localStorage.setItem("dashboardCities", JSON.stringify(dashboardCities));
  } catch (error) {
    // if storage fails, the app still works, it just won't remember
  }
}

let dashboardCities = loadCities();

// 5. Build the cards (empty time and weather spots with ids)
function buildCards() {
  if (dashboardCities.length === 0) {
    clockGrid.innerHTML = "<p>No cities yet. Add one above.</p>";
    return;
  }

  clockGrid.innerHTML = dashboardCities
    .map(
      (city, i) => `
      <div class="clock-card">
        <button class="remove-btn" data-index="${i}" title="Remove">✕</button>
        <h3>${city.name}</h3>
        <div class="time" id="time-${i}"></div>
        <div class="date" id="date-${i}"></div>
        <div class="city-weather" id="weather-${i}">Loading...</div>
      </div>
    `
    )
    .join("");
}

// 6. Update only the time and date text (runs every second)
function updateTimes() {
  const now = new Date();

  dashboardCities.forEach((city, i) => {
    const timeEl = document.getElementById(`time-${i}`);
    const dateEl = document.getElementById(`date-${i}`);
    if (!timeEl || !dateEl) return;

    timeEl.textContent = now.toLocaleTimeString("en-US", {
      timeZone: city.zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    dateEl.textContent = now.toLocaleDateString("en-US", {
      timeZone: city.zone,
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  });
}

// 7. Get the weather for every city
async function loadWeather() {
  await Promise.all(
    dashboardCities.map(async (city, i) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
        );
        const data = await res.json();
        const current = data.current_weather;
        const weather = describeWeather(current.weathercode);

        // The list may have changed while we waited, so check first
        const weatherEl = document.getElementById(`weather-${i}`);
        if (!weatherEl || dashboardCities[i] !== city) return;

        weatherEl.textContent = `${weather.icon} ${Math.round(current.temperature)}°C · ${weather.text}`;
      } catch (error) {
        const weatherEl = document.getElementById(`weather-${i}`);
        if (weatherEl && dashboardCities[i] === city) {
          weatherEl.textContent = "Weather unavailable";
        }
      }
    })
  );
}

// 8. Redraw everything after the list changes
function refreshDashboard() {
  buildCards();
  updateTimes();
  loadWeather();
}

// 9. Add a new city
async function addCity() {
  const query = addCityInput.value.trim();
  if (!query) return;

  addMessage.textContent = "Searching...";

  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`
    );
    const data = await res.json();

    if (!data.results) {
      addMessage.textContent = "City not found.";
      return;
    }

    const found = data.results[0];

    // Don't add the same city twice
    const alreadyAdded = dashboardCities.some(
      (city) => city.name === found.name && city.zone === found.timezone
    );
    if (alreadyAdded) {
      addMessage.textContent = `${found.name} is already on the dashboard.`;
      return;
    }

    dashboardCities.push({
      name: found.name,
      zone: found.timezone,
      lat: found.latitude,
      lon: found.longitude
    });

    saveCities();
    refreshDashboard();
    addCityInput.value = "";
    addMessage.textContent = "";
  } catch (error) {
    addMessage.textContent = "Something went wrong. Please try again.";
  }
}

// 10. Remove a city when its ✕ button is clicked
clockGrid.addEventListener("click", (event) => {
  if (!event.target.classList.contains("remove-btn")) return;

  const index = Number(event.target.dataset.index);
  dashboardCities.splice(index, 1);

  saveCities();
  refreshDashboard();
});

// 11. Buttons and the Enter key
addCityBtn.addEventListener("click", addCity);
addCityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addCity();
});

// 12. Start everything
refreshDashboard();
setInterval(updateTimes, 1000);
setInterval(loadWeather, 10 * 60 * 1000);