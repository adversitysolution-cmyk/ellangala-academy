# Uterpy HTML Template Audit

## 1. Executive Summary

This document presents a comprehensive audit of the **Uterpy — Psychology & Counseling HTML Template** (UTC package 2026-01-07). The template is a high-end, responsive HTML5/CSS3 site designed for psychology clinics, therapists, mental health professionals, and counseling centers. 

The primary task is a **100% pixel-perfect and behavioral-fidelity migration** of this template to a modern **React 19 + Vite + React Router** SPA architecture without altering any visual design, color palettes, typography, spacing, dimensions, assets, plugins, or interactive behaviors.

---

## 2. Directory Structure Audit

The source HTML package is organized under `uterpy-html-package/uterpy-html/` with the following structure:

```text
uterpy-html/
├── assets/
│   ├── css/
│   │   ├── uterpy.css                  # Main theme styles (272 KB)
│   │   ├── uterpy-responsive.css       # Responsive breakpoints (45.9 KB)
│   │   └── uterpy-landing.css          # Demo landing page styles (14.2 KB)
│   ├── images/                         # 13 subdirectories with image assets
│   ├── inc/                            # Backend PHP email handler (sendemail.php)
│   ├── js/
│   │   ├── uterpy.js                   # Theme initialization & plugin orchestrator (40.3 KB)
│   │   └── uterpy-landing.js           # Demo landing initialization script (804 B)
│   └── vendors/                        # 33 third-party vendor libraries
└── [27 HTML files]                     # HTML pages listed in PAGE_INVENTORY.md
```

---

## 3. Global HTML DOM Architecture

Every main template page follows a standardized DOM container structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>[Page Title] || Uterpy || Uterpy HTML 5 Template</title>
    <!-- Favicons -->
    <!-- Google Fonts: Kumbh Sans, Playfair Display -->
    <!-- Vendor Stylesheets -->
    <!-- Main Template Stylesheets -->
</head>
<body class="custom-cursor">
    <!-- Custom Cursor Containers -->
    <div class="custom-cursor__cursor"></div>
    <div class="custom-cursor__cursor-two"></div>

    <!-- Preloader -->
    <div class="preloader">
        <div class="preloader__image"></div>
    </div>

    <!-- Page Wrapper -->
    <div class="page-wrapper">
        <!-- Main Header -->
        <header class="main-header ..."> ... </header>

        <!-- Page Specific Content / Sections -->
        <main> ... </main>

        <!-- Main Footer -->
        <footer class="site-footer ..."> ... </footer>
    </div>

    <!-- Mobile Nav Wrapper -->
    <div class="mobile-nav__wrapper"> ... </div>

    <!-- Search Popup Overlay -->
    <div class="search-popup"> ... </div>

    <!-- Scroll to Top Button -->
    <a href="#" data-target="html" class="scroll-to-target scroll-to-top"><i class="fa fa-angle-up"></i></a>

    <!-- Vendor Scripts -->
    <!-- Main Theme JS (uterpy.js) -->
</body>
</html>
```

---

## 4. CSS Architecture & Specificity

1. **`uterpy.css`**: Contains all custom component styles, header/footer themes, section layouts, card designs, hover effects, slider controls, and animations.
2. **`uterpy-responsive.css`**: Media queries targeting standard breakpoints (`1440px`, `1280px`, `1199px`, `991px`, `767px`, `575px`, `480px`, `375px`, `320px`).
3. **`uterpy-landing.css`**: Dedicated styles isolated for `demo-landing.html`.

### Specificity & Class Naming Conventions
The CSS heavily relies on BEM-like class naming conventions (e.g., `.services-one__single`, `.main-header-one__top-inner`, `.case-one__img-box`). React JSX elements MUST preserve these exact class names and nesting hierarchy to ensure styles cascade without breakages.

---

## 5. JavaScript & Plugin Ecosystem Audit

The template relies on jQuery 3.6.0 and 32 additional vendor scripts.

Key active plugins initialized in `uterpy.js`:
- **Owl Carousel & Swiper & BXSlider**: Hero sliders, testimonial carousels, team sliders, service carousels.
- **WOW.js & Animate.css**: Scroll-triggered animations via `data-wow-delay` and `data-wow-duration`.
- **Jarallax**: Parallax background images.
- **Magnific Popup**: Video popups, lightbox image galleries.
- **Odometer & jQuery Appear**: Animated numerical counters.
- **Isotope**: Portfolio/case filtering grids.
- **jQuery Circle Progress & CircleType**: Radial progress bars and curved titles.
- **noUiSlider**: Price range slider in shop pages.
- **Bootstrap Select**: Custom stylized select dropdowns.

---

## 6. Technical Migration Considerations for React 19

1. **Static Asset Public Directory**:
   All files from `assets/` must be copied to `public/assets/` without changing file names or folder paths. This guarantees relative image URLs in CSS (e.g., `background-image: url(../images/...)`) resolve correctly.

2. **React SPA Plugin Lifecycle Manager**:
   Because `uterpy.js` binds event handlers and initializes carousels on `$(document).ready()`, single-page app navigation in React Router will require an explicit `useUterpyPlugins()` hook to safely initialize, re-trigger, and clean up plugins on route transitions without creating memory leaks or duplicate instances.

3. **HTML Attributes to JSX Property Conversion**:
   - `class` → `className`
   - `for` → `htmlFor`
   - `tabindex` → `tabIndex`
   - `maxlength` → `maxLength`
   - `readonly` → `readOnly`
   - `autocomplete` → `autoComplete`
   - `data-*` attributes (`data-wow-delay`, `data-owl-options`, `data-background`) MUST BE PRESERVED EXACTLY.

4. **Zero Redesign / Strict Parity Mandate**:
   No elements, colors, fonts, margins, or padding may be altered. The generated DOM from React components must match the original template's DOM tree 1:1.
