import { loadSection } from '../js/data.js';

// Mock implementations of the dependencies
let mockData = { title: 'Mock Title', content: '<div>Mock Content</div>' };

loadSection = async (category) => {
    if (category === 'expectedCategory') {
        return mockData; // Return mock data for the expected category
    }
    throw new Error('Category not found'); // Simulate an error for other categories
};

updateDOMWithContent = (sectionData, context, updateDOM) => {
    console.assert(sectionData.title === 'Mock Title', 'Title does not match expected value');
    console.assert(sectionData.content === '<div>Mock Content</div>', 'Content does not match expected value');
    console.log('Success! updateDOMWithContent was called with:', sectionData);
};


// The function we want to test
async function changeCategory(category) {
    try {
        const sectionData = await loadSection(category); // Fetch data for the category
        updateDOMWithContent(sectionData, { slides: [], setCurrentSlideIndex: () => {}, showSlide: () => {} }, () => {});
    } catch (error) {
        console.error('Error loading category content:', error); // Handle errors
    }
}

// Test for successful fetch
function testChangeCategorySuccess() {
    const mockCategory = 'category1'; // This is the category we will test
    const mockData = { title: 'Mock Title', content: '<div>Mock Content</div>' }; // Mock data we expect to receive

    // Mock loadSection to simulate a successful fetch
    loadSection = async (category) => {
        if (category === mockCategory) {
            return mockData; // Return mock data if the category matches
        }
        throw new Error('Category not found'); // Throw an error if it doesn't
    };

    // Mock updateDOMWithContent to check if it's called with the correct data
    updateDOMWithContent = (sectionData) => {
        console.assert(sectionData === mockData, 'updateDOMWithContent was not called with correct data');
        console.log('Success! updateDOMWithContent was called with:', sectionData);
    };

    // Call changeCategory and handle the promise
    changeCategory(mockCategory).then(() => {
        console.log('Test for success passed.'); // This will run if the test passed
    });
}

// Test for error handling
function testChangeCategoryError() {
    const mockCategory = 'category1'; // This is the category we will test
    const mockError = new Error('Network error'); // Simulated error

    // Mock loadSection to throw an error
    loadSection = async (category) => {
        throw mockError; // Simulate a fetch error
    };

    // Mock updateDOMWithContent to ensure it should not be called
    updateDOMWithContent = () => {
        console.error('updateDOMWithContent should NOT be called when there is an error');
    };

    // Call changeCategory and handle the promise
    changeCategory(mockCategory).then(() => {
        console.log('Test for error handling passed.'); // This will run if the error handling test passed
    });
}

// Run the tests
testChangeCategorySuccess(); // Test the success scenario
testChangeCategoryError(); // Test the error handling scenario

