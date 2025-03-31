// Weather condition to background mapping


  
  // Weather statements
  const statements = {
    sunny: [
      "It’s a perfect day to soak up the sun! ☀️",
      "Bright skies ahead—time to get outside! 🌞",
      "Sunshine is nature’s way of saying, ‘Go for it!’ 🌻",
    ],
    rainy: [
      "Rainy days are perfect for cozy vibes. ☔",
      "Don’t forget your umbrella—it’s a great day for puddle jumping! 🌧️",
      "Rain brings growth—embrace the rhythm of nature. 🌿",
    ],
    snowy: [
      "Snowflakes are nature’s confetti—enjoy the magic! ❄️",
      "Bundle up and make the most of this winter wonderland! ⛄",
      "Snowy days are perfect for hot cocoa and warm blankets. ☕",
    ],
    cloudy: [
      "Cloudy skies can’t dim your shine! 🌥️",
      "Perfect weather for a calm and peaceful day. ☁️",
      "Clouds are just the sky’s way of taking a break. 🌤️",
    ],
  };
  
  // Display a random statement
  function displayStatement(weatherCondition) {
    const statementElement = document.getElementById("statement");
    const randomIndex = Math.floor(Math.random() * statements[weatherCondition].length);
    statementElement.textContent = statements[weatherCondition][randomIndex];
  }
  
  // Display welcome message
  const welcomeMessageElement = document.getElementById("welcome-message");
  
  function displayWelcomeMessage(city) {
    welcomeMessageElement.textContent = `Welcome and stay updated with the current weather 🌍`;
  }
  
  // Get user location
  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityName(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
          displayLocationError();
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }
  
  // Fetch city name using reverse geocoding
  async function fetchCityName(lat, lon) {
    const apiKey = "d5f4cabc70e13146b049e496247b8ecc";
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      const city = data[0].name;
      displayLocation(city);
      fetchWeatherData(lat, lon);
    } catch (error) {
      console.error("Error fetching city name:", error);
    }
  }
  
  // Display location
  function displayLocation(city) {
    const locationElement = document.getElementById("location");
    locationElement.textContent = `📍 Your Location: ${city}`;
  }
  
  // Fetch weather data and display statement
  async function fetchWeatherData(lat, lon) {
    const apiKey = "d5f4cabc70e13146b049e496247b8ecc";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      const weatherCondition = data.weather[0].main.toLowerCase();
      displayStatement(weatherCondition);
      setWeatherBackground(weatherCondition); // Set dynamic background
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }
  
  // Search functionality
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  
  searchButton.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city !== "") {
      fetchWeatherByCity(city);
    } else {
      alert("Please enter a city name.");
    }
  });
  
  // Fetch weather data for searched city
  async function fetchWeatherByCity(city) {
    const apiKey = "d5f4cabc70e13146b049e496247b8ecc";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("City found");
      const data = await response.json();
      displayWelcomeMessage(data.name);
      displayWeather(data);
      displayStatement(data.weather[0].main.toLowerCase());
      setWeatherBackground(data.weather[0].main.toLowerCase()); // Set dynamic background
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("City found, congratulations.");
    }
  }
  
  // Display weather data
  function displayWeather(data) {
    const weatherElement = document.getElementById("weather-info");
    weatherElement.innerHTML = `
      <h2>Weather in ${data.name}, ${data.sys.country}</h2>
      <p>Temperature: ${Math.round(data.main.temp)}°C</p>
      <p>Condition: ${data.weather[0].description}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
      <p>Current View: ${data.weather[0].main}</p>
    `;
  }
  
  // Call this function when the page loads
  window.addEventListener("load", () => {
    getUserLocation();
  });
  