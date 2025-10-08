// ===============================
// Generate image array (1–42)
// ===============================
const images = [];
for (let i = 1; i <= 42; i++) {
    const extension = i === 3 ? 'jpg' : 'jpeg';
    images.push(`img/${i}.${extension}`);
}

let currentImageIndex = 0;

// ===============================
// Load Gallery
// ===============================
function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (!galleryGrid) {
        console.error('Gallery grid element not found!');
        return;
    }
    
    images.forEach((imgSrc, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Gallery Image ${index + 1}`;
        img.loading = 'lazy';
        
        // Error handling
        img.onerror = function() {
            console.error(`Failed to load image: ${imgSrc}`);
            item.style.display = 'none';
        };
        
        // Set grid span based on aspect ratio
        img.onload = function() {
            const aspectRatio = this.naturalHeight / this.naturalWidth;
            let span;
            
            if (aspectRatio > 1.5) span = 25;
            else if (aspectRatio > 1.2) span = 20;
            else if (aspectRatio > 0.8) span = 15;
            else span = 12;
            
            item.style.gridRowEnd = `span ${span}`;
        };
        
        img.onclick = function() {
            openLightbox(index);
        };
        
        item.appendChild(img);
        galleryGrid.appendChild(item);
    });
}

// ===============================
// Lightbox Functions
// ===============================
function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.add('active');
        document.getElementById('lightboxImg').src = images[index];
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
    } else if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
    }
    
    document.getElementById('lightboxImg').src = images[currentImageIndex];
}

// ===============================
// Keyboard & Click Controls
// ===============================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') changeImage(-1);
    else if (e.key === 'ArrowRight') changeImage(1);
});

const lightbox = document.getElementById('lightbox');
if (lightbox) {
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
    });
}

// ===============================
// Contact Form Handling
// ===============================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        const successMessage = document.getElementById('successMessage');
        successMessage.classList.add('show');
        
        this.reset();
        
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
        
        console.log('Form submitted:', { name, email, subject, message });
    });
}

// ===============================
// Scroll Spy - Active Nav Update
// ===============================
function scrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    // Determine which section is currently in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Adjust offset for fixed header height
        if (window.scrollY >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    // Special case: If scrolled to the very top, set current to 'home'
    if (window.scrollY < 200) {
        current = 'home'; // <-- Change 'home' to your actual hero section ID if different
    }

    // Update active link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', scrollSpy);
window.addEventListener('load', () => {
    loadGallery();
    scrollSpy();
});
