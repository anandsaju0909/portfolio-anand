# Anand Saju - Graphic Designer Portfolio

A modern, responsive portfolio website showcasing graphic design work with dynamic filtering and smooth animations.

## Features

- 🎨 **Dynamic Portfolio Loading** - Portfolio items loaded from client-specific folders
- 🔍 **Client Filtering** - Filter work by client (Marriott, Swiggy, or view all)
- 🌓 **Dark/Light Mode** - Toggle between themes with persistent preference
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- ✨ **Smooth Animations** - Elegant transitions and hover effects
- 🖼️ **Lightbox Gallery** - Click images to view in full-screen lightbox
- ⬅️➡️ **Scroll Navigation** - Navigate portfolio with arrow buttons

## Tech Stack

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- No frameworks or dependencies

## Project Structure

```
portfolio/
├── index.html              # Main HTML file
├── styles.css              # All styles and themes
├── script.js               # Main JavaScript functionality
├── portfolio-loader.js     # Dynamic portfolio loading
├── assets/
│   └── posters/
│       ├── marriot/        # Marriott client work
│       └── swiggy/         # Swiggy client work
└── README.md
```

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Serve locally**
   
   Using Python:
   ```bash
   python3 -m http.server 8080
   ```
   
   Or using any other local server of your choice.

3. **Open in browser**
   ```
   http://localhost:8080
   ```

## Adding New Portfolio Items

1. Create a new folder in `assets/posters/` with the client name
2. Add images to that folder
3. Update `portfolio-loader.js` with the new client data:

```javascript
const portfolioData = {
    clientname: [
        { filename: 'image.jpg', title: 'Project Title', category: 'Category' },
        // Add more items...
    ]
};
```

4. Add a filter button in `index.html`:

```html
<button class="filter-btn" data-filter="clientname">Client Name</button>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2026 Anand Saju. All rights reserved.

## Contact

For inquiries, please contact through the portfolio website.
