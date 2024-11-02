import {setCurrentSlideIndex, currentSlideIndex, slides, slideElements} from './globals.js';
import {loadSection, updateDOMWithContent, updateDOM} from './data.js';

export function openGridView() {
    const gridViewContainer = document.getElementById('grid-view-container');
    gridViewContainer.innerHTML = ''; // Clear previous content in the grid view


    console.log(slideElements.length);
    for(let i = 0; i < slideElements.length; i++){
        const cardClone = slideElements[i].cloneNode(true); // Clone the flashcard
        cardClone.style.display = 'block';       // Ensure it displays in the popup
        cardClone.style.border = "dotted";

        // Append cloned card to the grid view container
        gridViewContainer.appendChild(cardClone);
    }

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

// Usage in showSlide function
export function showSlide(index, slideElements) {
    if (slides.length === 0) return;

    console.log(slideElements.length);
    for(let i = 0; i < slideElements.length; i++){
        slideElements[i].style.display = 'none';
    }

    // Ensure valid index
    if (index >= 0 && index < slideElements.length) {
        const currentSlide = slideElements[index];
        if (currentSlide) {
            currentSlide.style.display = 'block'; // Show the current slide
            //console.log('Showing slide:', currentSlide);
        } else {
            console.error('Current slide is undefined for index:', index);
        }
    } else {
        console.error('Invalid slide index:', index);
    }
}



// Change Category function
export async function changeCategory(category) {
    try {
        // Here you would fetch the data for the selected category
        const sectionData = await loadSection(category); // Assuming loadSection is defined
        console.log(sectionData);

        // Call the updateDOMWithContent function with the fetched data
        updateDOMWithContent(sectionData, { slides, setCurrentSlideIndex, showSlide }, updateDOM);
    } catch (error) {
        console.error('Error loading category content:', error);
    }
}

