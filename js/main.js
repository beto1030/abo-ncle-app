import { loadDataStore, dataStore } from './data.js';
import { 
    populateDropdown, 
    populateMenu, 
    populateNotesContent, 
    updateMenuHighlight, 
    updateButtonStates, 
    loadImageForMenuItem 
} from './ui.js';
import { updateState, getState } from './globals.js';

async function initializeApp() {
    // Load the data store
    await loadDataStore();

    // Get all sections from the data store
    const sections = Object.keys(dataStore);

    if (sections.length === 0) {
        console.error('No sections found in data store.');
        return;
    }

    // Populate the dropdown with available sections
    populateDropdown(sections);

    // Set the default category and initialize the menu
    const defaultCategory = sections[0];
    updateState('currentSection', defaultCategory); // Update the current section in state
    populateMenu(defaultCategory);

    // Highlight the first menu item and load its content
    const terms = dataStore[defaultCategory].cards; // Ensure the terms come from cards
    if (terms && terms.length > 0) {
        const firstTerm = terms[0];

        // Set the first menu item as active
        updateState('currentMenuIndex', 0);

        // Dynamically fetch the menu items after population
        const menuItems = document.querySelectorAll('#menuContent li');
        updateMenuHighlight(menuItems, 0); // Pass `menuItems` and the index for highlight

        // Show notes for the first menu item
        populateNotesContent(defaultCategory, 0);

        // Show the default image for the first menu item
        loadImageForMenuItem(firstTerm.title);

        // Update button states
        updateButtonStates(0, menuItems.length);
    }
}

// Start the application
initializeApp();

