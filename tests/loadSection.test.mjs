// loadSection.test.mjs

import { loadSection } from '../js/data.js';

// Custom test function to handle async tests
function test(description, fn) {
    fn()
        .then(() => console.log(`✔️ Success: ${description}`))
        .catch(error => {
            console.error(`❌ Error: ${description}`);
            console.error(error);
        });
}

// Mock the fetch function to simulate network requests
async function mockFetch(url) {
    if (url === './js/sections.json') {
        // Simulate fetching the JSON file successfully
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                sections: [
                    { key: 'anatomy', title: 'Anatomy' },
                    { key: 'pathology', title: 'Pathology' },
                    { key: 'physiology', title: 'Physiology' }
                ]
            })
        });
    } else if (url === './sections/anatomy.html') {
        // Simulate fetching the anatomy.html content successfully
        return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(`
                <div class="carousel-slide">
                    <h3>Cornea</h3>
                    <p>The cornea is the transparent, dome-shaped surface that covers the front of the eye.</p>
                </div>
            `)
        });
    } else {
        // Simulate a failed fetch for nonexistent sections
        return Promise.resolve({
            ok: false,
            status: 404,
            text: () => Promise.resolve('File not found')
        });
    }
}

// Override global fetch with the mock fetch function for testing
global.fetch = mockFetch;

// Test case: successfully loads the anatomy section
test('loads anatomy section successfully', async () => {
    const { title, content } = await loadSection('anatomy');

    // Check if the content includes "Cornea" and if the title is "Anatomy"
    if (title !== 'Anatomy') {
        throw new Error('Title did not load correctly');
    }
    if (!content.includes('Cornea')) {
        throw new Error('Content did not load correctly');
    }
});

// Test case: fails to load a nonexistent section
test('fails to load nonexistent section', async () => {
    try {
        // Attempt to load a section that doesn't exist
        await loadSection('nonexistent');
        throw new Error('Expected error was not thrown');
    } catch (error) {
        // Verify the error message contains "Network response was not ok"
        if (!error.message.includes('Network response was not ok')) {
            throw new Error('Error message was incorrect');
        }
    }
});

