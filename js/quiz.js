import {loadQuizData} from './dataLoader.js';
let quizData = {}; // To hold the quiz data loaded from JSON
let currentCategory = 'anatomy'; // Default category (can be updated dynamically)
let currentQuizIndex = 0; // Track the current question index
let score = 0; // Track the user's score


// Function to render a quiz question
export function loadQuiz(index = 0) {
    const contentArea = document.getElementById('dynamicContent');

    // Validate quiz data and category
    if (!quizData || Object.keys(quizData).length === 0) {
        console.error('Quiz data is not loaded.');
        contentArea.innerHTML = '<p>Error: Quiz data is not available.</p>';
        return;
    }

    const categoryQuizzes = quizData[currentCategory];
    if (!Array.isArray(categoryQuizzes) || index >= categoryQuizzes.length) {
        // Show "Quiz Completed" only when the index exceeds available questions
        contentArea.innerHTML = `
            <div class="quiz-end">
                <h3>Quiz Completed!</h3>
                <p>Your score: ${score} / ${categoryQuizzes.length}</p>
                <button id="restartQuiz" class="quiz-restart">Restart Quiz</button>
            </div>
        `;

        const restartButton = document.getElementById('restartQuiz');
        restartButton.addEventListener('click', () => {
            currentQuizIndex = 0;
            score = 0;
            loadQuiz(currentQuizIndex);
        });

        return;
    }

    // Display the quiz question
    const quiz = categoryQuizzes[index];
    contentArea.innerHTML = `
        <div class="quiz-container">
            <h3>${quiz.question}</h3>
            <ul class="quiz-options">
                ${quiz.options.map((option, i) => `
                    <li>
                        <button class="quiz-option" data-correct="${i === quiz.correctAnswer}">
                            ${option}
                        </button>
                    </li>
                `).join('')}
            </ul>
            <p id="feedback" class="quiz-feedback"></p>
            <button id="nextQuiz" class="quiz-next hidden">Next Question</button>
        </div>
    `;

    const optionButtons = contentArea.querySelectorAll('.quiz-option');
    const feedbackElement = document.getElementById('feedback');
    const nextButton = document.getElementById('nextQuiz');

    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isCorrect = button.dataset.correct === 'true';
            feedbackElement.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
            feedbackElement.classList.add(isCorrect ? 'correct-feedback' : 'incorrect-feedback');
            if (isCorrect) score++;

            button.classList.add(isCorrect ? 'correct' : 'incorrect');
            optionButtons.forEach(btn => {
                btn.disabled = true;
                if (btn.dataset.correct === 'true') btn.classList.add('correct');
            });

            nextButton.classList.remove('hidden');
        });
    });

    nextButton.addEventListener('click', () => {
        loadQuiz(index + 1);
    });
}

// Function to switch categories
export function switchCategory(category) {
    if (quizData[category]) {
        currentCategory = category;
        currentQuizIndex = 0;
        score = 0;
        loadQuiz(currentQuizIndex);
    } else {
        console.error('Invalid category:', category);
    }
}

