import {populateDropdown, loadSection} from  './data.js';
import {setupEventListeners} from './events.js';

// Initialize the application on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {

    populateDropdown(); // Populate the dropdown with section titles

    loadSection('anatomy'); // Load the default category

    setupEventListeners();
});
