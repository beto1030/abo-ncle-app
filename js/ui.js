import { getSectionData } from './data.js';
import { state, updateState, getState } from './state.js';
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

        /*
        subItem.addEventListener('click', () => {
            loadQuiz(index); // Call loadQuiz to display the selected question
        });
        */

        subList.appendChild(subItem);
    });
}

/*
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
*/



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
    if (!getState('sections', 'currentSection')) {
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

        updateHighlightedMenuItem(); // Highlight the first item in the menu
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

        /*
        listItem.addEventListener('click', () => {
            updateState('currentMenuIndex', Array.from(menuContainer.children).indexOf(listItem));
            loadImageForMenuItem(term.title); // Load corresponding image
        });
        */
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

            /*
            subItem.addEventListener('click', () => {
                loadQuiz(index); // Call loadQuiz to display the selected question
            });
            */

            subList.appendChild(subItem);
        });
    }

    quizItem.appendChild(subList);
    menuContainer.appendChild(quizItem);

    /*
    // Add click event to toggle the sublist visibility
    quizItem.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering events on parent elements
        const isOpen = subList.style.display === 'block';
        subList.style.display = isOpen ? 'none' : 'block'; // Toggle display
        arrow.innerHTML = isOpen ? '&#9658;' : '&#9660;'; // Toggle arrow symbol
    });
    */

    updateState('currentSection', category);
    updateState('currentMenuIndex', 0); // Reset menu index to 0

    // Highlight the first menu item
    /*
    const menuItems = document.querySelectorAll('#menuContent li');
    if (menuItems.length > 0) {
        updateHighlightedMenuItem(menuItems, getState('menu', 'currentMenuIndex')); // Highlight the first menu item
        loadImageForMenuItem(menuItems[0].textContent.trim()); // Load the image for the first menu item
    }
    */
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

export function updateHighlightedMenuItem(menuItems, currentIndex) {
    menuItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
    }); 
    /*
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
    */
}


export function updateButtonStates(currentIndex, totalItems) {
    const prevButton = document.getElementById('prevBtn');
    const nextButton = document.getElementById('nextBtn');

    prevButton.disabled = currentIndex === 0; // Disable if at the first item
    nextButton.disabled = currentIndex === totalItems - 1; // Disable if at the last item
}

// Function to add event listeners to menu items
function addClickEventListeners() {
    const menuItems = document.querySelectorAll('.menu-item, .quiz-item, .quiz-question-item');

    menuItems.forEach((item, index) => {
        item.addEventListener('click', (event) => {
            const currentIndex = getState('menu', 'currentMenuIndex');
            const currentItem = menuItems[currentIndex];
            
            // 1. Handle the case when the clicked item is a .quiz-item (Toggle its sublist)
            if (item.classList.contains('quiz-item')) {
                const subList = item.querySelector('.quiz-sublist');
                const toggleArrow = item.querySelector('.quiz-toggle-arrow');
            
                // If we're currently on a quiz question item, prevent toggling sublist from .quiz-item
                if (getState('menu', 'currentMenuIndex') !== -1 && currentItem.classList.contains('quiz-question-item')) {
                    // Skip toggling the sublist or arrow
                    return;
                }
            
                if (subList) {
                    const isVisible = subList.style.display === 'block';
            
                    // Toggle the sublist visibility
                    subList.style.display = isVisible ? 'none' : 'block';
            
                    // Toggle the arrow symbol
                    if (toggleArrow) {
                        toggleArrow.textContent = isVisible ? '►' : '▼'; // Close or open the arrow
                    }
                }
            
                // Skip highlighting the .quiz-item to prevent undesired behavior
                return;
            }


            // 2. Handle the case when the clicked item is a .quiz-question-item (Navigate to that quiz question)
            if (item.classList.contains('quiz-question-item')) {
                event.stopPropagation();  // Prevent bubbling up to .quiz-item
                navigateToQuizQuestion(item); // Handle quiz question navigation

                // Update current index for menu item highlighting
                updateState('menu', 'currentMenuIndex', index);
                updateHighlightedMenuItem(menuItems, index);
                return;
            }

            // 3. Handle the case when clicking a non-quiz item (collapse any open sublists)
            if (currentItem && currentItem.classList.contains('quiz-item')) {
                const currentSubList = currentItem.querySelector('.quiz-sublist');
                const currentToggleArrow = currentItem.querySelector('.quiz-toggle-arrow');

                if (currentSubList) {
                    currentSubList.style.display = 'none';  // Collapse the current sublist
                    if (currentToggleArrow) {
                        currentToggleArrow.textContent = '►'; // Reset arrow to closed
                    }
                }
            }

            // 4. If the clicked item is a non-quiz item (e.g., .menu-item), collapse all open sublists
            if (!item.classList.contains('quiz-item')) {
                // Collapse any open sublists
                const allQuizItems = document.querySelectorAll('.quiz-item');
                allQuizItems.forEach((quizItem) => {
                    const subList = quizItem.querySelector('.quiz-sublist');
                    const toggleArrow = quizItem.querySelector('.quiz-toggle-arrow');
                    if (subList && subList.style.display === 'block') {
                        subList.style.display = 'none';  // Close sublist
                        if (toggleArrow) {
                            toggleArrow.textContent = '►';  // Reset arrow to closed
                        }
                    }
                });
                navigateToMenuItem(item, index);
            }

            // 5. Handle menu item click and update the current menu index
            updateState('menu', 'currentMenuIndex', index);
            updateHighlightedMenuItem(menuItems, index); // Update highlighted menu item
            updateButtonStates(index, menuItems.length);  // Update button states
        });
    });
}

export function initializeMenu() {
    const menuItems = document.querySelectorAll('.menu-item, .quiz-question-item');
    const currentIndex = getState('menu', 'currentMenuIndex');

    if (menuItems[currentIndex]) {
        menuItems[currentIndex].classList.add('active');
    }

    loadImageForMenuItem(menuItems[currentIndex].textContent.trim());

    
    updateButtonStates(currentIndex, menuItems.length);

    // Add click event listeners to the menu items
    addClickEventListeners();

}
export function navigateMenu(direction) {
    const menuItems = document.querySelectorAll('.menu-item, .quiz-question-item');
    const totalItems = menuItems.length;

    if (totalItems === 0) {
        console.error('No menu items found.');
        return;
    }

    let currentIndex = getState('menu', 'currentMenuIndex');
    const nextIndex = currentIndex + direction;

    if (nextIndex < 0 || nextIndex >= totalItems) {
        console.warn('Navigation out of bounds. Ignoring.');
        return;
    }

    const currentItem = menuItems[currentIndex];
    const nextItem = menuItems[nextIndex];

    if (!nextItem) return;

    // Update the current menu index
    updateState('menu', 'currentMenuIndex', nextIndex);

if (nextItem.classList.contains('quiz-question-item')) {
    // Ensure the quiz sublist remains expanded if navigating within it
    const parentQuizItem = nextItem.closest('.quiz-item');
    if (parentQuizItem) {
        toggleQuizSublist(parentQuizItem, true);
    }
    toggleNotesTab(false); // Hide notes tab for quiz questions
    navigateToQuizQuestion(nextItem);
} 
else if (currentItem.classList.contains('quiz-question-item')) {
    // Collapse the quiz sublist if navigating out of it
    const quizMenuItem = currentItem.closest('.quiz-item');
    if (quizMenuItem) {
        toggleQuizSublist(quizMenuItem, false);
    }
} 

// Navigate based on item type
    if (nextItem.classList.contains('quiz-question-item')) {
        navigateToQuizQuestion(nextItem);
    } 
    else if (nextItem.classList.contains('quiz-item')) {
        navigateQuizSublist(nextItem, direction);
    } 
    else {
        navigateToMenuItem(nextItem, nextIndex);
    } 
    
    // Update the UI for the highlighted item
    updateHighlightedMenuItem(menuItems, nextIndex);
    updateButtonStates(nextIndex, totalItems);

    toggleNotesTab(!nextItem.classList.contains('quiz-question-item'));

}

// Helper function to expand a quiz item
function expandQuizSublist(quizItem) {
    toggleQuizSublist(quizItem, true); // Expand the sublist
}

// Helper function to collapse a quiz item
function collapseQuizSublist(quizItem) {
    toggleQuizSublist(quizItem, false); // Collapse the sublist
}

function toggleQuizSublist(quizItem, expand) {
    const subList = quizItem.querySelector('.quiz-sublist');
    const toggleArrow = quizItem.querySelector('.quiz-toggle-arrow');

    if (subList) {
        subList.style.display = expand ? 'block' : 'none'; // Toggle visibility
        if (toggleArrow) {
            toggleArrow.textContent = expand ? '▼' : '►'; // Toggle arrow
        }
    }
}

function navigateToMenuItem(item, index) {
    updateState('menu', 'currentMenuIndex', index);
    const category = getState('sections', 'currentSection');
    const terms = getSectionData(category);

    if (terms && terms[index]) populateNotesContent(category, index);
    console.log("bug");
    loadImageForMenuItem(item.textContent.trim());
    toggleNotesTab(true);

}

function navigateQuizSublist(quizItem, direction) {
    const subList = quizItem.querySelector('.quiz-sublist');
    if (!subList) return;

    if (direction > 0) {
        toggleQuizSublist(quizItem, true);
        const firstQuestion = subList.querySelector('li');
        if (firstQuestion) {
            const menuItems = document.querySelectorAll('.menu-item, .quiz-question-item');
            const firstIndex = Array.from(menuItems).indexOf(firstQuestion);
            updateState('menu', 'currentMenuIndex', firstIndex);
        }
    } else {
        toggleQuizSublist(quizItem, false);
        const quizIndex = Array.from(document.querySelectorAll('.menu-item, .quiz-item')).indexOf(quizItem);
        updateState('menu', 'currentMenuIndex', quizIndex);
    }
}

function navigateToQuizQuestion(questionItem) {
    const quizIndex = parseInt(questionItem.dataset.index, 10);
    loadQuiz(quizIndex);
    toggleNotesTab(false);
}


function toggleNotesTab(visible) {
    const notesTab = document.getElementById('notesTab');

    if (notesTab) notesTab.style.display = visible ? 'block' : 'none';
}

