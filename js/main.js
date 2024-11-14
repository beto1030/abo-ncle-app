import { loadDataStore, getSectionData, dataStore } from './data.js';
import { setCurrentSection, getCurrentSection, setCurrentSlideIndex, getCurrentSlideIndex } from './globals.js';
import { populateDropdown, populateMenu, populateNotesContent } from './ui.js';
//import { setupEventListeners } from './events.js';

async function initializeApp() {

    await loadDataStore();

    const sections = Object.keys(dataStore);
    populateDropdown(sections);

    populateMenu(getCurrentSection()); // Populate the menu with terms in the initial category

     // Default to showing notes for the first category
    const defaultCategory = sections[0];
    populateNotesContent(defaultCategory);

    //setupEventListeners();
}

initializeApp();

