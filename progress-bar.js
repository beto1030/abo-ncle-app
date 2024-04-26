// Get elements
const flashcards = document.querySelectorAll('.flashcard');
const checkMark = document.querySelector('.check-mark');
const progressBar = document.getElementById('progress');

// Set initial progress
let progress = 0;
const totalFlashcards = flashcards.length;
const increment = 100 / totalFlashcards;

// Array to keep track of clicked status of each flashcard
const clickedFlashcards = Array(totalFlashcards).fill(false);

// Function to update progress
function updateProgress() {
  // Calculate the number of clicked flashcards
  const clickedCount = clickedFlashcards.reduce((count, clicked) => count + (clicked ? 1 : 0), 0);

  // Calculate progress based on the number of clicked flashcards
  progress = (clickedCount / totalFlashcards) * 100;

  // Update progress bar width
  progressBar.style.width = progress + '%';
}

flashcards.forEach((flashcard, index) => {

  flashcard.addEventListener('click', function() {

    // Check if the flashcard has already been clicked
    if (!clickedFlashcards[index]) {
      // Update clicked status of the flashcard
      clickedFlashcards[index] = true;

        
      const span = document.createElement("span");
      span.innerHTML = "✔";
      flashcard.parentNode.appendChild(span);

     // // Show the check mark
     // const checkMark = document.querySelector('.check-mark');
      console.log(flashcard.parentNode);
      
     flashcard.nextElementSibling.style.display = 'block';
     flashcard.nextElementSibling.style.position= 'absolute';
     flashcard.nextElementSibling.style.color= 'green';



      // Add the "flipped" class to flip the flashcard
      flashcard.classList.add('flipped');


      // Update progress
      updateProgress();
    }
  });
});

