document.addEventListener('DOMContentLoaded', function() {
    if (!CONFIG || !CONFIG.API_KEY || CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
        alert('请在 config.js 文件中设置您的 API 密钥');
    }
    
    // 初始化Swiper
    var swiper = new Swiper(".mySwiper", {
        pagination: {
            el: ".swiper-pagination",
            dynamicBullets: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
    });

    // AI对话功能
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessageToChat('user', message);
            userInput.value = '';
            
            try {
                const response = await fetchAIResponse(message);
                console.log('AI response:', response); // 添加日志
                addMessageToChat('ai', response);
            } catch (error) {
                console.error('Error:', error);
                addMessageToChat('ai', '抱歉，我遇到了一些问题。请稍后再试。');
            }
        }
    }

    async function fetchAIResponse(message) {
        if (!CONFIG || !CONFIG.API_KEY || CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
            throw new Error('API key not set. Please set your API key in config.js');
        }
        
        const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.API_KEY}`
                },
                body: JSON.stringify({
                    model: "glm-4-flash",
                    messages: [
                        {"role": "system", "content": "你是一个乐于回答各种问题的小助手，你的任务是提供专业、准确、有洞察力的建议。"},
                        {"role": "user", "content": message}
                    ],
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API response:', data); // 添加日志
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
        
        if (sender === 'ai') {
            // 使用marked库解析Markdown
            messageElement.innerHTML = marked.parse(message);
        } else {
            messageElement.textContent = message;
        }
        
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // 添加天气查询功能
    const api_key = "153cf4c100a7493baf02c3867c02b656";
    const city_id = "101020300"; // 上海的Location ID

    document.getElementById("weather-btn").addEventListener("click", function() {
        fetchWeatherData();
    });

    function fetchWeatherData() {
        const url = `https://devapi.qweather.com/v7/weather/now?location=${city_id}&key=${api_key}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.code === "200") {
                    displayWeatherData(data.now);
                } else {
                    console.error("获取天气数据失败:", data);
                }
            })
            .catch(error => console.error("请求错误:", error));
    }

    function displayWeatherData(weather) {
        const resultDiv = document.getElementById("weather-result");
        resultDiv.innerHTML = `
            <p>温度: ${weather.temp}°C</p>
            <p>体感温度: ${weather.feelsLike}°C</p>
            <p>天气状况: ${weather.text}</p>
            <p>风速: ${weather.windSpeed} km/h</p>
            <p>湿度: ${weather.humidity}%</p>
        `;
    }
});
