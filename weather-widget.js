// Weather widget for Atlanta, GA using Open-Meteo
(function() {
    const lat = 33.7490;
    const lon = -84.3880;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

    const widget = document.getElementById('weather-widget');
    const loading = widget.querySelector('.weather-loading');
    const content = widget.querySelector('.weather-content');
    const error = widget.querySelector('.weather-error');
    const temp = widget.querySelector('.weather-temp');
    const cond = widget.querySelector('.weather-condition');
    const wind = widget.querySelector('.weather-wind');

    fetch(url, {cache: 'reload'})
        .then(r => r.json())
        .then(data => {
            if (!data.current_weather) throw new Error('No data');
            loading.style.display = 'none';
            content.style.display = '';
            temp.textContent = Math.round(data.current_weather.temperature) + '°C';
            cond.textContent = weatherCodeToText(data.current_weather.weathercode);
            wind.textContent = 'Wind: ' + Math.round(data.current_weather.windspeed) + ' km/h';
        })
        .catch(() => {
            loading.style.display = 'none';
            error.style.display = '';
        });

    // Simple mapping for Open-Meteo weather codes
    function weatherCodeToText(code) {
        const map = {
            0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
            45: 'Fog', 48: 'Depositing rime fog',
            51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
            56: 'Freezing drizzle', 57: 'Freezing drizzle',
            61: 'Slight rain', 63: 'Rain', 65: 'Heavy rain',
            66: 'Freezing rain', 67: 'Freezing rain',
            71: 'Slight snow', 73: 'Snow', 75: 'Heavy snow',
            77: 'Snow grains', 80: 'Rain showers', 81: 'Rain showers', 82: 'Rain showers',
            85: 'Snow showers', 86: 'Snow showers',
            95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
        };
        return map[code] || 'Unknown';
    }
})();
