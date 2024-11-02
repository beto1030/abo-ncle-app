import {currentSlideIndex, slides, slideElements} from './globals.js';
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

/*
function stringsToHTMLElements(slidesArray) { return slidesArray.flatMap(slide => {
        // Assuming each slide is an object with an innerHTML property
        if (typeof slide.innerHTML === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = slide.innerHTML.trim(); // Trim to avoid issues with whitespace
            return Array.from(tempDiv.children); // Return all child elements
        } else {
            console.error('Invalid input, expected an object with innerHTML property:', slide);
            return []; // Return an empty array for invalid entries
        }
    });
}
*/

/*
function stringsToHTMLElements(slidesArray, parentElement) {
    // Clear existing children if needed
    console.log(parentElement);
    //parentElement.innerHTML = '';

    slidesArray.forEach(slide => {
        if (typeof slide.innerHTML === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = slide.innerHTML.trim();
            Array.from(tempDiv.children).forEach(child => {
                parentElement.appendChild(child); // Append each child to the parent element
            });
        } else {
            console.error('Invalid input, expected an object with innerHTML property:', slide);
        }
    });
}
*/




// Usage in showSlide function
export function showSlide(index, slideElements) {
    console.log(slideElements);
    if (slides.length === 0) return;
    //console.log(slides.length);

    // Hide all slides
    /*
    slideElements.forEach((slide, idx) => {
        if (slide instanceof HTMLElement) {
            console.log(slide);
            //slide.style.display = 'none'; // Hide valid slide
        }
    });
    */

    // Hide all slides
    /*
    domSlides.forEach((slide, idx) => {
        if (slide instanceof HTMLElement) {
            console.log(slide);
            slide.style.display = 'none'; // Hide valid slide
            //console.log('is an instanceof HTMLElement');
        }
        else{
            //console.log(typeof slide);
            //console.log('not an instanceof HTMLElement');
        }
    });
    */

    // Ensure valid index
    //if (index >= 0 && index < domSlides.length) {
    //    const currentSlide = domSlides[index];
    //    if (currentSlide) {
    //        currentSlide.style.display = 'block'; // Show the current slide
    //        //console.log('Showing slide:', currentSlide);
    //    } else {
    //        console.error('Current slide is undefined for index:', index);
    //    }
    //} else {
    //    console.error('Invalid slide index:', index);
    //}
}



// Change Category function
export function changeCategory(category) {
    loadSection(category); // Load the new section based on the selected category
}

