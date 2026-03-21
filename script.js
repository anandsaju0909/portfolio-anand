// ===================================
// SCROLL REVEAL — Intersection Observer
// ===================================

function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once revealed, stop observing
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '-4% 0px'
    });

    revealEls.forEach(el => observer.observe(el));

    // Immediately reveal elements that start in the viewport (intro section)
    revealEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            // small delay so CSS transition fires visibly
            setTimeout(() => el.classList.add('visible'), 80);
        }
    });
}

// ===================================
// SCROLL PARALLAX — subtle bg depth
// ===================================

function initScrollParallax() {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                // Subtle parallax: background moves at 30% of scroll speed
                const offset = Math.round(scrollY * 0.30);
                document.body.style.backgroundPositionY = `calc(top + ${offset}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}


// ===================================
// NAVIGATION SCROLL EFFECT
// ===================================

const navbar = document.getElementById('navbar'); // targets the .topbar header element
let lastScroll = 0;


window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// SCROLL SPY — active nav link tracks current section
// ===================================

(function () {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    function setActive(id) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href'); // e.g. "#about"
            if (href === '#' + id) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, {
        rootMargin: '-20% 0px -60% 0px', // trigger when section is in the upper 40% of viewport
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
})();



// ===================================
// PORTFOLIO INITIALIZATION (robust retry)
// Polls until portfolio items are ready, then attaches all listeners
// ===================================

function initPortfolio() {
    const filterButtons  = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioScroll = document.getElementById('portfolioScroll');
    const scrollLeftBtn  = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');

    // Retry until items are in the DOM
    if (portfolioItems.length === 0) {
        setTimeout(initPortfolio, 200);
        return;
    }

    console.log('✅ Portfolio init: found', portfolioItems.length, 'items');

    // ── Filter buttons with staggered entrance animation ──
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            let visibleIndex = 0;
            portfolioItems.forEach(item => {
                const client = item.getAttribute('data-client');
                const matches = filter === 'all' || client === filter;

                if (matches) {
                    item.style.display = '';
                    // Remove then re-add entering class to replay animation
                    item.classList.remove('entering');
                    const delay = visibleIndex * 70; // stagger 70ms per card
                    setTimeout(() => {
                        item.classList.add('entering');
                    }, delay);
                    visibleIndex++;
                } else {
                    item.style.display = 'none';
                }
            });

            if (portfolioScroll) portfolioScroll.scrollLeft = 0;
        });
    });

    // ── Scroll arrow buttons ──
    if (scrollLeftBtn && scrollRightBtn && portfolioScroll) {
        const SCROLL_AMOUNT = 450;

        scrollRightBtn.addEventListener('click', () => {
            portfolioScroll.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
        });

        scrollLeftBtn.addEventListener('click', () => {
            portfolioScroll.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
        });

        // Update arrow opacity based on scroll position
        function updateArrows() {
            const maxScroll = portfolioScroll.scrollWidth - portfolioScroll.clientWidth;
            scrollLeftBtn.style.opacity  = portfolioScroll.scrollLeft <= 0 ? '0.3' : '1';
            scrollRightBtn.style.opacity = portfolioScroll.scrollLeft >= maxScroll - 5 ? '0.3' : '1';
        }
        portfolioScroll.addEventListener('scroll', updateArrows);
        updateArrows();
    }

    // ── Lightbox ──
    initializeLightbox();
    console.log('✅ Portfolio initialization complete');
}

// Start polling as soon as DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initPortfolio, 300);
    initScrollReveal();
    initScrollParallax();
});



// ===================================
// LIGHTBOX FUNCTIONALITY
// ===================================

function initializeLightbox() {
    console.log('🔧 initializeLightbox() called');

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (!lightbox || portfolioItems.length === 0) {
        console.error('❌ Lightbox elements not found or no portfolio items');
        return;
    }

    let currentIndex = 0;

    console.log('✅ Lightbox initialized with', portfolioItems.length, 'items');

    // Open lightbox when clicking on portfolio items
    portfolioItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        const item = portfolioItems[currentIndex];
        const img = item.querySelector('img');
        const title = item.querySelector('.portfolio-title').textContent;
        const category = item.querySelector('.portfolio-category').textContent;

        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxTitle.textContent = title;
        lightboxCategory.textContent = category;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('📸 Lightbox opened for:', title);
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        console.log('❌ Lightbox closed');
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % portfolioItems.length;
        openLightbox();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + portfolioItems.length) % portfolioItems.length;
        openLightbox();
    }

    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNext);
    lightboxPrev.addEventListener('click', showPrev);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
}




// ===================================
// MOUSE PARALLAX EFFECT FOR HERO SHAPES
// ===================================

function initializeParallax() {
    const hero = document.querySelector('.hero');
    const shapes = document.querySelectorAll('.shape');

    if (!hero || shapes.length === 0) return;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    });

    function animate() {
        // Smooth easing
        targetX += (mouseX - targetX) * 0.1;
        targetY += (mouseY - targetY) * 0.1;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const x = targetX * speed;
            const y = targetY * speed;

            shape.style.transform = `translate(${x}px, ${y}px)`;
        });

        requestAnimationFrame(animate);
    }

    animate();
    console.log('✨ Parallax effect initialized');
}

// Initialize parallax on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeParallax);
} else {
    initializeParallax();
}

// ===================================
// NIGHT SKY STAR GENERATION
// ===================================

function generateStars() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;

    const numberOfStars = 150;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 70; // Keep stars in upper 70% of screen

        // Random size (1-3px)
        const size = Math.random() * 2 + 1;

        // Random twinkle duration (2-5s)
        const twinkleDuration = Math.random() * 3 + 2;

        // Random delay for stagger effect
        const delay = Math.random() * 5;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--twinkle-duration', `${twinkleDuration}s`);
        star.style.setProperty('--twinkle-delay', `${delay}s`);

        starsContainer.appendChild(star);
    }

    console.log(`✨ Generated ${numberOfStars} stars`);

    // Create shooting stars occasionally
    setInterval(createShootingStar, 8000);
}

function createShootingStar() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;

    // Only create shooting stars in dark mode
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme !== 'dark') return;

    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';

    // Random starting position (top right area)
    const x = Math.random() * 30 + 70; // 70-100%
    const y = Math.random() * 30; // 0-30%

    shootingStar.style.left = `${x}%`;
    shootingStar.style.top = `${y}%`;

    starsContainer.appendChild(shootingStar);

    // Remove after animation completes
    setTimeout(() => {
        shootingStar.remove();
    }, 3000);
}

// Initialize stars on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateStars);
} else {
    generateStars();
}
