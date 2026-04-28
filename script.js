// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Check local storage for theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.setAttribute('data-theme', currentTheme);
}

themeToggleBtn.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'light') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

// Live Date/Time Display
const datetimeDisplay = document.getElementById('datetime-display');

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    datetimeDisplay.textContent = `System Time: ${now.toLocaleDateString('en-US', options)}`;
}

// Update time immediately and then every second
updateDateTime();
setInterval(updateDateTime, 1000);

// Form Validation
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent actual submission

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name === '' || email === '' || message === '') {
        alert('ERROR: All fields must be filled out to send a message.');
        return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('ERROR: Please enter a valid email address.');
        return;
    }

    alert(`SUCCESS: Message from ${name} has been queued for delivery.\nWe will contact you at ${email}.`);
    contactForm.reset();
});

// Projects Carousel
const projectsTrack = document.getElementById('projects-track');
const projectsPrevBtn = document.getElementById('projects-prev');
const projectsNextBtn = document.getElementById('projects-next');
const projectsIndicator = document.getElementById('projects-indicator');

if (projectsTrack && projectsPrevBtn && projectsNextBtn && projectsIndicator) {
    const projectSlides = projectsTrack.querySelectorAll('.project-slide');
    let activeProject = 0;

    function renderProject(index) {
        projectsTrack.style.transform = `translateX(-${index * 100}%)`;
        projectsIndicator.textContent = `${index + 1} / ${projectSlides.length}`;
    }

    projectsPrevBtn.addEventListener('click', () => {
        activeProject = (activeProject - 1 + projectSlides.length) % projectSlides.length;
        renderProject(activeProject);
    });

    projectsNextBtn.addEventListener('click', () => {
        activeProject = (activeProject + 1) % projectSlides.length;
        renderProject(activeProject);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            projectsPrevBtn.click();
        }

        if (event.key === 'ArrowRight') {
            projectsNextBtn.click();
        }
    });

    renderProject(activeProject);
}

// Floating Scroll To Top Button
const scrollTopBtn = document.getElementById('scroll-top-btn');

if (scrollTopBtn) {
    function toggleScrollTopButton() {
        if (window.scrollY > 250) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleScrollTopButton);

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    toggleScrollTopButton();
}

// Mobile Header Collapse
const stickyTop = document.getElementById('sticky-top');
const mobileHeaderToggleBtn = document.getElementById('mobile-header-toggle');
const mobileNavLinks = document.querySelectorAll('nav a');

if (stickyTop && mobileHeaderToggleBtn) {
    const mobileQuery = window.matchMedia('(max-width: 600px)');

    function setHeaderState(isOpen) {
        stickyTop.classList.toggle('is-open', isOpen);
        mobileHeaderToggleBtn.setAttribute('aria-expanded', String(isOpen));
        mobileHeaderToggleBtn.textContent = isOpen ? 'Close Menu' : 'Menu';
    }

    function syncHeaderStateByScreen() {
        if (mobileQuery.matches) {
            setHeaderState(false);
        } else {
            setHeaderState(true);
        }
    }

    mobileHeaderToggleBtn.addEventListener('click', () => {
        const isOpen = stickyTop.classList.contains('is-open');
        setHeaderState(!isOpen);
    });

    mobileNavLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (mobileQuery.matches) {
                setHeaderState(false);
            }
        });
    });

    if (typeof mobileQuery.addEventListener === 'function') {
        mobileQuery.addEventListener('change', syncHeaderStateByScreen);
    } else {
        mobileQuery.addListener(syncHeaderStateByScreen);
    }

    syncHeaderStateByScreen();
}

// Active Navigation Highlight
const sectionNavLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));

if (sectionNavLinks.length > 0) {
    const sectionTargets = sectionNavLinks
        .map((link) => {
            const targetId = link.getAttribute('href');
            if (!targetId) {
                return null;
            }

            const section = document.querySelector(targetId);
            if (!section) {
                return null;
            }

            return { link, section };
        })
        .filter(Boolean);

    function setActiveNavLink(activeLink) {
        sectionTargets.forEach(({ link }) => {
            const isActive = link === activeLink;
            link.classList.toggle('active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    function updateActiveLinkOnScroll() {
        const viewportMidpoint = window.scrollY + (window.innerHeight * 0.35);
        let currentItem = sectionTargets[0];

        sectionTargets.forEach((item) => {
            if (item.section.offsetTop <= viewportMidpoint) {
                currentItem = item;
            }
        });

        if (currentItem) {
            setActiveNavLink(currentItem.link);
        }
    }

    function scrollToSectionStart(section) {
        const stickyHeight = stickyTop ? stickyTop.getBoundingClientRect().height : 0;
        const targetY = Math.max(
            0,
            window.scrollY + section.getBoundingClientRect().top - stickyHeight - 8
        );

        window.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });
    }

    sectionTargets.forEach(({ link, section }) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            setActiveNavLink(link);
            scrollToSectionStart(section);

            if (section.id) {
                history.replaceState(null, '', `#${section.id}`);
            }
        });
    });

    window.addEventListener('scroll', updateActiveLinkOnScroll);
    window.addEventListener('resize', updateActiveLinkOnScroll);
    updateActiveLinkOnScroll();
}
