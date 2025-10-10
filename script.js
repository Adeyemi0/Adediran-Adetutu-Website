/**
 * Gallery Image Data
 * Note: Adjusted row span values for better masonry layout
 */
const galleryImages = [
    { src: "img/7.jpeg", alt: "Gallery Image 1", span: 18 },
    { src: "img/8.jpeg", alt: "Gallery Image 2", span: 12 },
    { src: "img/9.jpeg", alt: "Gallery Image 3", span: 22 },
    { src: "img/10.jpeg", alt: "Gallery Image 4", span: 15 },
    { src: "img/11.jpeg", alt: "Gallery Image 5", span: 10 },
    { src: "img/12.jpeg", alt: "Gallery Image 6", span: 16 },
    { src: "img/13.jpeg", alt: "Gallery Image 7", span: 18 },
    { src: "img/14.jpeg", alt: "Gallery Image 8", span: 13 },
    { src: "img/15.jpeg", alt: "Gallery Image 9", span: 20 },
    { src: "img/16.jpeg", alt: "Gallery Image 10", span: 16 },
    { src: "img/17.jpeg", alt: "Gallery Image 11", span: 10 },
    { src: "img/18.jpeg", alt: "Gallery Image 12", span: 22 },
    { src: "img/20.jpeg", alt: "Gallery Image 13", span: 18 },
    { src: "img/22.jpeg", alt: "Gallery Image 14", span: 15 },
    { src: "img/23.jpeg", alt: "Gallery Image 15", span: 20 },
    { src: "img/24.jpeg", alt: "Gallery Image 16", span: 12 },
    { src: "img/25.jpeg", alt: "Gallery Image 17", span: 16 },
    { src: "img/26.jpeg", alt: "Gallery Image 18", span: 22 },
    { src: "img/27.jpeg", alt: "Gallery Image 19", span: 18 },
    { src: "img/28.jpeg", alt: "Gallery Image 20", span: 15 }
];

let currentImageIndex = 0;

/**
 * Mobile Navigation Toggle and Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navbar = document.getElementById('navbar');
    const header = document.querySelector('header');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            navbar.classList.toggle('navbar-mobile');
            mobileNavToggle.classList.toggle('toggle-active');
            // Use body to prevent scroll on mobile when menu is open
            document.body.classList.toggle('mobile-nav-active'); 
        });

        // Close mobile nav on link click
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', () => {
                // Only close if it's currently open
                if (navbar.classList.contains('navbar-mobile')) {
                    navbar.classList.remove('navbar-mobile');
                    mobileNavToggle.classList.remove('toggle-active');
                    document.body.classList.remove('mobile-nav-active');
                }
            });
        });
    }

    // Initialize Portfolio Gallery
    setupGallery();
    
    // Initialize ScrollSpy
    setupScrollSpy();
});

/**
 * PORTFOLIO GALLERY LOGIC
 */
function setupGallery() {
    const galleryGrid = document.getElementById('galleryGrid');

    if (!galleryGrid) return;

    galleryImages.forEach((imgData, index) => {
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        // Set row span for masonry layout
        item.style.gridRowEnd = `span ${imgData.span}`;

        const img = document.createElement('img');
        img.src = imgData.src;
        img.alt = imgData.alt;
        img.loading = 'lazy'; // Use lazy loading for performance

        item.appendChild(img);
        
        // Open lightbox on click
        item.addEventListener('click', () => openLightbox(index));

        galleryGrid.appendChild(item);
    });
}

/**
 * SCROLLSPY LOGIC
 * Updates the active navigation link based on the visible section.
 */
function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Define the offset (e.g., header height) so the section becomes active slightly before it hits the top
    const offset = 100; 

    function onScroll() {
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            // Check if the current scroll position is within the section bounds
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Remove 'active' from all links and add it to the current one
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            } else if (scrollPosition < sections[0].offsetTop - offset) {
                // Special case: If scrolling to the very top, make 'Home' active
                 navLinks.forEach(link => link.classList.remove('active'));
                 document.querySelector('.nav-link[href="#hero"]').classList.add('active');
            }
        });
    }

    // Run once on load and every time the user scrolls
    window.addEventListener('scroll', onScroll);
    // Initial check for 'Home' section
    onScroll(); 
}


/**
 * LIGHTBOX FUNCTIONS (Made globally accessible by placing them in the global scope)
 */

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling background
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
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

// Close lightbox when clicking outside the image content
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
        closeLightbox();
    }
});

// Expose functions to the global scope so they can be called from onclick in HTML
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.changeImage = changeImage;
