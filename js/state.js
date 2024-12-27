// Define the application state grouped into categories
export const state = {
    slides: {
        currentSlideIndex: 0,
    },
    menu: {
        currentItemIndex: 0,
        currentMenuIndex: 0,
        clickedItems: new Set(),
    },
    quiz: {
        currentQuizIndex: 0,
    },
    sections: {
        currentSection: 'anatomy',
    },
};

// Function to update a specific key in a state category
export function updateState(category, key, value) {
    if (state[category] && key in state[category]) {
        state[category][key] = value;
    } else {
        console.warn(
            `State key "${key}" in category "${category}" does not exist.`
        );
    }
}

// Function to retrieve a specific key's value in a state category
export function getState(category, key) {
    if (state[category] && key in state[category]) {
        return state[category][key];
    } else {
        console.warn(
            `State key "${key}" in category "${category}" does not exist.`
        );
        return undefined;
    }
}

// Function to log the entire state or a specific category for debugging
export function logState(category) {
    if (category) {
        if (state[category]) {
            console.log(`State [${category}]:`, state[category]);
        } else {
            console.warn(`State category "${category}" does not exist.`);
        }
    } else {
        console.log('Full State:', state);
    }
}

// Utility function to reset state values if needed
export function resetState(category, defaults) {
    if (category) {
        if (state[category]) {
            state[category] = { ...defaults };
        } else {
            console.warn(`State category "${category}" does not exist.`);
        }
    } else {
        console.warn('No category provided to reset state.');
    }
}

