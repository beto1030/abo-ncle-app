import { quizData } from './quizData.js'; // Import the quiz questions and answers

export function loadQuiz(index) {
    const quiz = quizData[index];
    const contentArea = document.getElementById('dynamicContent'); // Content container

    if (!quiz) {
        console.error('Invalid quiz index');
        return;
    }

    contentArea.innerHTML = `
        <div class="quiz-container">
            <h3>${quiz.question}</h3>
            <ul>
                ${quiz.options.map((option, i) => `
                    <li>
                        <button class="quiz-option" data-correct="${i === quiz.correctAnswer}">
                            ${option}
                        </button>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    // Add event listeners to handle answer selection
    const optionButtons = contentArea.querySelectorAll('.quiz-option');
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isCorrect = button.dataset.correct === 'true';
            button.classList.add(isCorrect ? 'correct' : 'incorrect');
            optionButtons.forEach(btn => (btn.disabled = true)); // Disable all options
        });
    });
}

