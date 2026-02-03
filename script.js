document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            // Check if we are on mobile (using the same breakpoint as CSS)
            const isMobile = window.innerWidth <= 900;
            const scrollContainer = isMobile ? window : document.querySelector('.main-content');

            // Special handling for Overview to scroll to extreme top
            if (targetId === '#intro') {
                scrollContainer.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                history.pushState(null, null, targetId);
                return;
            }

            // Use getElementById to avoid issues with IDs starting with numbers
            const targetElement = document.getElementById(targetId.substring(1));
            if (targetElement) {
                if (isMobile) {
                    // Native window scrolling
                    const headerOffset = 60; // Approximate header height
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                } else {
                    // Container scrolling
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }

                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });

    // 2. Active Link Highlighting (ScrollSpy)
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const isMobile = window.innerWidth <= 900;

    // We observe the main content scrolling or the sections entering view
    const observerOptions = {
        root: isMobile ? null : document.querySelector('.main-content'), // Null means viewport
        // Tighter active zone vertically to prevent early triggering.
        rootMargin: '-10% 0px -85% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active to current
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
