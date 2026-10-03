// 1. Grab the button
const themeBtn = document.getElementById("themeBtn");

// 2. Switch the page between dark and light
function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeBtn.textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode";
}

// 3. Decide the starting theme: saved choice, or your device's setting
function loadTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
  } catch (error) {
    // if storage fails, fall through to the device setting
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

let isDark = loadTheme();
applyTheme(isDark);

// 4. Flip the theme when the button is clicked, and save it
themeBtn.addEventListener("click", () => {
  isDark = !isDark;
  applyTheme(isDark);

  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch (error) {
    // the theme still changes, it just won't be remembered
  }
});