/*
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
*/
/*
import fs from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';

// Helper to get the directory name (since __dirname isn't available in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSections() {
    const sectionsDir = path.join(__dirname, '../sections');
    const outputPath = path.join(__dirname, 'sections.json');

    try {
        const files = await fs.readdir(sectionsDir);
        const sections = {};

        for (const file of files) {
            if (file.endsWith('.html')) {
                const key = file.replace('.html', '');
                const title = file.charAt(0).toUpperCase() + file.slice(1, -5);

                const htmlContent = await fs.readFile(path.join(sectionsDir, file), 'utf-8');
                const dom = new JSDOM(htmlContent);
                const document = dom.window.document;

                const cards = Array.from(document.querySelectorAll('.carousel-slide')).map(slide => ({
                    title: slide.querySelector('h3').textContent.trim(),
                    content: slide.querySelector('p').textContent.trim()
                }));

                sections[key] = {
                    title,
                    cards
                };
            }
        }

        await fs.writeFile(outputPath, JSON.stringify(sections, null, 2));
        console.log('sections.json generated successfully!');
    } catch (error) {
        console.error('Error generating sections.json:', error);
    }
}

generateSections();
*/

import fs from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSections() {
    const sectionsDir = path.join(__dirname, '../sections');
    const outputPath = path.join(__dirname, 'sections.json');

    try {
        const files = await fs.readdir(sectionsDir);
        const sections = {};

        for (const file of files) {
            if (file.endsWith('.html')) {
                const key = file.replace('.html', '');
                const title = file.charAt(0).toUpperCase() + file.slice(1, -5);

                const htmlContent = await fs.readFile(path.join(sectionsDir, file), 'utf-8');
                const dom = new JSDOM(htmlContent);
                const document = dom.window.document;

                const cards = Array.from(document.querySelectorAll('.carousel-slide')).map(slide => {
                    const title = slide.querySelector('h3').textContent.trim();
                    const content = slide.querySelector('p').textContent.trim();

                    // Convert title to lowercase and replace spaces with underscores for image filename
                    const imageSrc = `images/${title.toLowerCase().replace(/ /g, "-")}.png`;

                    return { title, content, imageSrc };
                });

                sections[key] = {
                    title,
                    cards
                };
            }
        }

        await fs.writeFile(outputPath, JSON.stringify(sections, null, 2));
        console.log('sections.json generated successfully!');
    } catch (error) {
        console.error('Error generating sections.json:', error);
    }
}

generateSections();

