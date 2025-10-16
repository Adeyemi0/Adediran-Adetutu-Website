/**
 * Gallery Image Data
 */
const galleryImages = [
    { src: "img/7.jpeg", alt: "Gallery Image 1" },
    { src: "img/8.jpeg", alt: "Gallery Image 2" },
    { src: "img/9.jpeg", alt: "Gallery Image 3" },
    { src: "img/10.jpeg", alt: "Gallery Image 4" },
    { src: "img/11.jpeg", alt: "Gallery Image 5" },
    { src: "img/12.jpeg", alt: "Gallery Image 6" },
    { src: "img/13.jpeg", alt: "Gallery Image 7" },
    { src: "img/14.jpeg", alt: "Gallery Image 8" },
    { src: "img/15.jpeg", alt: "Gallery Image 9" },
    { src: "img/16.jpeg", alt: "Gallery Image 10" },
    { src: "img/17.jpeg", alt: "Gallery Image 11" },
    { src: "img/18.jpeg", alt: "Gallery Image 12" },
    { src: "img/20.jpeg", alt: "Gallery Image 13" },
    { src: "img/22.jpeg", alt: "Gallery Image 14" },
    { src: "img/23.jpeg", alt: "Gallery Image 15" },
    { src: "img/24.jpeg", alt: "Gallery Image 16" },
    { src: "img/25.jpeg", alt: "Gallery Image 17" },
    { src: "img/26.jpeg", alt: "Gallery Image 18" },
    { src: "img/27.jpeg", alt: "Gallery Image 19" },
    { src: "img/28.jpeg", alt: "Gallery Image 20" }
];

let currentImageIndex = 0;
let currentCarouselIndex = 0;

/**
 * Mobile Navigation Toggle and Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navbar = document.getElementById('navbar');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            navbar.classList.toggle('navbar-mobile');
            mobileNavToggle.classList.toggle('toggle-active');
            document.body.classList.toggle('mobile-nav-active'); 
        });

        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', () => {
                if (navbar.classList.contains('navbar-mobile')) {
                    navbar.classList.remove('navbar-mobile');
                    mobileNavToggle.classList.remove('toggle-active');
                    document.body.classList.remove('mobile-nav-active');
                }
            });
        });
    }

    // Initialize 3D Carousel
    setup3DCarousel();
    
    // Initialize ScrollSpy
    setupScrollSpy();
});

/**
 * 3D CAROUSEL SETUP
 */
function setup3DCarousel() {
    const carouselWrapper = document.getElementById('carouselWrapper');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!carouselWrapper) return;

    // Create carousel cards
    galleryImages.forEach((imgData, index) => {
        const card = document.createElement('div');
        card.classList.add('carousel-card');
        card.dataset.index = index;

        const img = document.createElement('img');
        img.src = imgData.src;
        img.alt = imgData.alt;
        img.loading = 'lazy';

        card.appendChild(img);
        
        // Click on card to center it or open lightbox if already centered
        card.addEventListener('click', () => {
            if (currentCarouselIndex === index) {
                openLightbox(index);
            } else {
                currentCarouselIndex = index;
                updateCarousel();
            }
        });

        carouselWrapper.appendChild(card);

        // Create indicator dot
        const dot = document.createElement('div');
        dot.classList.add('carousel-indicator');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentCarouselIndex = index;
            updateCarousel();
        });
        indicatorsContainer.appendChild(dot);
    });

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        currentCarouselIndex = (currentCarouselIndex - 1 + galleryImages.length) % galleryImages.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentCarouselIndex = (currentCarouselIndex + 1) % galleryImages.length;
        updateCarousel();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('lightbox').classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            currentCarouselIndex = (currentCarouselIndex - 1 + galleryImages.length) % galleryImages.length;
            updateCarousel();
        } else if (e.key === 'ArrowRight') {
            currentCarouselIndex = (currentCarouselIndex + 1) % galleryImages.length;
            updateCarousel();
        }
    });

    // Initial update
    updateCarousel();
}

/**
 * UPDATE CAROUSEL POSITIONS
 */
function updateCarousel() {
    const cards = document.querySelectorAll('.carousel-card');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const totalCards = cards.length;

    cards.forEach((card, index) => {
        const position = index - currentCarouselIndex;
        
        // Remove all position classes
        card.classList.remove('active', 'left-1', 'left-2', 'left-3', 'right-1', 'right-2', 'right-3', 'hidden');

        // Assign new position class
        if (position === 0) {
            card.classList.add('active');
        } else if (position === 1 || position === -(totalCards - 1)) {
            card.classList.add('right-1');
        } else if (position === 2 || position === -(totalCards - 2)) {
            card.classList.add('right-2');
        } else if (position === 3 || position === -(totalCards - 3)) {
            card.classList.add('right-3');
        } else if (position === -1 || position === (totalCards - 1)) {
            card.classList.add('left-1');
        } else if (position === -2 || position === (totalCards - 2)) {
            card.classList.add('left-2');
        } else if (position === -3 || position === (totalCards - 3)) {
            card.classList.add('left-3');
        } else {
            card.classList.add('hidden');
        }
    });

    // Update indicators
    indicators.forEach((dot, index) => {
        if (index === currentCarouselIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

/**
 * SCROLLSPY LOGIC
 */
function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const offset = 100;

    function onScroll() {
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            } else if (scrollPosition < sections[0].offsetTop - offset) {
                navLinks.forEach(link => link.classList.remove('active'));
                document.querySelector('.nav-link[href="#hero"]').classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll);
    onScroll();
}

/**
 * LIGHTBOX FUNCTIONS
 */
function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function changeImage(direction) {
    currentImageIndex += direction;

    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }

    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = galleryImages[currentImageIndex].src;
}

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('lightbox').classList.contains('active')) {
        closeLightbox();
    }
});

// Close lightbox when clicking outside the image
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
        closeLightbox();
    }
});

// Expose functions globally
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.changeImage = changeImage;
