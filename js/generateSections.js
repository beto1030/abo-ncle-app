const fs = require('fs');
const path = require('path');

function generateSections() {
    //this path is relative to current js directory. for this file to see my sections folder i need to go back a directory
    const sectionsDir = path.join(__dirname, '../sections'); // Adjust the path as needed

    // Read the directory and generate the sections JSON
    fs.readdir(sectionsDir, (err, files) => {
        if (err) {
            console.error('Error reading sections directory:', err);
            return;
        }

        // Filter HTML files and create the desired structure
        const sections = files
            .filter(file => file.endsWith('.html')) // Filter for .html files
            .map(file => ({
                key: file.replace('.html', ''), // Remove the .html extension for the key
                title: file.charAt(0).toUpperCase() + file.slice(1, -5) // Capitalize first letter for title
            }));

        // Wrap the sections array in an object
        const sectionsJson = {
            sections: sections
        };

        // Write to sections.json file
        // '../js/sections.json' becuase this is relative from inside the sections directory. since im in the sections folder i need to get out and then get in js directory
        fs.writeFile(path.join(sectionsDir, '../js/sections.json'), JSON.stringify(sectionsJson, null, 2), (err) => {
            if (err) {
                console.error('Error writing sections.json:', err);
            } else {
                console.log('sections.json generated successfully!');
            }
        });
    });
}

// Call the function to generate sections.json
generateSections();

