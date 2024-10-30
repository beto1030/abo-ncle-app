import {setCurrentSlideIndex, currentSlideIndex, slides} from './globals.js';
import {showSlide, openGridView, closeGridView, changeCategory} from './ui.js';


// Cycle through slides with wrapping behavior
export function changeSlide(n) {
    //currentSlideIndex += n;
    setCurrentSlideIndex(currentSlideIndex + n);

    // Wrap around if the index goes out of bounds
    if (currentSlideIndex >= slides.length) {
       setCurrentSlideIndex(0); // Go back to the first slide
    } else if (currentSlideIndex < 0) {
       setCurrentSlideIndex(slides.length - 1); // Go to the last slide
    }

    showSlide(currentSlideIndex);
}

export function setupEventListeners() {
    document.querySelector('.category-dropdown').addEventListener('change', (event) => {
        changeCategory(event.target.value);
    });

    document.getElementById('openPopupBtn').addEventListener('click', openGridView);

    document.getElementById('closePopupBtn').addEventListener('click', closeGridView);

    document.querySelector('.prev').addEventListener('click', () => changeSlide(-1));

    document.querySelector('.next').addEventListener('click', () => changeSlide(1));
}

