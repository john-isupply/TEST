document.addEventListener('DOMContentLoaded', () => {
    const addQuestionButton = document.getElementById('addQuestionButton');
    const viewQuestionsButton = document.getElementById('viewQuestionsButton');
    const addFormContainer = document.getElementById('addFormContainer');
    const questionsListContainer = document.getElementById('questionsListContainer');
    const questionsContainer = document.getElementById('questionsContainer');
    let currentQuestion = null;

    addQuestionButton.addEventListener('click', () => {
        addFormContainer.style.display = 'block';
        questionsListContainer.style.display = 'none';
    });

    viewQuestionsButton.addEventListener('click', loadQuestions);

    document.getElementById('addForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const question = document.getElementById('addQuestion').value;
        const answer = document.getElementById('addAnswer').value;
        const arabicSeller = document.getElementById('addArabicSeller').value;
        const englishSeller = document.getElementById('addEnglishSeller').value;
        const language = document.getElementById('addLanguage').value;

        await fetch('/admin/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, answer, arabicSeller, englishSeller, language })
        });

        hideAddForm();
        loadQuestions();
    });

    async function loadQuestions() {
        const response = await fetch('/admin/questions');
        const questions = await response.json();
        questionsContainer.innerHTML = '';
        questions.forEach((question, index) => {
            const questionItem = document.createElement('div');
            questionItem.classList.add('question-item');
            questionItem.innerHTML = `
                <p><strong>${index + 1}. السؤال:</strong> ${question.Question}</p>
                <p><strong>الإجابة الحالية:</strong> ${question.Answer}</p>
                <p><strong>الوقت:</strong> ${question.Timestamp}</p>
                <button onclick="markCorrect('${question.Question}', '${question.Answer}', '${question.Language}', '${question.seller}', '${question['المخزن']}')">صح</button>
                <button onclick="markIncorrect('${question.Question}', '${question.Answer}', '${question.Language}', '${question.seller}', '${question['المخزن']}')">غلط</button>
            `;
            questionsContainer.appendChild(questionItem);
        });
        questionsListContainer.style.display = 'block';
        addFormContainer.style.display = 'none';
    }

    window.markCorrect = async (question, answer, language, seller, arabicSeller) => {
        await fetch('/admin/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, correctAnswer: answer, isCorrect: true, language, arabicSeller, englishSeller: seller })
        });
        loadQuestions();
    };

    window.markIncorrect = (question, answer, language, seller, arabicSeller) => {
        document.getElementById('addQuestion').value = question;
        document.getElementById('addAnswer').value = answer;
        document.getElementById('addArabicSeller').value = arabicSeller;
        document.getElementById('addEnglishSeller').value = seller;
        document.getElementById('addLanguage').value = language;
        addFormContainer.style.display = 'block';
        questionsListContainer.style.display = 'none';
        currentQuestion = question;
    };

    document.getElementById('saveButton').addEventListener('click', async () => {
        const question = document.getElementById('addQuestion').value;
        const answer = document.getElementById('addAnswer').value;
        const arabicSeller = document.getElementById('addArabicSeller').value;
        const englishSeller = document.getElementById('addEnglishSeller').value;
        const language = document.getElementById('addLanguage').value;

        await fetch('/admin/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: currentQuestion, correctAnswer: answer, isCorrect: false, language, arabicSeller, englishSeller })
        });

        hideAddForm();
        loadQuestions();
    });

    window.hideAddForm = () => {
        addFormContainer.style.display = 'none';
    };
});
