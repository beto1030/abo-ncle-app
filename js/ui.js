import {currentSlideIndex, slides} from './globals.js';
import {loadSection} from './data.js';

export function openGridView() {
    const gridViewContainer = document.getElementById('grid-view-container');
    gridViewContainer.innerHTML = ''; // Clear previous content in the grid view


    // Ensure only cards from the current category are shown in the popup
    slides.forEach(slide => {
        const cardClone = slide.cloneNode(true); // Clone the flashcard
        cardClone.style.display = 'block';       // Ensure it displays in the popup

        // Append cloned card to the grid view container
        gridViewContainer.appendChild(cardClone);
    });

    // Show the grid view popup
    document.getElementById('grid-view-popup').classList.remove('hidden');
}

export function closeGridView() {
    const gridViewPopup = document.getElementById('grid-view-popup');
    gridViewPopup.classList.add('hidden'); // Hide the popup

    // Optionally clear the grid view container
    const gridViewContainer = document.getElementById('grid-view-container');
    gridViewContainer.innerHTML = ''; // Clear the content

    // Ensure all slides are hidden, and the current one is shown
    slides.forEach(slide => {
        slide.style.display = 'none'; // Hide all flashcards again
    });

    // Show the current slide after closing
    showSlide(currentSlideIndex);
}


// Display the current slide
export function showSlide(index) {
    if (slides.length === 0) return;

    // Hide all slides and show only the current one
    slides.forEach(slide => {
        slide.style.display = 'none';
    });

    slides[currentSlideIndex].style.display = 'block';
}


// Change Category function
export function changeCategory(category) {
    loadSection(category); // Load the new section based on the selected category
}

