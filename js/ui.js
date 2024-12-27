import { getSectionData } from './data.js';
import { state, updateState, getState } from './globals.js';
//import { quizData } from './quizData.json'; // Import quiz data
import { loadQuizData } from './dataLoader.js';

import { loadQuiz } from './quiz.js';

let quizData = {}; // To hold all quiz data
let currentCategory = 'anatomy'; // Default category

// Function to load questions for the current category
async function loadQuestions() {
    // Load quiz data if not already loaded
    if (Object.keys(quizData).length === 0) {
        quizData = await loadQuizData();
    }

    // Get the questions for the current category
    const categoryQuestions = quizData[currentCategory];
    if (!categoryQuestions) {
        console.error('Invalid category:', currentCategory);
        return;
    }

    // Get the container for the list of questions
    const subList = document.getElementById('questionList');
    subList.innerHTML = ''; // Clear existing questions

    // Render the list of questions
    categoryQuestions.forEach((quiz, index) => {
        const subItem = document.createElement('li');
        subItem.textContent = `Question ${index + 1}`;
        subItem.classList.add('quiz-question-item');
        subItem.dataset.index = index; // Store the quiz index for reference

        subItem.addEventListener('click', () => {
            loadQuiz(index); // Call loadQuiz to display the selected question
        });

        subList.appendChild(subItem);
    });
}

// Function to switch categories
export function switchCategory(category) {
    if (quizData[category]) {
        currentCategory = category; // Update the current category
        loadQuestions(); // Load questions for the selected category
    } else {
        console.error('Category does not exist:', category);
    }
}

// Initialize the UI
export async function initializeUI() {
    await loadQuestions(); // Load questions for the default category

    // Add event listeners for category buttons
    const categoryButtons = document.querySelectorAll('.category-button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category; // Get the category from the button
            switchCategory(category);
        });
    });
}



export function displayQuiz() {
    const contentArea = document.getElementById('dynamicContent');
    contentArea.innerHTML = ''; // Clear the current content

    quizData.forEach((quiz, index) => {
        const quizContainer = document.createElement('div');
        quizContainer.classList.add('quiz-question');

        // Add question text
        const questionElement = document.createElement('h3');
        questionElement.textContent = `${index + 1}. ${quiz.question}`;
        quizContainer.appendChild(questionElement);

        // Add options as buttons
        quiz.options.forEach((option, optionIndex) => {
            const optionButton = document.createElement('button');
            optionButton.textContent = option;
            optionButton.classList.add('quiz-option');

            optionButton.addEventListener('click', () => {
                // Highlight the correct or incorrect answer
                if (optionIndex === quiz.correctAnswer) {
                    optionButton.classList.add('correct');
                } else {
                    optionButton.classList.add('incorrect');
                }

                // Disable all options for the current question
                const allOptions = quizContainer.querySelectorAll('button');
                allOptions.forEach(button => (button.disabled = true));
            });

            quizContainer.appendChild(optionButton);
        });

        contentArea.appendChild(quizContainer);
    });
}


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

    // Set the default category to the first section if not already set
    if (!getState('currentSection')) {
        updateState('currentSection', sections[0]); // Default to the first category
        dropdown.value = sections[0]; // Select the first category in the dropdown
    }


    // Listen for changes to update both the menu and main content
    dropdown.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;

        updateState('currentSection', selectedCategory); // Update the current section
        populateMenu(selectedCategory); // Update the menu terms based on the new category
        populateNotesContent(selectedCategory, 0); // Show notes for the selected category

        // Update the dynamic content (image) for the first menu item
        const terms = getSectionData(selectedCategory); // Get terms for the selected category
        if (terms.length > 0) {
            loadImageForMenuItem(terms[0].title); // Update the image for the first term
        }

        const menuTab = document.getElementById('menuTab');
        const notesTab = document.getElementById('notesTab');
        const menuContent = document.getElementById('menuContent');
        const notesContent = document.getElementById('notesContent');

        menuTab.classList.add('active'); // Make Menu tab active
        notesTab.classList.remove('active'); // Deactivate Notes tab
        menuContent.style.display = 'block'; // Show menu content
        notesContent.style.display = 'none'; // Hide notes content

        // Update the button states
        const totalItems = terms.length;
        console.log(totalItems);
        updateButtonStates(0, totalItems); // Enable/disable "Prev" and "Next" buttons

        updateMenuHighlight(); // Highlight the first item in the menu
    });
}


export function loadImageForMenuItem(title) {
    const contentArea = document.getElementById('dynamicContent');
    const imageName = title.trim().toLowerCase().replace(/\s+/g, '-'); // Convert title to image name
    contentArea.innerHTML = `
        <img id="contentAreaImg" src="images/${imageName}.png" alt="${title}" />`;
}


export async function populateMenu(category) {
    const menuContainer = document.getElementById('menuContent');
    menuContainer.innerHTML = ''; // Clear existing items

    const terms = getSectionData(category); // Fetch section terms based on the category

    // Populate regular menu items
    terms.forEach(term => {
        const listItem = document.createElement('li');
        listItem.textContent = term.title;
        listItem.classList.add('menu-item');
        menuContainer.appendChild(listItem);

        listItem.addEventListener('click', () => {
            updateState('currentMenuIndex', Array.from(menuContainer.children).indexOf(listItem));
            loadImageForMenuItem(term.title); // Load corresponding image
        });
    });

    // Add the "Quiz" menu item with a sublist
    const quizItem = document.createElement('li');
    quizItem.classList.add('quiz-item');

    // Create a toggle arrow and the label
    const arrow = document.createElement('span');
    arrow.innerHTML = '&#9658;'; // Initially closed
    arrow.classList.add('quiz-toggle-arrow');
    arrow.style.marginRight = '10px';

    const label = document.createElement('span');
    label.textContent = 'Quiz';
    label.classList.add('quiz-label');

    quizItem.appendChild(arrow);
    quizItem.appendChild(label);

    // Create a nested list for the quiz questions
    const subList = document.createElement('ul');
    subList.classList.add('quiz-sublist');
    subList.style.display = 'none'; // Hide by default

    // Load quiz data dynamically if not already loaded
    if (Object.keys(quizData).length === 0) {
        quizData = await loadQuizData(); // Fetch and cache quiz data
    }

    const categoryQuizzes = quizData[category]; // Access quizzes for the current category
    if (!categoryQuizzes) {
        console.error(`No quiz data available for category: ${category}`);
    } else {
        categoryQuizzes.forEach((quiz, index) => {
            const subItem = document.createElement('li');
            subItem.textContent = `Question ${index + 1}`;
            subItem.classList.add('quiz-question-item');
            subItem.dataset.index = index; // Store the quiz index for reference

            subItem.addEventListener('click', () => {
                loadQuiz(index); // Call loadQuiz to display the selected question
            });

            subList.appendChild(subItem);
        });
    }

    quizItem.appendChild(subList);
    menuContainer.appendChild(quizItem);

    // Add click event to toggle the sublist visibility
    quizItem.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering events on parent elements
        const isOpen = subList.style.display === 'block';
        subList.style.display = isOpen ? 'none' : 'block'; // Toggle display
        arrow.innerHTML = isOpen ? '&#9658;' : '&#9660;'; // Toggle arrow symbol
    });

    updateState('currentSection', category);
    updateState('currentMenuIndex', 0); // Reset menu index to 0

    // Highlight the first menu item
    const menuItems = document.querySelectorAll('#menuContent li');
    if (menuItems.length > 0) {
        updateMenuHighlight(menuItems, 0); // Highlight the first menu item
        loadImageForMenuItem(menuItems[0].textContent.trim()); // Load the image for the first menu item
    }
}

function displaySingleQuiz(quizIndex) {
    const contentArea = document.getElementById('dynamicContent');
    contentArea.innerHTML = ''; // Clear the content area

    const quiz = quizData[quizIndex];

    if (quiz) {
        const questionElement = document.createElement('h3');
        questionElement.textContent = quiz.question;

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('quiz-options');

        quiz.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.textContent = option;
            optionButton.classList.add('quiz-option');

            optionButton.addEventListener('click', () => {
                // Disable all buttons after an answer is selected
                Array.from(optionsContainer.children).forEach(btn => (btn.disabled = true));
                if (index === quiz.correctAnswer) {
                    optionButton.classList.add('correct');
                } else {
                    optionButton.classList.add('incorrect');
                }
            });

            optionsContainer.appendChild(optionButton);
        });

        contentArea.appendChild(questionElement);
        contentArea.appendChild(optionsContainer);
    }
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
}

export function updateMenuHighlight(menuItems, currentMenuIndex) {
    // Remove the 'active' class from all menu items
    menuItems.forEach((item) => {
        item.classList.remove('active');
    });

    // Get the current menu item
    const currentItem = menuItems[currentMenuIndex];
    if (currentItem) {
        // Highlight the current menu item
        currentItem.classList.add('active');

        // Handle special case for nested quiz questions
        if (currentItem.classList.contains('quiz-question-item')) {
            // Ensure the parent "Quiz" menu item is not highlighted
            const parentQuizItem = currentItem.closest('.quiz-item');
            if (parentQuizItem) {
                parentQuizItem.classList.remove('active'); // Remove highlight from parent "Quiz"
                const subList = parentQuizItem.querySelector('.quiz-sublist');
                if (subList) {
                    subList.style.display = 'block'; // Keep the sublist open
                }
            }
        } else if (currentItem.classList.contains('quiz-item')) {
            // Expand the sublist when the "Quiz" menu item is highlighted
            const subList = currentItem.querySelector('.quiz-sublist');
            if (subList) {
                subList.style.display = 'block';
            }
        }
    }

    // Scroll the active item into view smoothly
    currentItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


export function updateButtonStates(currentMenuIndex, totalItems) {
    const prevButton = document.getElementById('prevBtn');
    const nextButton = document.getElementById('nextBtn');

    prevButton.disabled = currentMenuIndex === 0; // Disable if at the first item
    nextButton.disabled = currentMenuIndex === totalItems - 1; // Disable if at the last item
}

export function navigateMenu(direction) {
    const menuItems = document.querySelectorAll('#menuContent > li, #menuContent .quiz-sublist li');
    const totalItems = menuItems.length;

    if (totalItems === 0) {
        console.error('No menu items found.');
        return;
    }

    let currentMenuIndex = getState('currentMenuIndex');
    currentMenuIndex += direction;

    // Ensure the index stays within bounds
    if (currentMenuIndex < 0 || currentMenuIndex >= totalItems) {
        console.warn('Navigation out of bounds. Ignoring.');
        return;
    }

    const currentItem = menuItems[currentMenuIndex];

    const menuContent = document.getElementById('menuContent'); // Notes content section
    const notesContent = document.getElementById('notesContent'); // Notes content section


// Handle regular menu items
    if (currentItem.classList.contains('menu-item')) {
        const category = getState('currentSection'); // Get the current category
        const itemIndex = Array.from(menuItems).indexOf(currentItem);

        // Safely get terms from the data store
        const terms = getSectionData(category);
        if (terms && terms[itemIndex]) {
            populateNotesContent(category, itemIndex); // Update notes content
        }

        loadImageForMenuItem(currentItem.textContent.trim()); // Update the image
    }

    // Skip the "Quiz" li entirely when navigating forward
    if (currentItem.classList.contains('quiz-item')) {
        const subList = currentItem.querySelector('.quiz-sublist');
        if (direction > 0) {
            if (subList && subList.querySelectorAll('li').length > 0) {
                // Move to the first nested quiz question
                currentMenuIndex = Array.from(menuItems).indexOf(subList.querySelector('li'));//this lines is converting the menuItems list of li element into an array so then it can use the indexOf method for arrays
                updateState('currentMenuIndex', currentMenuIndex);
            } else {
                // If no nested items, skip the "Quiz" item
                currentMenuIndex += direction;
                updateState('currentMenuIndex', currentMenuIndex);
            }
        } else if (direction < 0) {
            // Move back to the previous non-quiz item
            currentMenuIndex -= 1;
            updateState('currentMenuIndex', currentMenuIndex);
        }
    }

    // Update the state for the new current item
    const updatedItem = menuItems[currentMenuIndex];
    updateState('currentMenuIndex', currentMenuIndex);

    // Handle current item display logic
    if (updatedItem.classList.contains('quiz-question-item')) {
        const quizIndex = updatedItem.dataset.index;
        loadQuiz(parseInt(quizIndex, 10)); // Load specific quiz question
        // Hide notes tab and content for quiz items
        if (notesTab) notesTab.style.display = 'none';
        if (notesContent) notesContent.style.display = 'none';
        if (menuContent) menuContent.style.display = 'block';
        
    } else if (updatedItem.classList.contains('menu-item')) {

        loadImageForMenuItem(updatedItem.textContent.trim()); // Show image for the menu item

        // Hide notes tab and content for quiz items
        if (notesTab) notesTab.style.display = 'block';

    }

    // Ensure the quiz sublist remains expanded if navigating within it
    if (updatedItem.classList.contains('quiz-question-item')) {
        const parentQuizItem = updatedItem.closest('.quiz-item');
        if (parentQuizItem) {
            const subList = parentQuizItem.querySelector('.quiz-sublist');
            if (subList) {
                subList.style.display = 'block';
            }
        }
    }

if (
    currentItem &&
    !currentItem.classList.contains('quiz-question-item') &&
    direction < 0
) {
    const quizMenuItem = document.querySelector('#menuContent .quiz-item');
    if (quizMenuItem) {
        const subList = quizMenuItem.querySelector('.quiz-sublist');
        if (subList) {
            console.log('Forcing quiz sublist collapse...');
            subList.style.display = 'none';
        }
    }
}


    // Highlight the current menu item
    updateMenuHighlight(menuItems, currentMenuIndex);

    // Update button states for navigation
    updateButtonStates(currentMenuIndex, totalItems);
}


function attachNavigationListeners() {
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');

    if (nextButton && prevButton) {
        nextButton.onclick = () => navigateMenu(1); // Move forward
        prevButton.onclick = () => navigateMenu(-1); // Move backward
    }
}

// Call this function whenever the DOM is updated dynamically


document.addEventListener('DOMContentLoaded', () => {
    attachNavigationListeners();

    const menuTab = document.getElementById('menuTab');
    const notesTab = document.getElementById('notesTab');
    const menuContent = document.getElementById('menuContent');
    const notesContent = document.getElementById('notesContent');

    // Event listener for the Menu tab
    menuTab.addEventListener('click', () => {
        menuTab.classList.add('active');
        notesTab.classList.remove('active');
        menuContent.style.display = 'block';
        notesContent.style.display = 'none';
    });

    // Event listener for the Notes tab
    notesTab.addEventListener('click', () => {
        notesTab.classList.add('active');
        menuTab.classList.remove('active');
        notesContent.style.display = 'block';
        menuContent.style.display = 'none';
    });
});

