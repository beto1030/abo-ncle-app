// Example JavaScript for flipping flashcards
document.querySelectorAll('.flashcard').forEach(card => {
    console.log(card);
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});

