let quizData = null; // Cache the loaded quiz data

// Function to load quiz data from the JSON file
export async function loadQuizData() {
    if (quizData) {
        console.log('Using cached quiz data:', quizData);
        return quizData; // Return cached data if already loaded
    }

    try {
        const response = await fetch('./js/quizData.json');
        console.log('Fetch Response:', response);
        if (!response.ok) {
            throw new Error(`Failed to fetch quiz data: ${response.status} ${response.statusText}`);

        }
        quizData = await response.json();
        console.log('Loaded Quiz Data:', quizData);
        return quizData;
    } catch (error) {
        console.error('Error loading quiz data:', error);
        return null;
    }
}

