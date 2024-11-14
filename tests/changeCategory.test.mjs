// Import necessary modules and functions for changeCategory
import { updateDOMWithContent } from '../js/data.js'; // Import updateDOMWithContent if needed
import { slides, setCurrentSlideIndex, } from '../js/globals.js';
import { showSlide } from '../js/ui.js';


// Local mock for `loadSection`
async function mockLoadSection(category) {
    if (category === 'expectedCategory') {
        return { title: 'Mock Title', content: '<div>Mock Content</div>' };
    }
    console.log('throwing error "Category not found"');
    throw new Error('Category not found');
}


// Local mock for `updateDOMWithContent` to verify if it's called with the correct data
function mockUpdateDOMWithContent(sectionData, context, updateDOM) {
    console.assert(sectionData.title === 'Mock Title', 'Title does not match expected value');

    console.assert(sectionData.content === '<div>Mock Content</div>', 'Content does not match expected value');

    console.log('Success! updateDOMWithContent was called with:', sectionData);
}

// Recreate the `changeCategory` function for testing
async function changeCategory(category) {
    try {
        const sectionData = await mockLoadSection(category); // Use the local mock
        mockUpdateDOMWithContent(sectionData, { slides, setCurrentSlideIndex, showSlide }, () => {});
    } catch (error) {
        console.error('Error loading category content:', error); // Handle errors
    }
}

// Test for a successful fetch scenario
function testChangeCategorySuccess() {

    const mockCategory = 'expectedCategory';

    console.log(`Running test for successful fetch with category "${mockCategory}"`);

    changeCategory(mockCategory)
        .then(() => {
            console.log('Test for successful fetch passed.');
        })
        .catch(() => {
            console.error('Test failed: Expected success but encountered an error.');
        });
}



// Test for an error scenario
function testChangeCategoryError() {
    const mockCategory = 'nonExistentCategory';

    console.log(`Running test for error scenario with category "${mockCategory}"`);

    changeCategory(mockCategory)
        .then(() => {
            console.error('Test failed: Expected an error but received success.');
        })
        .catch(error => {
            console.log('Test for error handling passed.');
        });
}


// Run the tests
//testChangeCategorySuccess(); // Test the successful fetch case
testChangeCategoryError();    // Test the error handling case

