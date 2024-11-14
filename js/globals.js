export let currentSlideIndex = 0;
export let currentSection = 'anatomy';

// Getter and Setter for currentSlideIndex
export function getCurrentSlideIndex() {
    return currentSlideIndex;
}

export function setCurrentSlideIndex(index) {
    currentSlideIndex = index;
}

// Getter and Setter for currentSection
export function getCurrentSection() {
    return currentSection;
}

export function setCurrentSection(section) {
    currentSection = section;
}

