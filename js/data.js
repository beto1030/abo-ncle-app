import {setCurrentSlideIndex,currentSlideIndex, slides} from './globals.js';
import {showSlide} from './ui.js';

let sectionTitles = {}; // Initialize an empty object to hold section titles


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
            // Create a mapping of section titles from the fetched data
            const titles = {};
            sectionTitles.sections.forEach(sectionData => {
                sectionTitles[sectionData.key] = sectionData.title;
            });

            // Now update the document title
            document.title = sectionTitles[section] || 'Default Title'; // Fallback to a default title if not found

            // Continue loading the section content
            return fetch(`./sections/${section}.html`);
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
    const categoryDropdown = document.querySelector('.category-dropdown');

    // Clear existing options
    categoryDropdown.innerHTML = '';

    fetch('./js/sections.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(sectionTitles => {
            const categoryDropdown = document.querySelector('.category-dropdown');

            sectionTitles.sections.forEach(section => {
                const option = document.createElement('option');
                option.value = section.key; // Use the key as the value
                option.textContent = section.title; // Use the title as the text
                categoryDropdown.appendChild(option); // Append the option to the dropdown
            });
        })
        .catch(error => console.error('Error populating dropdown:', error));
}

