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

