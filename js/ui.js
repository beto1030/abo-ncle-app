import { getSectionData } from './data.js';
import { setCurrentSection, getCurrentSlideIndex } from './globals.js';

// Function to populate the dropdown with section options
export function populateDropdown(sections) {
    const dropdown = document.getElementById('category-dropdown');
    dropdown.innerHTML = ''; // Clear existing options

    sections.forEach(section => {
        const option = document.createElement('option');
        option.value = section;
        option.textContent = section.charAt(0).toUpperCase() + section.slice(1);
        dropdown.appendChild(option);
    });

    // Listen for changes to update both the menu and main content
    dropdown.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        setCurrentSection(selectedCategory);
        populateMenu(selectedCategory); // Update the menu terms based on the new category
        populateNotesContent(selectedCategory); // Show notes for the selected category
        //updateDOMWithContent([getSectionData(selectedCategory)[getCurrentSlideIndex()]]); // Show the first slide in the new category
        showMenu(); // Ensure the menu tab is active

    });
}

// Function to populate the menu with terms from the selected category
export function populateMenu(category) {
    const menuContainer = document.getElementById('menuContent');

    // Set the flex styling on the container

    menuContainer.innerHTML = ''; // Clear existing items

    const terms = getSectionData(category);

    terms.forEach((term, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = term.title;
        listItem.classList.add('numbered-list');

        listItem.addEventListener('click', () => {
            currentItemIndex = index; // Update the current index
            populateNotesContent(category, index); // Update notes based on selected term
            updateMenuHighlight(menuContainer); // Highlight the selected item


        });
        menuContainer.appendChild(listItem);
    });

    // Automatically make the first item active
    if (terms.length > 0) {
        currentItemIndex = 0; // Reset the current index to 0
        updateMenuHighlight(menuContainer); // Highlight the first item
        populateNotesContent(category, currentItemIndex); // Display the notes for the first item
    }

}

function updateMenuHighlight(menuContainer) {
    const items = menuContainer.querySelectorAll('li'); // Get all list items
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentItemIndex); // Highlight the active item
    });
}

// New function to populate notes content based on the selected term or category
export function populateNotesContent(category, index = 0) {
    const notesContainer = document.getElementById('notesContent');
    notesContainer.innerHTML = ''; // Clear existing notes

    const terms = getSectionData(category);
    const selectedTerm = terms[index];

    const noteTitle = document.createElement('h4');
    noteTitle.textContent = selectedTerm.title;

    const noteContent = document.createElement('p');
    noteContent.textContent = selectedTerm.content;

    notesContainer.appendChild(noteTitle);
    notesContainer.appendChild(noteContent);

    // Update the image src based on the selected term's imageSrc property
    const contentImage = document.getElementById('contentAreaImg');
    if (contentImage && selectedTerm.imageSrc) {
        console.log(selectedTerm.imageSrc);
        contentImage.src = selectedTerm.imageSrc;
    }
}
