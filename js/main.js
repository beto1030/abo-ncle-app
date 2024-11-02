import {populateDropdown, loadSection, updateDOMWithContent, updateDOM} from  './data.js';
import {setupEventListeners} from './events.js';
import { slides, setCurrentSlideIndex, slideElements } from './globals.js'; // Import the necessary variables
import {showSlide} from './ui.js';


// Initialize the application on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {

    populateDropdown(document.querySelector('.category-dropdown'));
    
    loadSection('anatomy') // Call loadSection with the desired section
    .then(({ title, content }) => { // Destructure title and content from the response
        // Call updateDOMWithContent with the loaded data

        setTimeout(() => {
            console.log(slideElements);
        }, 2000); // 2000 milliseconds = 2 seconds
        updateDOMWithContent({ title, content }, { slides, setCurrentSlideIndex, showSlide }, updateDOM);

        // Show the first slide after the content has been updated
        showSlide(0, slideElements);
    })
    .catch(error => console.error('Error loading section:', error));



    setupEventListeners();
});
