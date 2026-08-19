# Component Map

## Overview
This document outlines the React component hierarchy mapped directly to the original HTML template markup blocks. 
**Golden Rule**: Componentization must NEVER alter the rendered HTML DOM structure or CSS selectors.

---

## 1. Global & Layout Components (`src/components/layout/`)

| Component Name | File Location | Original HTML Source Markup | Function / Responsibilities |
|---|---|---|---|
| `Preloader` | `src/components/layout/Preloader.jsx` | `<div class="preloader">...</div>` | Loading spinner overlay before page mount. |
| `CustomCursor` | `src/components/layout/CustomCursor.jsx` | `<div class="custom-cursor__cursor"></div>...` | Interactive animated custom cursor dot & ring. |
| `HeaderOne` | `src/components/layout/HeaderOne.jsx` | `<header class="main-header main-header-one ...">` | Primary header with topbar, logo, menu, call button. |
| `HeaderTwo` | `src/components/layout/HeaderTwo.jsx` | `<header class="main-header main-header-two ...">` | Home 2 header with unique top bar & button layout. |
| `HeaderThree` | `src/components/layout/HeaderThree.jsx` | `<header class="main-header main-header-three ...">` | Home 3 header with centered branding & dark accents. |
| `MobileNav` | `src/components/layout/MobileNav.jsx` | `<div class="mobile-nav__wrapper">...</div>` | Off-canvas sliding mobile navigation drawer. |
| `SearchPopup` | `src/components/layout/SearchPopup.jsx` | `<div class="search-popup">...</div>` | Fullscreen search modal overlay. |
| `FooterOne` | `src/components/layout/FooterOne.jsx` | `<footer class="site-footer">...</footer>` | Standard 4-column footer with newsletter & copyright. |
| `FooterTwo` | `src/components/layout/FooterTwo.jsx` | `<footer class="site-footer site-footer--two">` | Home 2 alternative dark footer layout. |
| `FooterThree` | `src/components/layout/FooterThree.jsx` | `<footer class="site-footer site-footer--three">` | Home 3 footer layout variation. |
| `ScrollToTop` | `src/components/layout/ScrollToTop.jsx` | `<a href="#" class="scroll-to-top">...</a>` | Sticky back-to-top button appearing on scroll. |

---

## 2. Common Reusable Components (`src/components/common/`)

| Component Name | File Location | Original HTML Source Markup | Function / Responsibilities |
|---|---|---|---|
| `PageHeader` | `src/components/common/PageHeader.jsx` | `<section class="page-header">...` | Sub-page banner background with dynamic breadcrumbs. |
| `SectionTitle` | `src/components/common/SectionTitle.jsx` | `<div class="section-title text-center">...` | Standard section tag + main heading + leaf graphic. |
| `SubscribeOne` | `src/components/common/SubscribeOne.jsx` | `<section class="subscribe-one">...` | Newsletter subscription box section. |
| `BrandOne` | `src/components/common/BrandOne.jsx` | `<section class="brand-one">...` | Client/partner logo carousel. |
| `CounterOne` | `src/components/common/CounterOne.jsx` | `<section class="counter-one">...` | Stat numbers grid with animated Odometer. |

---

## 3. Page Section Components

### Home Page Sections (`src/components/home/`)
- `MainSliderOne`: Hero slider carousel with image transitions and animated text.
- `MainSliderTwo`: Home 2 hero slider variation.
- `MainSliderThree`: Home 3 hero slider variation.
- `IntroOne`: 3-column service feature cards (`intro-one`).
- `IntroTwo`: Home 3 feature cards (`intro-two`).
- `ServicesOneSection`: 3-column service cards with icon & read more.
- `ServicesTwoSection`: Alternate service grid card layout.
- `WhyChooseOne`: Two-column feature showcase with background image & checkmarks.
- `CaseOneSection`: Portfolio / Case study card grid.
- `TherapyOneSection`: Specialty therapy tabs / cards.
- `TestimonialOneSection`: Testimonial slider carousel.
- `TeamOneSection`: 3-column psychologist profile cards.
- `BlogOneSection`: 3-column blog post cards.
- `AwardOneSection`: Recognition badges section.

### Service & Therapy Components (`src/components/services/`)
- `ServiceSidebar`: Left-hand navigation menu for service details pages.
- `ServiceDetailsContent`: Main content layout with benefit list, accordion, and callout box.

### Case Study Components (`src/components/cases/`)
- `CaseGrid`: Responsive 2-column or 3-column case card listing.
- `CaseDetailsContent`: Detailed case study breakdown with statistics and navigation.

### Shop & Cart Components (`src/components/shop/`)
- `ProductCard`: Single store product card with hover overlay & price.
- `ProductSidebar`: Category filter, search input, price range slider (noUiSlider).
- `CartTable`: Interactive shopping cart product list with quantity adjusters.
- `CheckoutForm`: Customer shipping/billing form with order summary.

---

## 4. DOM Hierarchy Preservation Guarantee
When constructing these components, JSX templates will directly mirror original HTML class names:
```jsx
// Exact DOM structure guarantee
<div className="services-one__single">
  <div className="services-one__single-img">
    <img src={imageSrc} alt={title} />
  </div>
  <div className="services-one__single-content">
    <h3 className="services-one__single-title">
      <Link to={link}>{title}</Link>
    </h3>
  </div>
</div>
```
