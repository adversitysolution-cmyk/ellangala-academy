# Asset Inventory

## Overview
All static assets from `uterpy-html-package/uterpy-html/assets/` will be migrated directly into `public/assets/` without changing file names, directory trees, extensions, or formats.

---

## 1. CSS Assets Inventory

| Asset Path | File Size | Description & Usage |
|---|---|---|
| `assets/css/uterpy.css` | 272,771 bytes | Main global stylesheet containing all theme styles, color tokens, layout specifications, component styles, and keyframe animations. |
| `assets/css/uterpy-responsive.css` | 45,946 bytes | Responsive stylesheet containing media queries for desktop, tablet, and mobile breakpoints. |
| `assets/css/uterpy-landing.css` | 14,293 bytes | Dedicated stylesheet for `demo-landing.html`. |

---

## 2. JavaScript Assets Inventory

| Asset Path | File Size | Description & Usage |
|---|---|---|
| `assets/js/uterpy.js` | 40,384 bytes | Main script that initializes all jQuery plugins, sticky navigation, mobile menu toggles, search overlays, counters, carousels, accordions, and background images. |
| `assets/js/uterpy-landing.js` | 804 bytes | Script for the `demo-landing.html` interactive effects. |
| `assets/inc/sendemail.php` | N/A | PHP script handling backend mail submission (to be mocked/abstracted in React). |

---

## 3. Image Directories Inventory (`public/assets/images/`)

| Subdirectory | Content Summary & Asset Types |
|---|---|
| `assets/images/backgrounds/` | High-resolution background hero images, parallax section backdrops, pattern textures. |
| `assets/images/blog/` | Blog post thumbnails, blog detail featured images, author avatars. |
| `assets/images/brand/` | Partner / sponsor brand logos carousel images. |
| `assets/images/favicons/` | Favicon icons (`favicon-32x32.png`, `apple-touch-icon.png`, `site.webmanifest`). |
| `assets/images/icon/` | Custom vector SVG/PNG icons used in service cards and feature lists. |
| `assets/images/landing-page/` | Dedicated image assets for `demo-landing.html`. |
| `assets/images/main-slider/` | Hero slider background images, slide graphics, badge decorations. |
| `assets/images/page-header/` | Sub-page title banner background images (`page-header-bg.jpg`). |
| `assets/images/resources/` | Main site logos (`logo-1.png`, `logo-2.png`, `footer-logo.png`), core graphics, testimonial avatars, about section photos. |
| `assets/images/shapes/` | Decorative floating vectors, background leaf shapes, wavy lines, abstract blobs. |
| `assets/images/shop/` | E-commerce product images, gallery thumbnails, detail view images. |
| `assets/images/team/` | Psychologist/therapist team member portraits. |
| `assets/images/testimonial/` | Testimonial author profile pictures. |
| `assets/images/update-18-08-2023/` | Updated media assets and secondary section graphics. |

---

## 4. Fonts Audit

### Google Fonts (External CDNs)
- **Kumbh Sans**: Weights 200, 300, 400, 500, 600, 700, 800, 900.
- **Playfair Display**: Normal & Italic, Weights 400, 500, 600, 700, 800, 900.
- **DM Sans**, **Manrope**, **Outfit**: Used on the demo landing page.

### Icon Fonts & Local Custom Fonts (`assets/vendors/`)
- **FontAwesome**: `assets/vendors/fontawesome/` (`all.min.css`, webfonts).
- **Flaticon**: `assets/vendors/flaticon/` (`style.css`, webfonts).
- **Reey Font**: `assets/vendors/reey-font/` (`stylesheet.css`, custom handwriting font files).
- **Sayinistic Font**: `assets/vendors/the-sayinistic-font/` (`stylesheet.css`, custom accent script font files).

---

## 5. Asset Verification Checklist
- [x] All paths resolve relative to `/assets/` when served from Vite `public/` directory.
- [x] Zero image re-encoding or format conversion during migration.
- [x] Webfonts loaded in `index.html` or imported in React entry point `main.jsx`.
