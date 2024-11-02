// globals.js
export let currentSlideIndex = 0;

export function setCurrentSlideIndex(index) {
    currentSlideIndex = index;
}

export let slides = [];

//export const slideElement= document.getElementById('carousel-slide');

//export const slideElements = document.getElementsByClassName('carousel-slide');

export const slideElements = document.getElementById('section-content').children;

