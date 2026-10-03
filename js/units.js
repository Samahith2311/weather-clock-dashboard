// 1. Grab the two buttons
const unitC = document.getElementById("unitC");
const unitF = document.getElementById("unitF");

// 2. Load the saved unit ("C" is the default)
function loadUnit() {
  try {
    const saved = localStorage.getItem("unit");
    if (saved === "F") return "F";
  } catch (error) {
    // if storage fails, use Celsius
  }
  return "C";
}

let currentUnit = loadUnit();

// 3. Convert a Celsius number into the unit we are showing
function convertTemp(celsius) {
  if (currentUnit === "F") return (celsius * 9) / 5 + 32;
  return celsius;
}

// 4. Turn a Celsius number into text like "22°" or "22°C"
function formatTemp(celsius, withUnit = false) {
  const value = Math.round(convertTemp(celsius));
  return withUnit ? `${value}°${currentUnit}` : `${value}°`;
}

// 5. Highlight the active button
function highlightUnit() {
  unitC.classList.toggle("active", currentUnit === "C");
  unitF.classList.toggle("active", currentUnit === "F");
}

// 6. Change the unit, save it, and tell the rest of the page
function setUnit(unit) {
  if (unit === currentUnit) return;

  currentUnit = unit;

  try {
    localStorage.setItem("unit", unit);
  } catch (error) {
    // the unit still changes, it just won't be remembered
  }

  highlightUnit();
  document.dispatchEvent(new Event("unitchange"));
}

unitC.addEventListener("click", () => setUnit("C"));
unitF.addEventListener("click", () => setUnit("F"));

highlightUnit();