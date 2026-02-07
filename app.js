<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Location Map & Weather</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        :root {
            --primary: #4361ee;
            --secondary: #3a0ca3;
            --accent: #4cc9f0;
            --light: #f8f9fa;
            --dark: #212529;
            --success: #4ade80;
            --warning: #f59e0b;
            --danger: #ef4444;
            --gray: #6c757d;
            --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --radius: 16px;
            --transition: all 0.3s ease;
        }

        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            color: var(--dark);
        }

        .container {
            display: flex;
            flex-direction: column;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            gap: 20px;
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            margin-bottom: 10px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--primary);
        }

        .logo i {
            color: var(--accent);
        }

        .search-container {
            display: flex;
            gap: 10px;
            width: 100%;
            max-width: 400px;
        }

        .search-input {
            flex: 1;
            padding: 14px 20px;
            border: 2px solid #e2e8f0;
            border-radius: 50px;
            font-size: 1rem;
            transition: var(--transition);
            outline: none;
        }

        .search-input:focus {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(76, 201, 240, 0.3);
        }

        .search-button {
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 14px 24px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .search-button:hover {
            background: var(--secondary);
            transform: translateY(-2px);
        }

        .main-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        @media (max-width: 1024px) {
            .main-content {
                grid-template-columns: 1fr;
            }
        }

        .card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            padding: 24px;
            transition: var(--transition);
            height: 100%;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .card-title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.5rem;
            margin-bottom: 20px;
            color: var(--secondary);
            padding-bottom: 12px;
            border-bottom: 2px solid #e2e8f0;
        }

        .card-title i {
            color: var(--primary);
        }

        #map {
            height: 500px;
            width: 100%;
            border-radius: var(--radius);
            overflow: hidden;
            z-index: 1;
        }

        .weather-info {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .location-display {
            font-size: 1.4rem;
            font-weight: 600;
            color: var(--dark);
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px;
            background: linear-gradient(to right, #f8fafc, #e2e8f0);
            border-radius: var(--radius);
        }

        .weather-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }

        .weather-item {
            display: flex;
            flex-direction: column;
            padding: 16px;
            background: #f8fafc;
            border-radius: 12px;
            border-left: 4px solid var(--primary);
        }

        .weather-item .label {
            font-size: 0.9rem;
            color: var(--gray);
            margin-bottom: 8px;
        }

        .weather-item .value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--dark);
        }

        .weather-item i {
            margin-right: 8px;
            color: var(--primary);
        }

        .statement-container {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            padding: 24px;
            border-radius: var(--radius);
            text-align: center;
            font-size: 1.2rem;
            font-weight: 500;
            line-height: 1.6;
            margin-top: 10px;
        }

        .weather-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.7;
            transition: var(--transition);
        }

        .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
            gap: 20px;
            color: var(--gray);
        }

        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #e2e8f0;
            border-top: 5px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        footer {
            text-align: center;
            padding: 20px;
            color: var(--gray);
            font-size: 0.9rem;
            margin-top: 20px;
        }

        .weather-icon {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .temp-display {
            font-size: 3.5rem;
            font-weight: 800;
            color: var(--primary);
            line-height: 1;
        }

        .condition-display {
            font-size: 1.2rem;
            color: var(--gray);
            text-transform: capitalize;
        }

        .current-weather {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            background: linear-gradient(to right, #f0f9ff, #e0f2fe);
            border-radius: var(--radius);
        }

        .current-weather-left {
            display: flex;
            flex-direction: column;
        }

        @media (max-width: 768px) {
            header {
                flex-direction: column;
                gap: 20px;
            }
            
            .search-container {
                max-width: 100%;
            }
            
            .weather-details {
                grid-template-columns: 1fr;
            }
            
            .current-weather {
                flex-direction: column;
                text-align: center;
                gap: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="weather-background" id="weather-background"></div>
    
    <div class="container">
        <header>
            <div class="logo">
                <i class="fas fa-globe-americas"></i>
                <span>LiveMap Weather</span>
            </div>
            
            <div class="search-container">
                <input type="text" id="search-input" class="search-input" placeholder="Search for a city...">
                <button id="search-button" class="search-button">
                    <i class="fas fa-search"></i>
                    <span>Search</span>
                </button>
            </div>
        </header>
        
        <div class="main-content">
            <div class="card">
                <h2 class="card-title">
                    <i class="fas fa-map-marked-alt"></i>
                    Live Location Map
                </h2>
                <div id="map"></div>
                <div id="location" class="location-display">
                    <i class="fas fa-map-pin"></i>
                    <span>Fetching your location...</span>
                </div>
            </div>
            
            <div class="card">
                <h2 class="card-title">
                    <i class="fas fa-cloud-sun"></i>
                    Weather Information
                </h2>
                
                <div id="weather-container">
                    <div class="loading" id="weather-loading">
                        <div class="loading-spinner"></div>
                        <p>Loading weather data...</p>
                    </div>
                    
                    <div id="weather-content" style="display: none;">
                        <div class="current-weather">
                            <div class="current-weather-left">
                                <div id="weather-icon" class="weather-icon">⛅</div>
                                <div id="temperature" class="temp-display">--°C</div>
                                <div id="condition" class="condition-display">--</div>
                            </div>
                            <div>
                                <h3 id="city-name">--</h3>
                                <p id="welcome-message">Welcome to LiveMap Weather</p>
                            </div>
                        </div>
                        
                        <div class="weather-details">
                            <div class="weather-item">
                                <div class="label"><i class="fas fa-temperature-high"></i> Feels Like</div>
                                <div id="feels-like" class="value">--°C</div>
                            </div>
                            <div class="weather-item">
                                <div class="label"><i class="fas fa-tint"></i> Humidity</div>
                                <div id="humidity" class="value">--%</div>
                            </div>
                            <div class="weather-item">
                                <div class="label"><i class="fas fa-wind"></i> Wind Speed</div>
                                <div id="wind-speed" class="value">-- m/s</div>
                            </div>
                            <div class="weather-item">
                                <div class="label"><i class="fas fa-compress-alt"></i> Pressure</div>
                                <div id="pressure" class="value">-- hPa</div>
                            </div>
                        </div>
                        
                        <div id="statement-container" class="statement-container">
                            <p id="statement">Loading your personalized weather statement...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <footer>
            <p>LiveMap Weather &copy; 2023 | Real-time location and weather data</p>
            <p>Weather data provided by OpenWeatherMap | Map data from OpenStreetMap</p>
        </footer>
    </div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
        // Initialize map variable
        let map;
        let userMarker;
        let currentLatitude, currentLongitude;
        
        // Weather condition to background mapping
        const weatherBackgrounds = {
            sunny: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
            rainy: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
            snowy: "linear-gradient(135deg, #e6dada 0%, #b2c8e8 100%)",
            cloudy: "linear-gradient(135deg, #d4d4dc 0%, #a3bded 100%)",
            clear: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
            thunderstorm: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
            drizzle: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
            default: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
        };
        
        // Weather statements
        const statements = {
            sunny: [
                "It's a perfect day to soak up the sun! ☀️",
                "Bright skies ahead—time to get outside! 🌞",
                "Sunshine is nature's way of saying, 'Go for it!' 🌻",
            ],
            rainy: [
                "Rainy days are perfect for cozy vibes. ☔",
                "Don't forget your umbrella—it's a great day for puddle jumping! 🌧️",
                "Rain brings growth—embrace the rhythm of nature. 🌿",
            ],
            snowy: [
                "Snowflakes are nature's confetti—enjoy the magic! ❄️",
                "Bundle up and make the most of this winter wonderland! ⛄",
                "Snowy days are perfect for hot cocoa and warm blankets. ☕",
            ],
            cloudy: [
                "Cloudy skies can't dim your shine! 🌥️",
                "Perfect weather for a calm and peaceful day. ☁️",
                "Clouds are just the sky's way of taking a break. 🌤️",
            ],
            clear: [
                "Clear skies and perfect visibility for your adventures! 🌟",
                "A pristine day with endless possibilities ahead! ✨",
                "Nature is showing off today with this crystal clear sky! 🌌",
            ],
            thunderstorm: [
                "Nature's light show! Stay safe and enjoy the spectacle from indoors. ⚡",
                "Thunderstorms bring renewal—embrace the power of nature. 🌩️",
                "Perfect weather for staying in with a good book and warm drink. 📖",
            ],
            drizzle: [
                "A gentle drizzle to refresh the earth. Perfect for a contemplative walk. 🌦️",
                "Soft rain brings a peaceful atmosphere to your day. 🌧️",
                "The light rain is nature's way of whispering serenity. 🍃",
            ]
        };
        
        // Weather icons mapping
        const weatherIcons = {
            sunny: "☀️",
            rainy: "🌧️",
            snowy: "❄️",
            cloudy: "☁️",
            clear: "☀️",
            thunderstorm: "⛈️",
            drizzle: "🌦️",
            default: "⛅"
        };
        
        // Initialize the map
        function initMap(lat, lon, zoom = 13) {
            if (!map) {
                map = L.map('map').setView([lat, lon], zoom);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 18,
                }).addTo(map);
            } else {
                map.setView([lat, lon], zoom);
            }
            
            // Add or update user marker
            if (userMarker) {
                map.removeLayer(userMarker);
            }
            
            userMarker = L.marker([lat, lon]).addTo(map)
                .bindPopup('You are here!')
                .openPopup();
            
            // Add a circle to show accuracy area
            L.circle([lat, lon], {
                color: '#4361ee',
                fillColor: '#4361ee',
                fillOpacity: 0.1,
                radius: 500
            }).addTo(map);
        }
        
        // Display a random statement
        function displayStatement(weatherCondition) {
            const statementElement = document.getElementById("statement");
            const condition = weatherCondition in statements ? weatherCondition : "sunny";
            const randomIndex = Math.floor(Math.random() * statements[condition].length);
            statementElement.textContent = statements[condition][randomIndex];
        }
        
        // Set weather background
        function setWeatherBackground(weatherCondition) {
            const backgroundElement = document.getElementById("weather-background");
            const condition = weatherCondition in weatherBackgrounds ? weatherCondition : "default";
            backgroundElement.style.background = weatherBackgrounds[condition];
        }
        
        // Set weather icon
        function setWeatherIcon(weatherCondition) {
            const iconElement = document.getElementById("weather-icon");
            const condition = weatherCondition in weatherIcons ? weatherCondition : "default";
            iconElement.textContent = weatherIcons[condition];
        }
        
        // Get user location
        function getUserLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        currentLatitude = position.coords.latitude;
                        currentLongitude = position.coords.longitude;
                        
                        // Initialize map with user's location
                        initMap(currentLatitude, currentLongitude);
                        
                        // Fetch city name and weather data
                        fetchCityName(currentLatitude, currentLongitude);
                    },
                    (error) => {
                        console.error("Error fetching location:", error);
                        displayLocationError();
                        // Default to a known location if user denies geolocation
                        currentLatitude = 40.7128;
                        currentLongitude = -74.0060;
                        initMap(currentLatitude, currentLongitude, 10);
                        fetchCityName(currentLatitude, currentLongitude);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
                // Default to New York
                currentLatitude = 40.7128;
                currentLongitude = -74.0060;
                initMap(currentLatitude, currentLongitude, 10);
                fetchCityName(currentLatitude, currentLongitude);
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
                displayLocation("Unknown Location");
                fetchWeatherData(lat, lon);
            }
        }
        
        // Display location
        function displayLocation(city) {
            const locationElement = document.getElementById("location");
            locationElement.innerHTML = `<i class="fas fa-map-pin"></i><span>📍 Your Location: ${city}</span>`;
        }
        
        // Fetch weather data and display statement
        async function fetchWeatherData(lat, lon) {
            const apiKey = "d5f4cabc70e13146b049e496247b8ecc";
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        
            try {
                const response = await fetch(url);
                const data = await response.json();
                
                // Hide loading, show content
                document.getElementById("weather-loading").style.display = "none";
                document.getElementById("weather-content").style.display = "block";
                
                // Extract weather condition
                const weatherCondition = data.weather[0].main.toLowerCase();
                const detailedCondition = data.weather[0].description.toLowerCase();
                
                // Determine which condition category to use
                let conditionCategory = "default";
                if (detailedCondition.includes("clear") || detailedCondition.includes("sun")) {
                    conditionCategory = "sunny";
                } else if (detailedCondition.includes("rain")) {
                    conditionCategory = "rainy";
                } else if (detailedCondition.includes("snow")) {
                    conditionCategory = "snowy";
                } else if (detailedCondition.includes("cloud")) {
                    conditionCategory = "cloudy";
                } else if (detailedCondition.includes("thunderstorm")) {
                    conditionCategory = "thunderstorm";
                } else if (detailedCondition.includes("drizzle")) {
                    conditionCategory = "drizzle";
                }
                
                // Update UI with weather data
                displayWeather(data);
                displayStatement(conditionCategory);
                setWeatherBackground(conditionCategory);
                setWeatherIcon(conditionCategory);
                
                // Update welcome message
                displayWelcomeMessage(data.name);
            } catch (error) {
                console.error("Error fetching weather data:", error);
                document.getElementById("weather-loading").style.display = "none";
                document.getElementById("weather-content").style.display = "block";
                document.getElementById("statement").textContent = "Unable to load weather data. Please try again later.";
            }
        }
        
        // Display weather data
        function displayWeather(data) {
            document.getElementById("city-name").textContent = `${data.name}, ${data.sys.country}`;
            document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById("condition").textContent = data.weather[0].description;
            document.getElementById("feels-like").textContent = `${Math.round(data.main.feels_like)}°C`;
            document.getElementById("humidity").textContent = `${data.main.humidity}%`;
            document.getElementById("wind-speed").textContent = `${data.wind.speed} m/s`;
            document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;
        }
        
        // Display welcome message
        function displayWelcomeMessage(city) {
            document.getElementById("welcome-message").textContent = `Welcome to ${city}! Stay updated with the current weather 🌍`;
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
        
        // Allow Enter key to trigger search
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                searchButton.click();
            }
        });
        
        // Fetch weather data for searched city
        async function fetchWeatherByCity(city) {
            const apiKey = "d5f4cabc70e13146b049e496247b8ecc";
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("City not found");
                const data = await response.json();
                
                // Update map to the searched city
                currentLatitude = data.coord.lat;
                currentLongitude = data.coord.lon;
                initMap(currentLatitude, currentLongitude);
                
                // Update weather display
                displayWeather(data);
                displayWelcomeMessage(data.name);
                
                // Determine weather condition category
                const detailedCondition = data.weather[0].description.toLowerCase();
                let conditionCategory = "default";
                if (detailedCondition.includes("clear") || detailedCondition.includes("sun")) {
                    conditionCategory = "sunny";
                } else if (detailedCondition.includes("rain")) {
                    conditionCategory = "rainy";
                } else if (detailedCondition.includes("snow")) {
                    conditionCategory = "snowy";
                } else if (detailedCondition.includes("cloud")) {
                    conditionCategory = "cloudy";
                } else if (detailedCondition.includes("thunderstorm")) {
                    conditionCategory = "thunderstorm";
                } else if (detailedCondition.includes("drizzle")) {
                    conditionCategory = "drizzle";
                }
                
                displayStatement(conditionCategory);
                setWeatherBackground(conditionCategory);
                setWeatherIcon(conditionCategory);
                
                // Update location display
                displayLocation(`${data.name}, ${data.sys.country}`);
                
                // Clear search input
                searchInput.value = "";
                
            } catch (error) {
                console.error("Error fetching weather data:", error);
                alert("City not found. Please try another city name.");
            }
        }
        
        // Initialize the application when the page loads
        window.addEventListener("load", () => {
            getUserLocation();
        });
    </script>
</body>
</html>
