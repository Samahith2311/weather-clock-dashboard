# Weather & World Clock Dashboard

A simple, good-looking dashboard that shows **live weather** and **local time** for cities around the world. Search any city, track your favourite cities on a world clock, and click a city card to see its full weather.

Built with plain HTML, CSS and JavaScript. No frameworks, no build step, and no API key needed.

## Live demo

🌐 **[weatherworldclockdashboard.netlify.app](https://weatherworldclockdashboard.netlify.app/)**

## Features

- **City weather search:** current temperature, conditions, humidity, wind speed, sunrise and sunset
- **5-day forecast chart:** a smooth temperature curve with weekday and weather icons
- **Rain summary:** rain expected today and over the next 5 days
- **World clock:** live clocks for cities across the world, ticking every second
- **Weather on every clock card:** temperature and conditions next to the local time
- **Day/night look:** each city card changes style depending on whether it is day or night there
- **Click a card to open it:** loads that city's full weather into the main dashboard
- **Add and remove cities:** your list is saved in your browser
- **°C / °F toggle:** switch temperature units instantly, and your choice is remembered
- **Dark mode:** light and dark themes, saved between visits
- **Remembers your last city:** the dashboard opens with the city you viewed last
- **Responsive layout:** works on desktop and mobile screens

## Tech used

- HTML, CSS, JavaScript (no libraries)
- [Open-Meteo](https://open-meteo.com/) for weather data and city search (free, no API key)
- Browser `Intl` APIs for time zones and clocks
- Browser `localStorage` for saving cities, theme, unit and last city
- [Google Sans](https://fonts.google.com/) font via Google Fonts
- [Netlify](https://www.netlify.com/) for hosting

## Getting started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Samahith2311/weather-clock-dashboard.git
   cd weather-clock-dashboard
   ```

2. **Open the project**

   Open `index.html` in your web browser (double-click the file). That's all, there is nothing to install.

   An internet connection is needed because the weather data and the font are loaded online.

## How to use

- Type a city name in the search box at the top and press **Enter** to see its weather.
- Use the **°C / °F** buttons to change temperature units.
- Click **Dark mode** to switch themes.
- In the **World Clock** section, type a city and click **Add City** to add a card.
- Click the **✕** on a card to remove it.
- Click anywhere else on a card to load that city into the main dashboard above.

## Project structure

```
weather-clock-dashboard/
├── index.html          # page layout
├── css/
│   └── style.css       # all styles, colors, dark mode, day/night cards
├── js/
│   ├── theme.js        # dark / light mode toggle
│   ├── utils.js        # weather code → icon and description
│   ├── units.js        # °C / °F toggle and temperature formatting
│   ├── clock.js        # world clock cards, add/remove cities, city weather
│   └── main.js         # main dashboard: search, banner, stats, chart
├── assets/             # extra images and icons (optional)
└── README.md
```

The scripts are loaded in this order in `index.html`: `theme.js`, `utils.js`, `units.js`, `clock.js`, `main.js`. The order matters because later files use functions from earlier ones.

## How it works

1. A city name is turned into coordinates and a time zone using the Open-Meteo **geocoding API**.
2. The coordinates are sent to the Open-Meteo **forecast API**, which returns current weather, sunrise and sunset, rain, and a 5-day forecast.
3. The data is drawn on the page: the banner, stat cards, rain bar, and a chart built with SVG.
4. Clocks use the browser's built-in time zone support, so they need no extra data.

## Ideas for the future

- Hourly forecast for the next 24 hours
- Detect the user's location automatically
- Real photo or illustration for the banner
- Wind speed unit toggle (km/h and mph)

## Credits

- Weather data by [Open-Meteo](https://open-meteo.com/)
- UI design inspired by a weather dashboard reference

## License

This project is for learning and personal use.