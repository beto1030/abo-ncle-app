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

