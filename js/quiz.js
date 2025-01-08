import { updateState, getState } from './state.js'; // Assuming you have state management
import { loadQuizData } from './dataLoader.js';
import { updateHighlightedMenuItem } from './ui.js';

let quizData = {}; // To hold the quiz data loaded from JSON
let currentCategory = 'anatomy'; // Default category (can be updated dynamically)
let currentQuizIndex = 0; // Track the current question index
let score = 0; // Track the user's score

// Function to initialize and load quiz data
async function initializeQuizData() {
    try {
        quizData = await loadQuizData(); // Load quiz data from JSON
        if (!quizData || Object.keys(quizData).length === 0) {
            throw new Error('Quiz data is empty or invalid.');
        }
        console.log('Quiz data successfully loaded:', quizData);
    } catch (error) {
        console.error('Error initializing quiz data:', error);
        quizData = {}; // Reset to empty object on failure
    }
}

export async function loadQuiz(index = 0) {
    const contentArea = document.getElementById('dynamicContent');
    const menuItems = document.querySelectorAll('#menuContent .quiz-question-item'); // Adjust selector as needed

    // Ensure quiz data is loaded
    if (Object.keys(quizData).length === 0) {
        await initializeQuizData(); // Load data if not already loaded
    }

    const categoryQuizzes = quizData[currentCategory];
    if (!Array.isArray(categoryQuizzes) || categoryQuizzes.length === 0) {
        contentArea.innerHTML = `
            <div class="quiz-error">
                <h3>No quizzes available for category "${currentCategory}".</h3>
            </div>
        `;
        return;
    }

    if (index >= categoryQuizzes.length) {
        // Show "Quiz Completed" when the index exceeds available questions
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
    const nextQuizButton = document.getElementById('nextQuiz');

    // Highlight the current menu item
    if (menuItems && menuItems.length > 0) {
        menuItems.forEach(item => item.classList.remove('highlighted')); // Remove highlight from all
        if (menuItems[index]) {
            menuItems[index].classList.add('highlighted'); // Highlight the current question
        }
    }

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

            nextQuizButton.classList.remove('hidden');
        });
    });

    nextQuizButton.addEventListener('click', () => {
    // Increment index and update state
    const newIndex = index + 1;

    // Check if newIndex exceeds the total number of quiz questions
    if (newIndex >= categoryQuizzes.length) {
        // Show "Quiz Completed" message
        contentArea.innerHTML = `
            <div class="quiz-end">
                <h3>Quiz Completed!</h3>
                <p>Your score: ${score} / ${categoryQuizzes.length}</p>
                <button id="restartQuiz" class="quiz-restart">Restart Quiz</button>
            </div>
        `;

        // Add event listener for restarting the quiz
        const restartButton = document.getElementById('restartQuiz');
        restartButton.addEventListener('click', () => {
            updateState('quiz', 'currentQuizIndex', 0); // Reset state
            loadQuiz(0); // Reload the first question
        });

        return; // Exit function to avoid further execution
    }

    // Update state
    updateState('quiz', 'currentQuizIndex', newIndex);

    // Use updateHighlightedMenuItem to highlight the current menu item
    const menuItems = document.querySelectorAll('#menuContent .quiz-question-item');
    updateHighlightedMenuItem(menuItems, newIndex);

    // Load the next question
    loadQuiz(newIndex);
});


}

