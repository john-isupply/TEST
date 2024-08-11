document.addEventListener('DOMContentLoaded', () => {
    const questionInput = document.getElementById('question');
    const languageSelect = document.getElementById('language');
    const sendButton = document.getElementById('sendButton');
    const chatWindow = document.getElementById('chatWindow');
    const chatLog = document.getElementById('chatLog');

    const appendMessage = (message, sender) => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        messageElement.innerHTML = message;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    const logChat = (question, answer, date) => {
        const logElement = document.createElement('div');
        logElement.className = 'log-entry';
        logElement.innerHTML = `<strong>${date}</strong><br>سؤال: ${question}<br>جواب: ${answer}`;
        chatLog.appendChild(logElement);
    };

    const handleSend = async () => {
        const question = questionInput.value.trim();
        const language = languageSelect.value;

        if (question) {
            appendMessage(question, 'user');

            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question, language })
            });

            const data = await response.json();
            if (data.type === 'answer') {
                appendMessage(data.answer, 'bot');
            } else if (data.type === 'suggestion') {
                let suggestionsHTML = '<strong>لم يتم العثور على إجابة مباشرة. يرجى اختيار المخزن المناسب:</strong><br>';
                data.suggestions.forEach(suggestion => {
                    suggestionsHTML += `<button onclick="selectSuggestion('${suggestion}')">${suggestion}</button><br>`;
                });
                appendMessage(suggestionsHTML, 'bot');
            } else if (data.type === 'similarQuestions') {
                let similarQuestionsHTML = '<strong>لم يتم العثور على إجابة مباشرة. الأسئلة المشابهة:</strong><br>';
                data.similarQuestions.forEach(question => {
                    similarQuestionsHTML += `<button onclick="selectSimilarQuestion('${question}')">${question}</button><br>`;
                });
                appendMessage(similarQuestionsHTML, 'bot');
            }

            const date = new Date().toLocaleString();
            logChat(question, data.answer, date);

            questionInput.value = '';
        }
    };

    window.selectSuggestion = (suggestion) => {
        questionInput.value = suggestion;
        handleSend();
    };

    window.selectSimilarQuestion = (question) => {
        questionInput.value = question;
        handleSend();
    };

    sendButton.addEventListener('click', handleSend);
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
});
