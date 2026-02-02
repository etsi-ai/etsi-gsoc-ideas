document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            // Special handling for Overview to scroll to extreme top
            if (targetId === '#intro') {
                document.querySelector('.main-content').scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                history.pushState(null, null, targetId);
                return;
            }

            // Use getElementById to avoid issues with IDs starting with numbers
            const targetElement = document.getElementById(targetId.substring(1));
            if (targetElement) {
                // Adjust for fixed headers if necessary, but here we just scroll main content
                // Since main-content is the scroll container, we rely on scrollIntoView
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });

    // 2. Active Link Highlighting (ScrollSpy)
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // We observe the main content scrolling or the sections entering view
    const observerOptions = {
        root: document.querySelector('.main-content'), // The scroll container
        // Tighter active zone vertically to prevent early triggering.
        // Top: -10% (activates when element is near top)
        // Bottom: -85% (element is considered "gone" or "not yet active" if it's lower than top 15% of viewport)
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
