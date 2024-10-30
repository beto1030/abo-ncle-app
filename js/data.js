import {setCurrentSlideIndex,currentSlideIndex, slides, sectionTitles} from './globals.js';
import {showSlide} from './ui.js';

// Function to load section content dynamically
export function loadSection(section) {
    // Fetch the sections.json file first
    fetch('./js/sections.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(sectionTitles => {
            // Check if the requested section exists in the fetched sectionTitles
            if (!sectionTitles[section]) {
                throw new Error(`Section "${section}" does not exist.`);
            }

            // Fetch the corresponding HTML file for the section
            return fetch(`sections/${section}.html`);
        })
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(content => {
            // Update the title and current category
            document.title = sectionTitles[section];
            document.getElementById('section-content').innerHTML = content;

            // Clear slides array before populating with new slides
            slides.length = 0;

            console.log("slides before:");
            console.log(slides);

            // Populate slides array with new cards from this section only
            let existingSlides = document.querySelectorAll('.carousel-slide');

            existingSlides.forEach((card, index) => {
                card.dataset.number = index + 1; // Set data attribute for numbering
                slides.push(card); // Add each new card to the slides array
            });
            console.log("slides after:");
            console.log(slides);

            // Reset slides and display the first one
            setCurrentSlideIndex(0); // Use the variable directly instead of a function to set it
            showSlide(currentSlideIndex);
        })
        .catch(error => console.error('Error loading section:', error));
}
export function populateDropdown() {
    fetch('./js/sections.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(sectionTitles => {
            const categoryDropdown = document.querySelector('.category-dropdown');

            // Clear existing options
            categoryDropdown.innerHTML = '';

            // Populate dropdown with section titles
            Object.entries(sectionTitles).forEach(([key, value]) => {
                const option = document.createElement('option');
                option.value = key; // Use the key as the value
                option.textContent = value; // Use the value as the text
                categoryDropdown.appendChild(option); // Append the option
            });
        })
        .catch(error => console.error('Error populating dropdown:', error));
}

