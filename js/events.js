//import { navigateMenu } from './ui.js';
//
//
//document.addEventListener('DOMContentLoaded', () => {
//    setTimeout(()=>{
//        const menuItems = document.querySelectorAll('#menuContent li');
//        const totalItems = menuItems.length;
//
//        // Example for the Next button
//        document.getElementById('nextBtn').addEventListener('click', () => {
//            navigateMenu(1, menuItems, totalItems);
//        });
//
//        // Example for the Previous button
//        document.getElementById('prevBtn').addEventListener('click', () => {
//            navigateMenu(-1, menuItems, totalItems);
//        });
//        
//    },2000);
//
//});
import {navigateMenu} from './ui.js'

function attachNavigationListeners() {
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');

    if (nextButton && prevButton) {
        nextButton.onclick = () => navigateMenu(1); // Move forward
        prevButton.onclick = () => navigateMenu(-1); // Move backward
    }
}

// Call this function whenever the DOM is updated dynamically


document.addEventListener('DOMContentLoaded', () => {
    attachNavigationListeners();

    const menuTab = document.getElementById('menuTab');
    const notesTab = document.getElementById('notesTab');
    const menuContent = document.getElementById('menuContent');
    const notesContent = document.getElementById('notesContent');

    // Event listener for the Menu tab
    menuTab.addEventListener('click', () => {
        menuTab.classList.add('active');
        notesTab.classList.remove('active');
        menuContent.style.display = 'block';
        notesContent.style.display = 'none';
    });

    // Event listener for the Notes tab
    notesTab.addEventListener('click', () => {
        notesTab.classList.add('active');
        menuTab.classList.remove('active');
        notesContent.style.display = 'block';
        menuContent.style.display = 'none';
    });
});


