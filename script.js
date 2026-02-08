// ===================================
// DARK MODE TOGGLE
// ===================================

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ===================================
// NAVIGATION SCROLL EFFECT
// ===================================

const navbar = document.getElementById('navbar');
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
// PORTFOLIO SCROLL NAVIGATION
// ===================================

function initializeScrollNavigation() {
    console.log('🔧 initializeScrollNavigation() called');

    const portfolioScroll = document.getElementById('portfolioScroll');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');

    if (portfolioScroll && scrollLeftBtn && scrollRightBtn) {
        const scrollAmount = 450;

        scrollLeftBtn.addEventListener('click', () => {
            portfolioScroll.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        scrollRightBtn.addEventListener('click', () => {
            portfolioScroll.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        function updateArrows() {
            const scrollLeft = portfolioScroll.scrollLeft;
            const maxScroll = portfolioScroll.scrollWidth - portfolioScroll.clientWidth;

            scrollLeftBtn.style.opacity = scrollLeft <= 0 ? '0.3' : '1';
            scrollLeftBtn.style.pointerEvents = scrollLeft <= 0 ? 'none' : 'auto';

            scrollRightBtn.style.opacity = scrollLeft >= maxScroll - 5 ? '0.3' : '1';
            scrollRightBtn.style.pointerEvents = scrollLeft >= maxScroll - 5 ? 'none' : 'auto';
        }

        portfolioScroll.addEventListener('scroll', updateArrows);
        updateArrows();
        console.log('✅ Scroll navigation initialized');
    }
}

// Initialize after portfolio loads
window.addEventListener('portfolioLoaded', initializeScrollNavigation);

// ===================================
// PORTFOLIO FILTER FUNCTIONALITY
// ===================================

function initializeFilters() {
    console.log('🔧 initializeFilters() called');

    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItemsForFilter = document.querySelectorAll('.portfolio-item');
    const portfolioScroll = document.getElementById('portfolioScroll');

    console.log('🔍 Filter buttons found:', filterButtons.length);
    console.log('🔍 Portfolio items found:', portfolioItemsForFilter.length);

    if (filterButtons.length === 0) {
        console.error('❌ No filter buttons found!');
        return;
    }

    if (portfolioItemsForFilter.length === 0) {
        console.error('❌ No portfolio items found! Filters not initialized.');
        return;
    }

    filterButtons.forEach((button, index) => {
        console.log(`✅ Attaching click listener to button ${index}:`, button.getAttribute('data-filter'));

        button.addEventListener('click', function () {
            console.log('🖱️ Filter button clicked:', this.getAttribute('data-filter'));

            const filterValue = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            console.log('✅ Active button updated to:', filterValue);

            // Filter portfolio items
            let visibleCount = 0;
            let hiddenCount = 0;

            portfolioItemsForFilter.forEach(item => {
                const itemClient = item.getAttribute('data-client');

                if (filterValue === 'all' || itemClient === filterValue) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                    visibleCount++;
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                    hiddenCount++;
                }
            });

            console.log(`📊 Filtered: ${visibleCount} visible, ${hiddenCount} hidden`);

            // Reset scroll position
            if (portfolioScroll) {
                portfolioScroll.scrollLeft = 0;
            }
        });
    });

    console.log('✅ All filter event listeners attached!');
}

// Initialize after portfolio loads
console.log('📝 Registering portfolioLoaded event listener');
window.addEventListener('portfolioLoaded', function () {
    console.log('🎉 portfolioLoaded event received!');
    initializeFilters();
});

// Also initialize filters on DOM ready as fallback
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 DOM loaded, waiting for portfolio items...');
    setTimeout(() => {
        const items = document.querySelectorAll('.portfolio-item');
        console.log(`⏳ Checking for portfolio items: found ${items.length}`);
        if (items.length > 0) {
            console.log('✅ Portfolio items exist, initializing filters');
            initializeFilters();
            initializeScrollNavigation();
        } else {
            console.log('⚠️ No portfolio items yet, will wait for portfolioLoaded event');
        }
    }, 1000);
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

// Initialize lightbox after portfolio loads
console.log('📝 Registering portfolioLoaded event listener for lightbox');
window.addEventListener('portfolioLoaded', function() {
    console.log('🎉 portfolioLoaded event received! Initializing lightbox...');
    initializeLightbox();
});
