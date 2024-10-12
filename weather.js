document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('city-input');
    const weatherBtn = document.getElementById('weather-btn');
    const weatherResult = document.getElementById('weather-result');

    weatherBtn.addEventListener('click', function() {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        } else {
            weatherResult.innerHTML = '请输入有效的城市名称';
        }
    });

    async function getWeather(city) {
        const apiKey = 'dd4836763f4645f4a216512911c74f12'; // 替换为您的 OpenWeatherMap API 密钥
        const url = 'http://devapi.qweather.com/v7/weather/now';

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod === 200) {
                const weather = `
                    <h3>${data.name}天气</h3>
                    <p>温度: ${data.main.temp}°C</p>
                    <p>天气: ${data.weather[0].description}</p>
                    <p>湿度: ${data.main.humidity}%</p>
                    <p>风速: ${data.wind.speed} m/s</p>
                `;
                weatherResult.innerHTML = weather;
            } else {
                weatherResult.innerHTML = '未找到该城市的天气信息';
            }
        } catch (error) {
            console.error('获取天气信息时出错:', error);
            weatherResult.innerHTML = '获取天气信息时出错，请稍后再试';
        }
    }
});