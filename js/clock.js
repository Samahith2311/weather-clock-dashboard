// 1. The cities we want to show, with their time zone names
const clockCities = [
  { name: "New York", zone: "America/New_York" },
  { name: "London", zone: "Europe/London" },
  { name: "Dubai", zone: "Asia/Dubai" },
  { name: "India", zone: "Asia/Kolkata" },
  { name: "Tokyo", zone: "Asia/Tokyo" },
  { name: "Sydney", zone: "Australia/Sydney" },
  { name: "Los Angeles", zone: "America/Los_Angeles" }
];

// 2. Grab the place on the page where the clocks will go
const clockGrid = document.getElementById("clockGrid");

// 3. Build all the clock cards with the current time
function updateClocks() {
  clockGrid.innerHTML = "";

  clockCities.forEach((city) => {
    const now = new Date();

    const time = now.toLocaleTimeString("en-US", {
      timeZone: city.zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const date = now.toLocaleDateString("en-US", {
      timeZone: city.zone,
      weekday: "short",
      month: "short",
      day: "numeric"
    });

    clockGrid.innerHTML += `
      <div class="clock-card">
        <h3>${city.name}</h3>
        <div class="time">${time}</div>
        <div class="date">${date}</div>
      </div>
    `;
  });
}

// 4. Show the clocks now, then refresh every 1 second
updateClocks();
setInterval(updateClocks, 1000);