import {showQuiz, closeQuiz} from './quiz.js';
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(()=>{
        const liElements = document.querySelectorAll("#menuContent li");
        console.log(liElements);

        liElements.forEach(li => {
            li.addEventListener("click", () => {
                const itemText = li.textContent.trim();
                showQuiz(itemText); // Trigger the quiz for the clicked item
            });
        });
    }, 2000);

    // Attach a listener to the close button in the modal
    const closeButton = document.getElementById("closeQuiz");
    if (closeButton) {
        closeButton.addEventListener("click", closeQuiz); // Close modal when button is clicked
    }
});

