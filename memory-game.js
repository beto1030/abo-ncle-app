const cardsArray = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
let flippedCards = [];
let matchedCards = [];

// Shuffle function to shuffle the cards array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create the game board
function createBoard() {
    const memoryGame = document.querySelector('.memory-game');
    const shuffledCards = shuffle(cardsArray);

    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.card = card;
        cardElement.textContent = card;
        cardElement.addEventListener('click', flipCard);
        memoryGame.appendChild(cardElement);
    });
}

// Flip the card
function flipCard() {
    if (flippedCards.length < 2 && !flippedCards.includes(this) && !matchedCards.includes(this)) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

// Check if two flipped cards match
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.card === secondCard.dataset.card) {
        matchedCards.push(firstCard, secondCard);
        flippedCards = [];

        if (matchedCards.length === cardsArray.length) {
            setTimeout(() => alert('Congratulations! You won!'), 500);
        }
    } else {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        flippedCards = [];
    }
}

// Initialize the game
createBoard();
