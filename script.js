const recentCitiesDropdown = document.getElementById("recent-cities");
const API_KEY = 'your-api-key-here';


// Function to load recent cities from local storage
const loadRecentCities = () => {
    const recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
    recentCitiesDropdown.innerHTML = recentCities.length
        ? recentCities.map(city => `<option value="${city}">${city}</option>`).join("")
        : '<option value="">No Recent Searches</option>';
};

// Function to save a city to recent searches
const saveRecentCity = (cityName) => {
    let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
    if (!recentCities.includes(cityName)) {
        if (recentCities.length >= 5) recentCities.pop();
        recentCities.unshift(cityName);
        localStorage.setItem("recentCities", JSON.stringify(recentCities));
        loadRecentCities();
    }
};

// Function to handle recent city selection
recentCitiesDropdown.addEventListener("change", (e) => {
    if (e.target.value) {
        cityInput.value = e.target.value;
        getCityCoordinates();
    }
});

// Update getCityCoordinates to save recent city
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return alert("Please enter a city name");

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { name, lat, lon } = data[0];
            saveRecentCity(name);  // Save city to recent searches
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the city coordinates.");
        });
};

// Call loadRecentCities on page load
loadRecentCities();
