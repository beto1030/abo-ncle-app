// Quiz data for menu items
const quizData = {
    "Eyelids": {
        question: "What is the primary function of eyelids?",
        options: [
            "To focus light on the retina",
            "To protect the eyes",
            "To produce tears",
            "To control eye movement"
        ],
        correctAnswer: 1
    },
    "Fibrous Tunic": {
        question: "Which part of the eye is part of the fibrous tunic?",
        options: [
            "Lens",
            "Retina",
            "Sclera",
            "Iris"
        ],
        correctAnswer: 2
    },
    "Sclera": {
        question: "What is the primary purpose of the sclera?",
        options: [
            "To control the amount of light entering the eye",
            "To give shape and structure to the eye",
            "To detect light",
            "To produce tears"
        ],
        correctAnswer: 1
    }
};

// Show quiz for a specific menu item
export function showQuiz(itemText) {
    // Normalize itemText
    const normalizedText = itemText.trim();

    const quizModal = document.getElementById("quizModal");
    const quizQuestion = document.getElementById("quizQuestion");
    const quizOptions = document.getElementById("quizOptions");

    // Get the quiz data for the selected menu item
    //const quiz = quizData[itemText];
    const quiz = quizData[normalizedText];
        console.log("Quiz data lookup:", normalizedText, quiz); // Debug the lookup

    if (!quiz) {
        alert("No quiz available for this item.");
        return;
    }

    // Populate the question
    quizQuestion.textContent = quiz.question;

    // Populate the options
    quizOptions.innerHTML = ""; // Clear existing options
    quiz.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.textContent = option;
        li.addEventListener("click", () => handleAnswer(index, quiz.correctAnswer, li));
        quizOptions.appendChild(li);
    });

    // Show the modal
    quizModal.style.display = "flex";
}

// Handle answer selection
function handleAnswer(selectedIndex, correctIndex, optionElement) {
    if (selectedIndex === correctIndex) {
        optionElement.classList.add("correct");
    } else {
        optionElement.classList.add("incorrect");
    }

    // Disable all options after selection
    const options = document.querySelectorAll("#quizOptions li");
    options.forEach(option => {
        option.style.pointerEvents = "none";
    });
}

// Close the quiz modal
export function closeQuiz() {
    const quizModal = document.getElementById("quizModal");
    quizModal.style.display = "none";
}

// Add event listeners to menu items
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(()=>{
        const liElements = document.querySelectorAll("#menuContent li");
        liElements.forEach(li => {
            li.addEventListener("click", () => {
                const itemText = li.textContent.trim();
                console.log(itemText);
                showQuiz(itemText); // Trigger the quiz for the clicked item
            });
        });
    },2000);
});

