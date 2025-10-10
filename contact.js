// Mobile Navigation Toggle
function mobileNavToggle() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('mobile-nav-toggle');

    if (navbar && toggle) {
        navbar.classList.toggle('navbar-mobile');

        if (navbar.classList.contains('navbar-mobile')) {
            // Change to 'X' for close icon
            toggle.innerHTML = 'X';
            toggle.style.fontSize = '2.2rem'; // make 'X' a bit bigger for visibility
        } else {
            // Change back to '☰' for menu icon
            toggle.innerHTML = '☰';
            toggle.style.fontSize = '1.8rem';
        }
    }
}

// Close Mobile Menu
function closeMobileNav() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('mobile-nav-toggle');
    
    if (navbar && navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile');
        toggle.innerHTML = '☰';
        toggle.style.fontSize = '1.8rem';
    }
}

// Handle Contact Form Submission
function handleFormSubmission(event) {
    // Prevent the default form submission action
    event.preventDefault(); 

    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const submitButton = form.querySelector('.submit-btn');

    // Simulate form submission process
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate an AJAX request delay (e.g., 2 seconds)
    setTimeout(() => {
        // 1. Hide the form (optional, but cleaner)
        form.style.display = 'none'; 
        
        // 2. Show the success message
        successMessage.style.display = 'block';

        // 3. Reset the button state and text after the success message is shown
        submitButton.textContent = 'Send Message';
        submitButton.disabled = false;

        // 4. Optionally, clear the form fields if the form was not hidden
        // form.reset(); 

        // Optional: Hide the success message and show the form again after a few seconds
        // setTimeout(() => {
        //     successMessage.style.display = 'none';
        //     form.style.display = 'block';
        // }, 5000);

    }, 2000); // 2000 milliseconds = 2 seconds delay
}


// Initialize on Load
window.addEventListener('load', () => {
    // 1. Mobile Navigation
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', mobileNavToggle);
    }

    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileNav();
        });
    });

    // 2. Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Attach the form submission handler
        contactForm.addEventListener('submit', handleFormSubmission);
    }
});