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
    // Fetch content from external files
    fetch(`${section}.html`)
        .then(response => response.text())
        .then(content => {
            // Update title and content
            document.title = sectionTitles[section];
            document.getElementById('section-title').innerHTML = sectionTitles[section];
            document.getElementById('section-content').innerHTML = content;
            
            // Extract and display terms from <h3> tags
            displayTerms(content);

            // After loading content, find all slides in the section
            slides = document.querySelectorAll('.carousel-slide');
            currentSlideIndex = 0; // Reset the slide index
            showSlide(currentSlideIndex); // Show the first slide

            // Update the navigation menu with the current section
            updateNavMenu(section);
        })
        .catch(error => console.error('Error loading section:', error));
}
// Function to initialize the navigation menu
function initializeNavMenu() {
    const navMenu = document.getElementById('nav-menu');
    for (let key in sectionTitles) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = "#";
        link.setAttribute('data-section', key);
        link.textContent = sectionTitles[key];

        // Add click event to load section
        link.addEventListener('click', function(event) {
            event.preventDefault();
            loadSection(key);
        });

        listItem.appendChild(link);
        navMenu.appendChild(listItem);
    }
}

// Function to display terms from <h3> tags
function displayTerms(content) {
    console.log(content);

    // Create a temporary element to parse the fetched content
    let tempDiv = document.getElementById("terms");
    tempDiv.innerHTML = content;

    // Get all <h3> tags from the temporary element
    const terms = tempDiv.querySelectorAll('h3');

    // Get the term list element
    const termsDiv = document.getElementById('terms');
    termsDiv.innerHTML = ''; // Clear previous terms

    // Create a list for the terms
    const ul = document.createElement('ul');

    terms.forEach((term, index) => {
    const li = document.createElement('li');
    li.style.listStyle = "none";
    li.style.margin = "5px 0";

    // Create an <a> tag
    const a = document.createElement('a');
    a.textContent = term.textContent; // Set the term text as the link text
    a.setAttribute('href', '#'); // Prevent the default behavior by setting href to "#"
    a.setAttribute('data-index', index); // Set data-index attribute

    // Add click event to show the flashcard for the term
    a.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default anchor link behavior
        showFlashcard(index); // Show flashcard based on the clicked index
    });

    li.appendChild(a); // Append the <a> to the <li>
    ul.appendChild(li); // Append the <li> to the list
});


    termsDiv.appendChild(ul); // Append the list to the term list div
}

// Function to show the flashcard based on the index
function showFlashcard(index) {
    // Assuming 'slides' is an array of your flashcard elements
    currentSlideIndex = index; // Set the current slide index to the clicked term's index
    showSlide(currentSlideIndex); // Show the corresponding flashcard
}

// Function to handle term click and show the corresponding flashcard
function attachTermListeners() {
    const terms = document.querySelectorAll('#terms');
    terms.forEach(function(term) {
        term.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            const index = parseInt(this.getAttribute('data-index'), 10);
            showSlide(index); // Show the flashcard corresponding to the clicked term
        });
    });
}


// Function to change the slide in the carousel
function changeSlide(n) {
    currentSlideIndex += n;
    showSlide(currentSlideIndex);
}

// Function to show a specific slide
function showSlide(index) {
    if (slides.length === 0) return;

    // Wrap around if the index goes out of bounds
    if (index >= slides.length) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = slides.length - 1;

    // Hide all slides
    slides.forEach(slide => {
        slide.style.display = 'none';
    });

    // Show the current slide
    slides[currentSlideIndex].style.display = 'block';
}

// Load section and update the current section title
function updateCurrentSection(section) {
    const currentSectionElement = document.getElementById('current-section');
    currentSectionElement.textContent = sectionTitles[section]; // Display the clicked section name
}

// Call this function initially to set up the navigation menu
document.addEventListener('DOMContentLoaded', function() {
    initializeNavMenu();
    loadSection('anatomy'); // Load initial section
    attachTermListeners(); // Attach listeners to the list of terms
});
