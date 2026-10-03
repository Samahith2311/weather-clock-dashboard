// Turn a weather code number into an emoji and a word
function describeWeather(code) {
  if (code === 0) return { icon: "☀️", text: "Clear" };
  if (code <= 3) return { icon: "⛅", text: "Partly cloudy" };
  if (code <= 48) return { icon: "🌫️", text: "Fog" };
  if (code <= 67) return { icon: "🌧️", text: "Rain" };
  if (code <= 77) return { icon: "❄️", text: "Snow" };
  if (code <= 82) return { icon: "🌦️", text: "Showers" };
  return { icon: "⛈️", text: "Thunderstorm" };
}