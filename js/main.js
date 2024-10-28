let currentSlideIndex = 0;
let slides = [];

// Define section titles
const sectionTitles = {
    'anatomy': 'Anatomy',
    'physiology': 'Physiology',
    'pathology': 'Pathology'
};

// Function to load section content dynamically
function loadSection(section) {
    fetch(`${section}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(content => {
            // Update the title and current category
            document.title = sectionTitles[section];
            document.getElementById('section-content').innerHTML = content;

            // Reset slides and display the first one
            slides = document.querySelectorAll('.carousel-slide');
            currentSlideIndex = 0;
            showSlide(currentSlideIndex);
        })
        .catch(error => console.error('Error loading section:', error));
}

// Change Category function
function changeCategory(category) {
    loadSection(category); // Load the new section based on the selected category
}

// Populate dropdown menu with section titles
function populateDropdown() {
    const categoryDropdown = document.querySelector('.category-dropdown');
    
    // Clear existing options
    categoryDropdown.innerHTML = '';

    // Populate the dropdown with options from sectionTitles
    for (let key in sectionTitles) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = sectionTitles[key];
        categoryDropdown.appendChild(option);
    }
}

// Display terms from <h3> tags
function displayTerms(content) {
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const terms = tempDiv.querySelectorAll('h3');
    
    const termsDiv = document.getElementById('terms');
    termsDiv.innerHTML = ''; 

    const ul = document.createElement('ul');
    terms.forEach((term, index) => {
        const li = document.createElement('li');
        li.style.listStyle = "none";
        li.style.margin = "5px 0";

        const a = document.createElement('a');
        a.textContent = term.textContent;
        a.href = '#';
        a.setAttribute('data-index', index);
        a.addEventListener('click', function(event) {
            event.preventDefault();
            showFlashcard(index);
        });

        li.appendChild(a);
        ul.appendChild(li);
    });
    termsDiv.appendChild(ul);
}

// Show the selected flashcard
function showFlashcard(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
}

// Cycle through slides
function changeSlide(n) {
    currentSlideIndex += n;
    showSlide(currentSlideIndex);
}

// Display the current slide
function showSlide(index) {
    if (slides.length === 0) return;

    if (index >= slides.length) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = slides.length - 1;

    slides.forEach(slide => {
        slide.style.display = 'none'; // Hide all slides
    });

    slides[currentSlideIndex].style.display = 'block'; // Show the current slide
}

// Initialize the application on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    populateDropdown(); // Populate the dropdown with section titles
    loadSection('anatomy'); // Load the default category
});
