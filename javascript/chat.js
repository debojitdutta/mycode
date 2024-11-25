function sendMessage() {
    const chatBody = document.getElementById('chatBody');
    const userInput = document.getElementById('userInput').value;

    if (userInput.trim() !== "") {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerText = userInput;
        chatBody.appendChild(userMessage);

        // Clear input field
        document.getElementById('userInput').value = "";

        // Simulate bot response
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.innerText = 'Let me think...'; // This is where you add AI response
            chatBody.appendChild(botMessage);

            // Scroll to the bottom of chat
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000);
    }
}