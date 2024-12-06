export const state = {
    currentSlideIndex: 0,
    currentItemIndex: 0,
    currentSection: 'anatomy',
    currentMenuIndex: 0,
    currentQuizIndex: 0,
    clickedItems: new Set()
};

// Functions for debugging or controlled updates
export function updateState(key, value) {
    if (key in state) {
        state[key] = value;
    } else {
        console.warn(`State key "${key}" does not exist.`);
    }
}

export function getState(key) {
    if (key in state) {
        return state[key];
    } else {
        console.warn(`State key "${key}" does not exist.`);
        return undefined;
    }
}

