/* src/scripts/projects.js */

const overlay = document.getElementById('project-overlay');
const closeBtn = document.getElementById('close-overlay');
const projectCards = document.querySelectorAll('.project-card');

const track = document.getElementById('carousel-track');
const dotsNav = document.getElementById('carousel-dots');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const carouselContainer = document.querySelector('.carousel-container');
const featureList = document.getElementById('overlay-features-list');

let currentSlide = 0;
let totalSlides = 0;

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;
let currentIndex = 0;

projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h4').innerText;
        const tech = card.querySelector('.project-tech').innerHTML;
        
        const images = (card.getAttribute('data-images') || '').split(',');
        const longDesc = card.getAttribute('data-desc') || "No description available.";
        const featuresString = card.getAttribute('data-features') || "";

        currentIndex = 0;
        totalSlides = images.length;
        track.innerHTML = '';
        dotsNav.innerHTML = '';
        
        images.forEach((imgUrl, index) => {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.addEventListener('dragstart', (e) => e.preventDefault());
            track.appendChild(img);
            
            const dot = document.createElement('div');
            dot.classList.add('c-dot');
            if(index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlidePosition();
            });
            dotsNav.appendChild(dot);
        });

        document.getElementById('overlay-title').innerText = title;
        document.getElementById('overlay-tech').innerHTML = tech;
        
        document.getElementById('overlay-desc').innerText = longDesc;

        featureList.innerHTML = '';
        if (featuresString) {
            const features = featuresString.split('|');
            features.forEach(feature => {
                const li = document.createElement('li');
                li.innerText = feature.trim();
                featureList.appendChild(li);
            });
        } else {
            featureList.innerHTML = '<li>No specific features listed.</li>';
        }

        updateSlidePosition();
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('active'), 10);
        document.querySelector('.snap-container').style.overflowY = 'hidden';
    });
});


function updateSlidePosition() {
    track.style.transition = 'transform 0.3s ease-out';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    const dots = document.querySelectorAll('.c-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

nextBtn.addEventListener('click', () => {
    if (currentIndex < totalSlides - 1) currentIndex += 1;
    else currentIndex = 0;
    updateSlidePosition();
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) currentIndex -= 1;
    else currentIndex = totalSlides - 1;
    updateSlidePosition();
});



// 1. Touch Events
carouselContainer.addEventListener('touchstart', touchStart);
carouselContainer.addEventListener('touchend', touchEnd);
carouselContainer.addEventListener('touchmove', touchMove);

// 2. Mouse Events
carouselContainer.addEventListener('mousedown', touchStart);
carouselContainer.addEventListener('mouseup', touchEnd);
carouselContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    cancelAnimationFrame(animationID);
});
carouselContainer.addEventListener('mousemove', touchMove);

function touchStart(index) {
    return function (event) {
        isDragging = true;
        // Get X position based on Touch or Mouse
        startPos = getPositionX(event);

        // Disable transition for instant drag response
        track.style.transition = 'none';
    }
}

function touchMove(event) {
    if (!isDragging) return;

    if (isDragging) {
        const currentPosition = getPositionX(event);
        // Calculate how much we moved
        const currentDrag = currentPosition - startPos;
        // Add that to where the slide currently starts (-100%, -200%, etc)
        // We convert percentage to pixels roughly for the drag effect
        const containerWidth = carouselContainer.offsetWidth;
        const currentOffset = -(currentIndex * containerWidth);
        animationID = requestAnimationFrame(animation);

        currentTranslate = currentOffset + currentDrag;
    }
}

function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);

    // Calculate how much we moved
    const movedBy = currentTranslate - (-(currentIndex * carouselContainer.offsetWidth));

    // Threshold: If moved more than 100px, change slide
    if (movedBy < -50 && currentIndex < totalSlides - 1) currentIndex += 1;
    if (movedBy > 50 && currentIndex > 0) currentIndex -= 1;

    updateSlidePosition();
}

function getPositionX(event) {
    return event.type.includes('mouse')
        ? event.pageX
        : event.touches[0].clientX;
}

function animation() {
    if (isDragging) {
        track.style.transform = `translateX(${currentTranslate}px)`;
        animationID = requestAnimationFrame(animation);
    }
}

const startDrag = (event) => {
    isDragging = true;
    startPos = getPositionX(event);

    currentTranslate = -(currentIndex * carouselContainer.offsetWidth);
    prevTranslate = currentTranslate;

    track.style.transition = 'none';
}
carouselContainer.removeEventListener('touchstart', touchStart);
carouselContainer.addEventListener('touchstart', startDrag);
carouselContainer.removeEventListener('mousedown', touchStart);
carouselContainer.addEventListener('mousedown', startDrag);


function closeOverlay() {
    overlay.classList.remove('active');
    setTimeout(() => {
        overlay.classList.add('hidden');
        document.querySelector('.snap-container').style.overflowY = 'scroll';
    }, 300);
}

closeBtn.addEventListener('click', closeOverlay);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });