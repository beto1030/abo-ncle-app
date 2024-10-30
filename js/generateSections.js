const fs = require('fs');
const path = require('path');

// Path to your sections directory
const sectionsDir = path.join(__dirname, '../sections');

// Initialize an object to hold section titles
const sectionTitles = {};

// Read the sections directory
fs.readdir(sectionsDir, (err, files) => {
    if (err) {
        console.error('Failed to read sections directory:', err);
        return;
    }

    // Loop through the files in the directory
    files.forEach(file => {
        if (file.endsWith('.html')) {
            const key = file.replace('.html', '');
            const title = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter
            sectionTitles[key] = title; // Add to the sectionTitles object
        }
    });

    // Write the sectionTitles object to sections.json
    fs.writeFileSync(path.join(__dirname, 'sections.json'), JSON.stringify(sectionTitles, null, 2));
    console.log('sections.json generated successfully:', sectionTitles);
});

