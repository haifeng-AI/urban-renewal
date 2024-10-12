document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('city-input');
    const weatherBtn = document.getElementById('weather-btn');
    const weatherResult = document.getElementById('weather-result');

    // 添加错误处理，确保所有元素都存在
    if (!cityInput || !weatherBtn || !weatherResult) {
        console.error('无法找到必要的DOM元素');
        return;
    }

    weatherBtn.addEventListener('click', function() {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        } else {
            weatherResult.textContent = '请输入有效的城市名称';
        }
    });

    async function getWeather(city) {
        const apiKey = 'dd4836763f4645f4a216512911c74f12'; // 替换为您的和风天气API密钥
        const url = `https://devapi.qweather.com/v7/weather/now?location=${encodeURIComponent(city)}&key=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.code === '200') {
                const weather = `
                    <h3>${city}天气</h3>
                    <p>温度: ${data.now.temp}°C</p>
                    <p>天气: ${data.now.text}</p>
                    <p>湿度: ${data.now.humidity}%</p>
                    <p>风速: ${data.now.windSpeed} km/h</p>
                `;
                weatherResult.innerHTML = weather;
            } else {
                weatherResult.textContent = '未找到该城市的天气信息';
            }
        } catch (error) {
            console.error('获取天气信息时出错:', error);
            weatherResult.textContent = '获取天气信息时出错，请稍后再试';
        }
    }
});
