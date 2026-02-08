async function fetchWeather() {
  const input = document.getElementById("search");
  const weatherDataSection = document.getElementById("weather-data");
  const searchInput = input.value.trim();

  // დასუფთავება
  weatherDataSection.style.display = "none";
  weatherDataSection.innerHTML = "";

  // Empty input
  if (searchInput === "") {
    weatherDataSection.style.display = "block";
    weatherDataSection.innerHTML = `
      <div>
        <h2>❗ Empty Input!</h2>
        <p>Please type a city name.</p>
      </div>
    `;
    return;
  }

  // ---------- Inner functions mimic API ----------
  async function getLonAndLat() {
    // უბრალოდ დUMMY data
    const fixedCities = ["Kutaisi", "Berlin", "New York", "Warsaw"];
    if (!fixedCities.includes(searchInput)) return null;
    return { name: searchInput };
  }

  async function getWeatherData(cityObj) {
    const temps = {
      Kutaisi: 15,
      Berlin: 3,
      "New York": 21,
      Warsaw: -10
    };
    return { 
      name: cityObj.name, 
      main: { temp: temps[cityObj.name] }, 
      weather: [{ description: "Sunny", icon: "01d" }] 
    };
  }

  // ---------- Main flow ----------
  const geo = await getLonAndLat();

  if (!geo) {
    weatherDataSection.style.display = "block";
    weatherDataSection.innerHTML = `
      <div>
        <h2>❌ City not supported</h2>
        <p>Try one of: Kutaisi, Berlin, New York, Warsaw</p>
      </div>
    `;
    return;
  }

  const weather = await getWeatherData(geo);

  // ---------- Display ----------
  weatherDataSection.style.display = "flex";
  weatherDataSection.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" 
         alt="${weather.weather[0].description}" width="100" />
    <div>
      <h2>${weather.name}</h2>
      <p><strong>Temperature:</strong> ${weather.main.temp}°C</p>
      <p><strong>Description:</strong> ${weather.weather[0].description}</p>
    </div>
  `;

  input.value = "";
}
