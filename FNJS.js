async function fetchWeather() {
  const searchInputEl = document.getElementById("search");
  const weatherDataSection = document.getElementById("weather-data");
  const searchInput = searchInputEl.value.trim();
  const apiKey = "22cccc1fb9c7d50218828bffe6409d61"; 

  // Reset previous results
  weatherDataSection.style.display = "block";
  weatherDataSection.innerHTML = "";

  // Validate input
  if (!searchInput) {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please enter a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  try {
    // Get geolocation data
    const geocodeData = await getLonAndLat(searchInput, apiKey);
    if (!geocodeData) return; // Already handled invalid city inside getLonAndLat

    // Fetch weather data
    await getWeatherData(geocodeData.lon, geocodeData.lat, apiKey, weatherDataSection);

    // Clear input after successful search
    searchInputEl.value = "";

  } catch (error) {
    console.error("Unexpected error:", error);
    weatherDataSection.innerHTML = `
      <div>
        <h2>Error!</h2>
        <p>Something went wrong while fetching the weather. Please try again later.</p>
      </div>
    `;
  }
}

// Function to get longitude and latitude for a city
async function getLonAndLat(city, apiKey) {
  const countryCode = 1; 
  const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},${countryCode}&limit=1&appid=${apiKey}`;

  try {
    const response = await fetch(geocodeURL);
    if (!response.ok) throw new Error(`Geocode API error: ${response.status}`);

    const data = await response.json();
    if (!data.length) {
      document.getElementById("weather-data").innerHTML = `
        <div>
          <h2>Invalid City: "${city}"</h2>
          <p>Please enter a valid <u>city name</u>.</p>
        </div>
      `;
      return null;
    }

    return data[0];
  } catch (error) {
    console.error("Geocode fetch error:", error);
    document.getElementById("weather-data").innerHTML = `
      <div>
        <h2>Error!</h2>
        <p>Could not fetch location data. Please check your connection and try again.</p>
      </div>
    `;
    return null;
  }
}

// Function to get weather data using coordinates
async function getWeatherData(lon, lat, apiKey, displayEl) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const response = await fetch(weatherURL);
    if (!response.ok) throw new Error(`Weather API error: ${response.status}`);

    const data = await response.json();

    // Display weather information
    displayEl.style.display = "flex";
    displayEl.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" 
           alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>
    `;
  } catch (error) {
    console.error("Weather fetch error:", error);
    displayEl.innerHTML = `
      <div>
        <h2>Error!</h2>
        <p>Could not fetch weather data. Please try again later.</p>
      </div>
    `;
  }
}
