(function() {
    // Create HTML structure
    const chatbotHtml = `
    <button id="chat-launcher" onclick="toggleWidget()">
        <svg viewBox="0 0 448 512" width="30" height="30">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.7 27.2 106.2 27.2h.1c122.3 0 222-99.6 222-222 0-59.3-23-115.1-65.1-157.1zM223.9 445.5c-33.1 0-65.7-8.9-94.1-25.7l-6.7-4-69.8 18.3 18.7-68-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.4-16.3-14.5-27.3-32.5-30.5-37.9-3.2-5.6-.4-8.6 2.4-11.4 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.2 3.7-5.5 5.5-9.2 1.9-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.3 5.7 23.6 9.2 31.7 11.7 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" fill="white" />
        </svg>
    </button>
    <div id="chat-widget">
        <header>
            <span>Consulta lo que necesites</span>
            <button class="close-btn" onclick="toggleWidget()">✖</button>
        </header>
        <div id="chat-container">
            <div class="message bot">
                <div class="avatar">AI</div>
                <div class="bubble">
                    Hola, ¡en qué podemos ayudarte!<br><br>
                    1️⃣ General<br>
                    2️⃣ Contabilidad<br>
                    3️⃣ Soporte técnico<br>
                    4️⃣ Cotizar servicio
                </div>
            </div>
        </div>
        <div id="input-area">
            <div class="input-wrapper">
                <textarea id="user-input" rows="1" placeholder="Escribe aquí..."></textarea>
                <button id="send-btn" disabled>➤</button>
            </div>
        </div>
    </div>`;

    const div = document.createElement('div');
    div.innerHTML = chatbotHtml;
    document.body.appendChild(div);

    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const widget = document.getElementById('chat-widget');
    const webhookUrl = "https://automatizaciones-n8n.tzudkj.easypanel.host/webhook/1d349e93-ce40-4084-843d-98c096dfc343/chat";
    
    window.toggleWidget = function() {
        widget.classList.toggle('open');
        if (widget.classList.contains('open')) userInput.focus();
    }
    
    userInput.addEventListener('input', () => {
        sendBtn.disabled = !userInput.value.trim();
    });
    
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    sendBtn.addEventListener('click', sendMessage);
    
    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;
        addMessage(text, 'user');
        userInput.value = '';
        sendBtn.disabled = true;
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            if (response.ok) {
                const data = await response.json();
                let botText = data.output || data.text || data.message || "Lo siento, hubo un error.";
                addMessage(botText, 'bot');
            }
        } catch (error) {
            addMessage("Error de conexión.", 'bot');
        }
    }
    
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        const avatarHtml = sender === 'bot' ? '<div class="avatar">AI</div>' : '';
        const formattedText = text.replace(/\n/g, '<br>');
        msgDiv.innerHTML = `${avatarHtml}<div class="bubble">${formattedText}</div>`;
        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
})();
