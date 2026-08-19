# Migration Plan

## Overview
This document lays out the step-by-step master plan for converting the **Uterpy HTML Template** into a fully functional, pixel-perfect **React 19 + Vite + React Router** application.

---

## Migration Phases

### PHASE 0 — Baseline & Audit (COMPLETED)
- [x] Extract and examine template files.
- [x] Audit HTML structure, CSS rules, JS plugins, images, and webfonts.
- [x] Generate required documentation files in `docs/`:
  - `HTML_TEMPLATE_AUDIT.md`
  - `PAGE_INVENTORY.md`
  - `ASSET_INVENTORY.md`
  - `PLUGIN_INVENTORY.md`
  - `COMPONENT_MAP.md`
  - `ROUTE_MAP.md`
  - `MIGRATION_PLAN.md`
  - `REACT_MIGRATION_TRACKER.md`

---

### PHASE 1 — React Foundation Setup
- [ ] Initialize Vite + React 19 project structure.
- [ ] Install dependencies: `react`, `react-dom`, `react-router-dom`, `react-helmet-async`.
- [ ] Copy `assets/` directory directly to `public/assets/`.
- [ ] Setup `index.html` entry point loading all Google Fonts, vendor CSS, theme CSS (`uterpy.css`, `uterpy-responsive.css`), jQuery, and vendor JS libraries in correct sequence.

---

### PHASE 2 — Global Layout & Shell Components
- [ ] Build global layout wrapper (`src/components/layout/`):
  - `HeaderOne`, `HeaderTwo`, `HeaderThree`
  - `FooterOne`, `FooterTwo`, `FooterThree`
  - `MobileNav` with toggle state and overlay
  - `SearchPopup` with search overlay
  - `Preloader`
  - `CustomCursor`
  - `ScrollToTop`
- [ ] Create `useUterpyPlugins.js` hook to handle jQuery/Owl Carousel/WOW.js/Odometer initialization and lifecycle cleanup across React Router page transitions.

---

### PHASE 3 — Home Page One Migration (`index.html`)
- [ ] Convert `index.html` markup into `src/pages/HomeOne.jsx` and modular section components.
- [ ] Validate sliders, WOW animations, hover states, mobile navigation, and stats counter.
- [ ] Verify desktop and mobile visual parity against original `index.html`.

---

### PHASE 4 — Home Variations Migration
- [ ] Convert `index-2.html` → `HomeTwo.jsx`.
- [ ] Convert `index-3.html` → `HomeThree.jsx`.
- [ ] Convert `index-boxed.html` → `HomeBoxed.jsx`.

---

### PHASE 5 — Core Pages Migration
- [ ] Convert `about.html` → `About.jsx`.
- [ ] Convert `team.html` → `Team.jsx`.
- [ ] Convert `faq.html` → `FAQ.jsx`.
- [ ] Convert `contact.html` → `Contact.jsx` (with form state & email service abstraction).
- [ ] Convert `error.html` → `Error404.jsx`.

---

### PHASE 6 — Services & Therapy Pages Migration
- [ ] Convert `services-1.html` → `ServicesOne.jsx`.
- [ ] Convert `services-2.html` → `ServicesTwo.jsx`.
- [ ] Convert 6 detail pages:
  - `personal-counselling.html`
  - `couple-counselling.html`
  - `children-counselling.html`
  - `family-psychology.html`
  - `depression-treatment.html`
  - `group-theraphy.html`

---

### PHASE 7 — Case Studies Migration
- [ ] Convert `case-1.html` → `CasesOne.jsx`.
- [ ] Convert `case-2.html` → `CasesTwo.jsx`.
- [ ] Convert `case-details.html` → `CaseDetails.jsx`.

---

### PHASE 8 — Blog System Migration
- [ ] Convert `blog-list.html` → `BlogList.jsx`.
- [ ] Convert `blog-details.html` → `BlogDetails.jsx`.

---

### PHASE 9 — Shop & E-Commerce Migration
- [ ] Convert `shop.html` → `Shop.jsx` (with noUiSlider price filter integration).
- [ ] Convert `shop-details.html` → `ShopDetails.jsx` (product gallery slider, quantity controls).
- [ ] Convert `cart.html` → `Cart.jsx`.
- [ ] Convert `checkout.html` → `Checkout.jsx`.

---

### PHASE 10 — Demo Landing Page Migration
- [ ] Convert `demo-landing.html` → `DemoLanding.jsx` (including `uterpy-landing.css` and `uterpy-landing.js` integration).

---

### PHASE 11 — Plugin Hardening & Route Transition QA
- [ ] Audit all 27 pages for memory leaks, broken scripts, duplicate event listeners, or slider rendering bugs on rapid navigation.

---

### PHASE 12 — Visual & Responsive Regression Verification
- [ ] Perform full-page visual regression checks at 1920px, 1440px, 1024px, 768px, and 390px viewports.

---

### PHASE 13 — Final Audit & Deliverables
- [ ] Run `npm run build` to verify production compilation without errors.
- [ ] Verify browser console clean (0 uncaught errors, 0 broken 404 asset requests).
- [ ] Generate final `FINAL_REACT_MIGRATION_REPORT.md`.
