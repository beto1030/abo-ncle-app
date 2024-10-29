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


            slides = [];
            // Populate slides array with new cards from this section only
            const existingSlides = document.querySelectorAll('.carousel-slide');
            existingSlides.forEach((card, index) => {
                card.dataset.number = index + 1; // Set data attribute for numbering
                /*card.insertAdjacentHTML('afterbegin', `<span class="flashcard-number">${index + 1}</span>`);*/
                slides.push(card); // Add each new card to the slides array
            });

            // Reset slides and display the first one
            currentSlideIndex = 0;
            showSlide(currentSlideIndex);
        })
        .catch(error => console.error('Error loading section:', error));
}

// Change Category function
function changeCategory(category) {
    loadSection(category); // Load the new section based on the selected category
}
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
/*
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
*/



// Cycle through slides with wrapping behavior
function changeSlide(n) {
    currentSlideIndex += n;

    // Wrap around if the index goes out of bounds
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0; // Go back to the first slide
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1; // Go to the last slide
    }

    showSlide(currentSlideIndex);
}

// Display the current slide
function showSlide(index) {
    if (slides.length === 0) return;

    // Hide all slides and show only the current one
    slides.forEach(slide => {
        slide.style.display = 'none';
    });

    slides[currentSlideIndex].style.display = 'block';
}

function openGridView() {
    const gridViewContainer = document.getElementById('grid-view-container');
    gridViewContainer.innerHTML = ''; // Clear previous content in the grid view


    // Ensure only cards from the current category are shown in the popup
    slides.forEach(slide => {
        const cardClone = slide.cloneNode(true); // Clone the flashcard
        cardClone.style.display = 'block';       // Ensure it displays in the popup

        // Append cloned card to the grid view container
        gridViewContainer.appendChild(cardClone);
    });

    // Show the grid view popup
    document.getElementById('grid-view-popup').classList.remove('hidden');
}







function closeGridView() {
    const gridViewPopup = document.getElementById('grid-view-popup');
    gridViewPopup.classList.add('hidden'); // Hide the popup

    // Optionally clear the grid view container
    const gridViewContainer = document.getElementById('grid-view-container');
    gridViewContainer.innerHTML = ''; // Clear the content

    // Ensure all slides are hidden, and the current one is shown
    slides.forEach(slide => {
        slide.style.display = 'none'; // Hide all flashcards again
    });

    // Show the current slide after closing
    showSlide(currentSlideIndex);
}


// Initialize and display the first flashcard on page load
showSlide(currentSlideIndex);



// Initialize the application on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    populateDropdown(); // Populate the dropdown with section titles
    loadSection('anatomy'); // Load the default category
});
