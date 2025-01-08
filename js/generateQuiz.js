import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to truncate strings
function truncateString(str, maxLength = 100) {
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

async function generateQuizData() {
  const sectionsFilePath = path.join(__dirname, 'sections.json');
  const outputFilePath = path.join(__dirname, 'quizData.json');

  try {
    const sectionsContent = await fs.readFile(sectionsFilePath, 'utf-8');
    const sections = JSON.parse(sectionsContent);

    const quizData = {};

    for (const categoryKey in sections) {
      const category = sections[categoryKey];
      const quizzes = category.cards.map((card, index, allCards) => {
        const question = `What does the ${card.title.toLowerCase()} do?`;

        // Correct answer
        const correctAnswer = truncateString(card.content);

        // Dummy options
        const dummyOptions = allCards
          .filter((otherCard) => otherCard.title !== card.title)
          .map((otherCard) => truncateString(otherCard.content))
          .slice(0, 3);

        while (dummyOptions.length < 3) {
          dummyOptions.push("General placeholder content");
        }

        // Combine and shuffle options
        const options = [correctAnswer, ...dummyOptions].sort(() => Math.random() - 0.5);

        return {
          question,
          options,
          correctAnswer: options.indexOf(correctAnswer)
        };
      });

      quizData[categoryKey] = quizzes;
    }

    await fs.writeFile(outputFilePath, JSON.stringify(quizData, null, 2));
    console.log('quizData.json generated successfully!');
  } catch (error) {
    console.error('Error generating quizData.json:', error);
  }
}

generateQuizData();

