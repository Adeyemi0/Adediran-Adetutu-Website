// Mobile Navigation Toggle
        function mobileNavToggle() {
            const navbar = document.getElementById('navbar');
            const toggle = document.getElementById('mobile-nav-toggle');

            if (navbar && toggle) {
                navbar.classList.toggle('navbar-mobile');

                if (navbar.classList.contains('navbar-mobile')) {
                    toggle.innerHTML = 'X';
                } else {
                    toggle.innerHTML = '☰';
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
            }
        }

        // Initialize on Load
        window.addEventListener('load', () => {
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
        });