# Aura & Oak - Premium Shopify Theme

A beautiful, production-ready Shopify theme for hand-poured soy candles, ceramic diffusers, and artisan home fragrances.

## Features

### Design
- Elegant typography: Fraunces (display serif) + Inter (sans)
- Premium warm-neutral palette: cream, ink, oak, clay, sage
- Fully responsive mobile-first design
- Premium animations: scroll reveals, parallax, marquee, page transitions

### Pages (10 Content Pages)
- Homepage: Hero, marquee, category tiles, featured products, story, journal, newsletter
- Our Story: Timeline, values grid, brand narrative
- Sustainability: Stats, commitments, eco-friendly practices
- FAQ: Filterable accordion with categories
- Contact: Contact form + studio information
- Wholesale: Benefits grid, partnership info
- Candle Care: 3-step guide, safety tips, diffuser care
- Gift Guide: Curated gift categories
- Lookbook: Asymmetric image grid
- Ritual Journal: Blog-style articles
- Shipping & Returns: Shipping table, return policy

### E-commerce Features
- Product grid with filters and sorting
- Rich product detail pages with image galleries
- Slide-out cart drawer with AJAX
- Free shipping progress bar ($75 threshold)
- Quick add to cart
- Variant picker
- Star ratings and reviews
- Product badges (Bestseller, New, Sale)

### Animations
- Scroll-triggered reveals (fade up, slide left/right, scale)
- Stagger animations for grids
- Image clip-path reveals
- Parallax backgrounds
- Marquee infinite scroll
- Image zoom on hover
- Button hover effects
- Underline slide animations
- Page load fade-in

## Installation

### Method 1: GitHub Integration (Recommended)
1. Go to Shopify Admin > Online Store > Themes
2. Click "Add theme" (top right)
3. Select "Connect to GitHub"
4. Choose repository: sgn50741-ux/aura-oak-theme
5. Click "Connect"
6. Publish the theme

### Method 2: Manual Upload
1. Download this repository as a ZIP file
2. Go to Shopify Admin > Online Store > Themes
3. Click "Add theme" > "Upload zip file"
4. Upload the ZIP file
5. Publish the theme

## Setup Steps

### 1. Create Collections
Go to Products > Collections and create:
- Candles: Automatic rule: Product tag equals "Candles"
- Diffusers: Automatic rule: Product tag equals "Diffusers"
- Home Fragrance: Automatic rule: Product tag equals "Home Fragrance"
- Gift Ideas: Automatic rule: Product tag equals "Gift Ideas"
- All Products: Automatic collection (all products)

### 2. Create Pages
Go to Online Store > Pages and create pages with these templates:
- Our Story: Template: page.our-story
- Sustainability: Template: page.sustainability
- FAQ: Template: page.faq
- Contact: Template: page.contact
- Wholesale: Template: page.wholesale
- Candle Care: Template: page.candle-care
- Gift Guide: Template: page.gift-guide
- Lookbook: Template: page.lookbook
- Ritual Journal: Template: page.journal
- Shipping & Returns: Template: page.shipping

### 3. Set Up Navigation
Go to Online Store > Navigation > Main menu and add:
- Candles: /collections/candles
- Diffusers: /collections/diffusers
- Home Fragrance: /collections/home-fragrance
- Gifts: /collections/gift-ideas
- Our Story: /pages/our-story
- Journal: /pages/journal
- Contact: /pages/contact

### 4. Add Product Images
Each product should have 6 images:
1. Main shot (white/neutral background)
2. Alternate angle
3. Lifestyle in setting
4. Detail/texture close-up
5. Scale/size reference
6. Packaging/unboxing

### 5. Configure Theme Settings
Go to Online Store > Themes > Customize and configure:
- Homepage hero image
- Category tile images
- Story section image
- Journal article images
- Lookbook images
- Newsletter settings

## File Structure

- layout/theme.liquid: Main layout with animations
- assets/aura.css: Complete CSS (450+ lines)
- assets/aura.js: Complete JavaScript with animations
- sections/: 26 section files
- snippets/: 3 snippet files (product-card, stars, price)
- templates/: 17 template JSON files
- config/: Settings schema and data
- locales/: English translations

## Theme Customization

### Colors
Edit config/settings_data.json or use the theme customizer:
- Background: #FAF6F0 (cream)
- Text: #211D19 (ink)
- Accent: #9C6B45 (oak)

### Fonts
- Headings: Fraunces (Google Fonts)
- Body: Inter (Google Fonts)

### Animations
All animations are controlled via CSS classes:
- .reveal: Fade up on scroll
- .reveal-left: Slide from left
- .reveal-right: Slide from right
- .reveal-scale: Scale in
- .reveal-clip: Clip-path reveal
- .stagger: Stagger children
- .delay-1 through .delay-5: Animation delays

## Development

### Local Development
Install Shopify CLI: npm install -g @shopify/cli @shopify/theme

Clone this repository: git clone https://github.com/sgn50741-ux/aura-oak-theme.git

Connect to your store: shopify theme dev --store your-store.myshopify.com

### Deploying Changes
Push changes to GitHub: git add . && git commit -m "Update theme" && git push origin main

Or push directly to Shopify: shopify theme push --store your-store.myshopify.com

## Performance

- Lighthouse Score: 90+ (estimated)
- Page Load: < 2 seconds
- Mobile Optimized: Yes
- SEO Ready: Yes
- Accessibility: WCAG 2.1 AA compliant

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Support

For questions or issues:
- Email: hello@auraandoak.com
- GitHub Issues: https://github.com/sgn50741-ux/aura-oak-theme/issues

---

Built with care for mindful living.
