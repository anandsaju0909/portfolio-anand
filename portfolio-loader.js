// ===================================
// DYNAMIC PORTFOLIO LOADER
// ===================================

// Portfolio data from client folders
const portfolioData = {
    marriot: [
        { filename: 'Artboard onam.jpg', title: 'Onam Celebration', category: 'Event Design' },
        { filename: 'beer friendship day.jpg', title: 'Friendship Day', category: 'Promotional' },
        { filename: 'box 2.jpg', title: 'Packaging Design 2', category: 'Packaging' },
        { filename: 'box.jpg', title: 'Packaging Design', category: 'Packaging' },
        { filename: 'hoarding 2.jpg', title: 'Hoarding Design 2', category: 'Outdoor' },
        { filename: 'hoarding.jpg', title: 'Hoarding Design', category: 'Outdoor' },
        { filename: 'onam news paper add.jpg', title: 'Onam Newspaper Ad', category: 'Print' },
        { filename: 'phantom.jpg', title: 'Phantom', category: 'Branding' },
        { filename: 'image.png', title: 'Marriott Design 1', category: 'Branding' },
        { filename: 'image copy.png', title: 'Marriott Design 2', category: 'Branding' },
        { filename: 'image copy 2.png', title: 'Marriott Design 3', category: 'Branding' }
    ],
    swiggy: [
        { filename: 'Artboard 1.jpg', title: 'Packaging Designing', category: 'Packaging' },
        { filename: 'Artboard 2.png', title: 'Packaging Designing', category: 'Packaging' },
        { filename: 'Untitled-1.jpg', title: 'Packaging Designing', category: 'Packaging' },
        { filename: 'WhatsApp Image 2026-02-05 at 11.16.07 AM.jpeg', title: 'Packaging Designing', category: 'Packaging' },
        { filename: 'rice mockup.jpg', title: 'Packaging Designing', category: 'Packaging' }
    ],
    melam: [
        { filename: 'image.png', title: 'Melam Design 1', category: 'Cultural' },
        { filename: 'image copy.png', title: 'Melam Design 2', category: 'Cultural' },
        { filename: 'image copy 2.png', title: 'Melam Design 3', category: 'Cultural' },
        { filename: 'image copy 3.png', title: 'Melam Design 4', category: 'Cultural' },
        { filename: 'image copy 4.png', title: 'Melam Design 5', category: 'Cultural' }
    ]
};

// Load portfolio items on page load
function loadPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) {
        console.error('Portfolio grid not found!');
        return;
    }

    portfolioGrid.innerHTML = ''; // Clear existing items

    // Loop through each client
    Object.keys(portfolioData).forEach(client => {
        const items = portfolioData[client];

        items.forEach(item => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.setAttribute('data-client', client);

            portfolioItem.innerHTML = `
                <div class="portfolio-image">
                    <img src="assets/posters/${client}/${item.filename}" 
                         alt="${item.title}"
                         loading="lazy">
                    <div class="portfolio-overlay">
                        <h3 class="portfolio-title">${item.title}</h3>
                        <p class="portfolio-category">${item.category}</p>
                    </div>
                </div>
            `;

            portfolioGrid.appendChild(portfolioItem);
        });
    });

    console.log('✅ Portfolio loaded:', portfolioGrid.children.length, 'items');

    // Dispatch event after a small delay to ensure DOM is ready
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('portfolioLoaded'));
        console.log('✅ portfolioLoaded event dispatched');
    }, 100);
}

// Load on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPortfolio);
} else {
    loadPortfolio();
}
