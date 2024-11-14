/*
// data.js
import {setCurrentSlideIndex,currentSlideIndex, slides, slideElements} from './globals.js';
import {showSlide} from './ui.js';

let sectionTitles = {}; // Initialize an empty object to hold section titles

// Function to fetch the section titles from JSON
async function fetchSectionTitles() {
    const response = await fetch('./js/sections.json');
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
    const data = await response.json();
    const titles = {};
    data.sections.forEach(item => {
        titles[item.key] = item.title;
    });
    return titles;
}

// Function to fetch the HTML content of a section
export async function fetchSectionContent(section) {
    const response = await fetch(`./sections/${section}.html`);
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
    return await response.text();
}

// Main function to load a section
export async function loadSection(section) {
    try {
        const titles = await fetchSectionTitles();
        const title = titles[section] || 'Default Title';
        const content = await fetchSectionContent(section);
        return { title, content };
    } catch (error) {
        console.error('Error loading section:', error);
        throw error; // Re-throw error for further handling if needed
    }
}



// Separate function to update the DOM with the content returned by loadSection
export function updateDOMWithContent({ title, content }, { slides, setCurrentSlideIndex, showSlide }, updateDOM) {
    // Call the updateDOM function to change the title and content

    // Clear slides array before populating with new slides
    slides.length = 0;

    // Populate slides array with new cards from the passed content
    //const existingSlides = content.match(/<div class="carousel-slide"(?:\s[^>]*)?>[\s\S]*?<\/div>/g) || [];
    const existingSlides = content.match(/<h3(?:\s[^>]*)?>[\s\S]*?<\/h3>/g) || [];
    console.log(existingSlides);


    existingSlides.forEach((card, index) => {
        console.log(card);
        // Create a temporary slide element
        const slideElement = {
            dataset: { number: index + 1 },
            innerHTML: card
        };
        slides.push(slideElement); // Add each new card to the slides array
    });
    console.log("slides data.js");
    console.log(slides);

    updateDOM(title, content);
    setCurrentSlideIndex(0);
    showSlide(currentSlideIndex, slideElements);
}


export function populateDropdown(categoryDropdown) {
    // Clear existing options
    //console.log(categoryDropdown);
    categoryDropdown.innerHTML = '';

    return fetch('./js/sections.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(sectionTitles => {
            sectionTitles.sections.forEach(section => {
                const option = document.createElement('option');
                option.value = section.key; // Use the key as the value
                option.textContent = section.title; // Use the title as the text
                categoryDropdown.appendChild(option); // Append the option to the dropdown
            });
        })
        .catch(error => {
            console.error('Error populating dropdown:', error);
            throw error;
        });
}
export const updateDOM = (title, content) => {
    document.title = title; // Update the document title
    document.getElementById('section-content').innerHTML = content; // Update the section content

    //document.getElementById('menuContent').innerHTML = slides.innerHTML;
    console.log("updateDOM");


};
*/
export let dataStore = {};

// Function to load the JSON data
export async function loadDataStore() {
    try {
        const response = await fetch('./js/sections.json');
        dataStore = await response.json();
        console.log(dataStore);
    } catch (error) {
        console.error('Failed to load sections data:', error);
    }
}

// Function to get data for a specific section
export function getSectionData(sectionKey) {
    return dataStore[sectionKey]?.cards || [];
}

