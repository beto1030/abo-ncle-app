import { loadDataStore, dataStore } from './data.js';
import { 
    initializeMenu,
    populateDropdown, 
    populateMenu, 
    populateNotesContent, 
    //updateMenuHighlight, 
    //updateButtonStates, 
    //loadImageForMenuItem 
} from './ui.js';
import { state, updateState, getState } from './state.js';

async function initializeApp() {
    // Load the data store
    await loadDataStore();

    if(Object.keys(dataStore).length !== 0){
        populateDropdown(Object.keys(dataStore));
    } else {
        console.error('No sections found in data store.');
        return;
    }


    // Populate the dropdown with available sections

    //const defaultSection= getState('sections', 'currentSection');

    populateMenu(getState('sections', 'currentSection'));

    populateNotesContent(getState('sections', 'currentSection'), 0);

    setTimeout(() => {
        initializeMenu();
    }, 1000);
}

// Start the application
initializeApp();

