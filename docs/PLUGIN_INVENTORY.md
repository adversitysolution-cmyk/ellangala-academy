# Plugin Inventory

## Overview
The Uterpy HTML template relies on **33 vendor plugins and libraries** located in `assets/vendors/`. To preserve 100% behavioral fidelity, all vendor libraries will be integrated into the React 19 application using a lifecycle management strategy.

---

## Complete Vendor Plugin Inventory

| # | Vendor Directory | Plugin Name | Purpose / Function in Template | Target Execution Layer |
|---|---|---|---|---|
| 1 | `jquery` | jQuery v3.6.0 | Core DOM manipulation and plugin baseline dependency. | Global window script (`window.jQuery`, `window.$`) |
| 2 | `bootstrap` | Bootstrap 5 | CSS Grid layout (`col-*`, `row`, `container`), modal utility. | Stylesheet + JS Bundle |
| 3 | `bootstrap-select` | Bootstrap Select | Stylized custom select dropdown menus (`selectpicker`). | jQuery plugin wrapper |
| 4 | `owl-carousel` | Owl Carousel | Main hero slider, services, team, testimonial, brand carousels. | jQuery plugin wrapper |
| 5 | `swiper` | Swiper Slider | Secondary slider/carousel instances. | Native / Window script |
| 6 | `bxslider` | BxSlider | Product thumbnail sliders & detail views. | jQuery plugin wrapper |
| 7 | `tiny-slider` | Tiny Slider | Compact lightweight carousel instances. | JS plugin wrapper |
| 8 | `slick` | Slick Slider | Product carousels & secondary hero sliders. | jQuery plugin wrapper |
| 9 | `wow` | WOW.js | Triggers Animate.css on scroll. | Window script (`new WOW().init()`) |
| 10 | `animate` | Animate.css | CSS keyframe entrance animations (`fadeInUp`, `zoomIn`). | Vendor CSS |
| 11 | `isotope` | Isotope | Portfolio / Case filterable grid layout. | jQuery plugin wrapper |
| 12 | `jarallax` | Jarallax | Parallax background scroll effects (`data-jarallax`). | jQuery / Window script |
| 13 | `jquery-magnific-popup` | Magnific Popup | Lightbox video modals and image galleries (`.img-popup`). | jQuery plugin wrapper |
| 14 | `odometer` | Odometer | Animated numerical counter displays on scroll. | Window script |
| 15 | `jquery-appear` | jQuery Appear | Triggers events when elements scroll into view. | jQuery plugin wrapper |
| 16 | `jquery-circle-progress` | Circle Progress | SVG radial progress bar rendering (`.circle-progress`). | jQuery plugin wrapper |
| 17 | `nouislider` | noUiSlider | Price range slider control in shop page. | Window script |
| 18 | `wnumb` | wNumb | Number formatting for noUiSlider. | Window script |
| 19 | `vegas` | Vegas Background | Fullscreen background image slider. | jQuery plugin wrapper |
| 20 | `jquery-ui` | jQuery UI | Datepicker, slider, accordions. | jQuery plugin wrapper |
| 21 | `timepicker` | TimePicker | Time selection input control for booking forms. | jQuery plugin wrapper |
| 22 | `touch-spin` | TouchSpin | Quantity step incrementor input (`+`, `-`) in cart/shop. | jQuery plugin wrapper |
| 23 | `countdown` | Countdown.js | Event countdown timer widget. | jQuery plugin wrapper |
| 24 | `jquery-ajaxchimp` | AjaxChimp | MailChimp newsletter form integration. | jQuery plugin wrapper |
| 25 | `jquery-validate` | jQuery Validate | Form validation rules for contact and appointment forms. | jQuery plugin wrapper |
| 26 | `circleType` | CircleType.js | Curved circular text rendering (`.curved-circle`). | jQuery plugin wrapper |
| 27 | `lettering` | Lettering.js | Typography letter wrapping for CircleType. | jQuery plugin wrapper |
| 28 | `polyglot-language-switcher` | Polyglot Switcher | Multilingual selector menu in header. | jQuery plugin wrapper |
| 29 | `typed-2.0.11` | Typed.js | Animated typewriter text effect. | Window script |
| 30 | `fontawesome` | FontAwesome 5 | Icon font library (`fa`, `fas`, `fab`). | Vendor CSS + Webfonts |
| 31 | `flaticon` | Flaticon | Custom vector icon font library (`icon-*`). | Vendor CSS + Webfonts |
| 32 | `reey-font` | Reey Font | Custom handwriting accent webfont. | Vendor CSS + Webfonts |
| 33 | `the-sayinistic-font` | Sayinistic Font | Custom decorative accent webfont. | Vendor CSS + Webfonts |

---

## Strategy for React SPA Integration

### 1. Script Loading Sequence (`index.html`)
In order for legacy plugins to operate properly in Vite without scope errors:
1. `jquery-3.6.0.min.js` MUST load first into `window.jQuery` and `window.$`.
2. Core utilities (`bootstrap.bundle.min.js`, `jarallax.min.js`, `isotope.js`, etc.) load next.
3. Plugin orchestrator logic will be managed inside a React hook `useUterpyPlugins.js`.

### 2. Route Transition & Re-Initialization Lifecycle (`useUterpyPlugins.js`)
When navigating between pages in React Router:
- **Mount phase**: Wait for DOM nodes to attach (`useEffect`). Trigger `initializeUterpyPlugins()`.
- **Carousel Protection**: Destroy previous Owl Carousel / Swiper instances before binding new ones to avoid duplicating slide nodes or event listeners.
- **Scroll Position & WOW.js**: Re-run `new WOW().init()` on route change so entrance animations trigger smoothly.
- **Cleanup phase**: Detach window scroll listeners, unbind mobile nav event handlers, destroy active popups.
