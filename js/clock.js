// 1. Cities with time zone and coordinates (coordinates are for the weather)
const dashboardCities = [
  { name: "New York", zone: "America/New_York", lat: 40.71, lon: -74.01 },
  { name: "London", zone: "Europe/London", lat: 51.51, lon: -0.13 },
  { name: "Dubai", zone: "Asia/Dubai", lat: 25.2, lon: 55.27 },
  { name: "Mumbai", zone: "Asia/Kolkata", lat: 19.08, lon: 72.88 },
  { name: "Tokyo", zone: "Asia/Tokyo", lat: 35.68, lon: 139.69 },
  { name: "Sydney", zone: "Australia/Sydney", lat: -33.87, lon: 151.21 },
  { name: "Los Angeles", zone: "America/Los_Angeles", lat: 34.05, lon: -118.24 }
];

const clockGrid = document.getElementById("clockGrid");

// 2. Build the cards ONE time (empty time and weather spots with ids)
function buildCards() {
  clockGrid.innerHTML = dashboardCities
    .map(
      (city, i) => `
      <div class="clock-card">
        <h3>${city.name}</h3>
        <div class="time" id="time-${i}"></div>
        <div class="date" id="date-${i}"></div>
        <div class="city-weather" id="weather-${i}">Loading...</div>
      </div>
    `
    )
    .join("");
}

// 3. Update only the time and date text (runs every second)
function updateTimes() {
  const now = new Date();

  dashboardCities.forEach((city, i) => {
    document.getElementById(`time-${i}`).textContent = now.toLocaleTimeString("en-US", {
      timeZone: city.zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    document.getElementById(`date-${i}`).textContent = now.toLocaleDateString("en-US", {
      timeZone: city.zone,
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  });
}

// 4. Get the weather for every city (runs once, then every 10 minutes)
async function loadWeather() {
  await Promise.all(
    dashboardCities.map(async (city, i) => {
      const weatherEl = document.getElementById(`weather-${i}`);

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
        );
        const data = await res.json();
        const current = data.current_weather;
        const weather = describeWeather(current.weathercode);

        weatherEl.textContent = `${weather.icon} ${Math.round(current.temperature)}°C · ${weather.text}`;
      } catch (error) {
        weatherEl.textContent = "Weather unavailable";
      }
    })
  );
}

// 5. Start everything
buildCards();
updateTimes();
setInterval(updateTimes, 1000);

loadWeather();
setInterval(loadWeather, 10 * 60 * 1000);