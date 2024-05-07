console.log("inside flashcards.js");
// Function to create a flashcard with question and answer
function createFlashcard(term, def, category) {
    // Create flashcard elements
    var flashcardWrapper = document.createElement('div');
    flashcardWrapper.classList.add('flashcard-wrapper');

    var flashcard = document.createElement('div');
    flashcard.classList.add('flashcard');

    var front = document.createElement('div');
    front.classList.add('front');
    var back = document.createElement('div');
    back.classList.add('back');

    // Set question and answer content
    front.innerHTML = term +'<small>'+ category+'</small>';
    back.innerHTML = def;
    

    // Append front and back to flashcard
    flashcard.appendChild(front);
    flashcard.appendChild(back);

    flashcardWrapper.appendChild(flashcard);

    // Append flashcard to container
    var gridContainer = document.getElementById('grid-container');
    gridContainer.appendChild(flashcardWrapper);
}

function createFlashcardsFromFile(url, keywords=[]) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            // Split text file contents into lines
            var lines = data.split('\n');

            // Iterate over each line to create flashcards
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i].trim(); // Remove leading and trailing whitespace
                if (line !== '') { // Skip empty lines
                    // Split each line into term and definition
                    var [term, definition, category] = line.split(':').map(item => item.toLowerCase());

                    if (keywords.length === 0 || 
                        keywords.some(keyword => term.includes(keyword)) ||
                        keywords.some(keyword => definition.includes(keyword)) ||
                        keywords.some(keyword => category.includes(keyword))
                       )
                    {
                       createFlashcard(term, definition, category);
                    }
                }
            }
        })
        .catch(error => console.error('Error fetching flashcards:', error));
}


// Example usage: Read flashcards from file and create flashcards
createFlashcardsFromFile('abo-terms.txt');

setTimeout(function() {
// function code goes here
   document.querySelectorAll('.flashcard').forEach(card => {
     card.addEventListener('click', () => {
          card.classList.toggle('flipped');
       });
     });
}, 3000);

setTimeout(function() {
console.log(document.querySelectorAll('.flashcard'));
}, 3000);


