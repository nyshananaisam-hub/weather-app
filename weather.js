

const API_KEY = "c1e04f1d77d4436bb2556fc1a17902df"; 

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("error");
const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const favBtn = document.getElementById("favBtn");
const favList = document.getElementById("favList");

let currentCity = "";

// ഇൻപുട്ട് ബോക്സ് എംപ്റ്റി ആകുമ്പോൾ കാർഡുകൾ മറയ്ക്കാൻ
cityInput.addEventListener("input", (e) => {
    const city = e.target.value.trim();
    if (city === "") {
        loading.classList.add("hidden");
        errorMsg.classList.add("hidden");
        weatherCard.classList.add("hidden");
    }
});

// Search ബട്ടൺ ക്ലിക്ക് ചെയ്യുമ്പോൾ
if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        const city = cityInput.value.trim();
        if (city !== "") {
            getWeather(city);
        }
    });
}

// കീബോർഡിലെ 'Enter' കീ അമർത്തിയാൽ
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city !== "") {
            getWeather(city);
        }
    }
});

// Weather ഡാറ്റ ഫെച്ച് ചെയ്യാൻ async/await ഉപയോഗിക്കുന്നു
async function getWeather(city) {
    try {
        loading.classList.remove("hidden");
        errorMsg.classList.add("hidden");
        weatherCard.classList.add("hidden");

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        
        const weatherData = {
            city: data.name,
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        };

        displayWeather(weatherData);

    } catch (error) {
        errorMsg.classList.remove("hidden");
    } finally {
        loading.classList.add("hidden");
    }
}

// സ്ക്രീനിൽ വെതർ കാണിക്കാൻ
function displayWeather(data) {
    currentCity = data.city;
    cityName.innerText = data.city;
    temp.innerText = `Temperature: ${data.temp}°C`;
    desc.innerText = `Condition: ${data.description}`;
    humidity.innerText = `Humidity: ${data.humidity}%`;
    wind.innerText = `Wind Speed: ${data.windSpeed} m/s`;

    weatherCard.classList.remove("hidden");
}

// Favorites സിസ്റ്റം (localStorage ഉപയോഗിച്ച്)
favBtn.addEventListener("click", () => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    if (currentCity && !favorites.includes(currentCity)) {
        favorites.push(currentCity);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        loadFavorites();
    }
});

function loadFavorites() {
    favList.innerHTML = "";
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    favorites.forEach(city => {
        let li = document.createElement("li");
        
        // സിറ്റിയുടെ പേര് കാണിക്കുന്ന സ്പാൻ
        let span = document.createElement("span");
        span.innerText = city;
        span.addEventListener("click", () => {
            cityInput.value = city; 
            getWeather(city);       
        });
        li.appendChild(span);

        // ഡിലീറ്റ് ചെയ്യാൻ ഒരു ചെറിയ ബട്ടൺ (❌)
        let deleteBtn = document.createElement("button");
        deleteBtn.innerText = "✖️";
        deleteBtn.classList.add("delete-btn");
        
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // ലിസ്റ്റിൽ ക്ലിക്ക് ആവുന്നത് തടയാൻ
            removeFavorite(city);
        });

        li.appendChild(deleteBtn);
        favList.appendChild(li);
    });
}

// ലോക്കൽ സ്റ്റോറേജിൽ നിന്ന് സിറ്റി ഡിലീറ്റ് ചെയ്യുന്ന ഫങ്ക്ഷൻ
function removeFavorite(cityToRemove) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    // ഡിലീറ്റ് ചെയ്യേണ്ടതല്ലാത്ത സിറ്റികൾ മാത്രം ഫിൽട്ടർ ചെയ്ത് എടുക്കുന്നു
    favorites = favorites.filter(city => city !== cityToRemove);
    
    // വീണ്ടും localStorage-ൽ സേവ് ചെയ്യുന്നു
    localStorage.setItem("favorites", JSON.stringify(favorites));
    
    // ലിസ്റ്റ് വീണ്ടും അപ്ഡേറ്റ് ചെയ്യുന്നു
    loadFavorites();
}

// പേജ് ലോഡ് ചെയ്യുമ്പോൾ ഫേവറിറ്റ്സ് ലോഡ് ചെയ്യാൻ
window.onload = loadFavorites;






