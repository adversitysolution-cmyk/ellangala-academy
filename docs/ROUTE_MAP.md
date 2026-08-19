# Route Map

## Overview
This document defines the React Router v6/v7 routing configuration for all 27 pages in the Uterpy template, including legacy `.html` redirects to guarantee 100% link compatibility.

---

## Complete Route Configuration Table

| # | Original HTML Path | Target React Route | Target Page Component | Document Title (`<title>`) |
|---|---|---|---|---|
| 1 | `index.html` | `/` | `HomeOne` | Home One \|\| Uterpy \|\| Psychology & Counseling |
| 2 | `index-2.html` | `/home-2` | `HomeTwo` | Home Two \|\| Uterpy \|\| Psychology & Counseling |
| 3 | `index-3.html` | `/home-3` | `HomeThree` | Home Three \|\| Uterpy \|\| Psychology & Counseling |
| 4 | `index-boxed.html` | `/home-boxed` | `HomeBoxed` | Home Boxed \|\| Uterpy \|\| Psychology & Counseling |
| 5 | `about.html` | `/about` | `About` | About Us \|\| Uterpy \|\| Psychology & Counseling |
| 6 | `services-1.html` | `/services` | `ServicesOne` | Services One \|\| Uterpy \|\| Psychology & Counseling |
| 7 | `services-2.html` | `/services-2` | `ServicesTwo` | Services Two \|\| Uterpy \|\| Psychology & Counseling |
| 8 | `personal-counselling.html` | `/personal-counselling` | `PersonalCounselling` | Personal Counselling \|\| Uterpy |
| 9 | `couple-counselling.html` | `/couple-counselling` | `CoupleCounselling` | Couple Counselling \|\| Uterpy |
| 10 | `children-counselling.html` | `/children-counselling` | `ChildrenCounselling` | Children Counselling \|\| Uterpy |
| 11 | `family-psychology.html` | `/family-psychology` | `FamilyPsychology` | Family Psychology \|\| Uterpy |
| 12 | `depression-treatment.html` | `/depression-treatment` | `DepressionTreatment` | Depression Treatment \|\| Uterpy |
| 13 | `group-theraphy.html` | `/group-theraphy` | `GroupTherapy` | Group Therapy \|\| Uterpy |
| 14 | `case-1.html` | `/cases` | `CasesOne` | Cases One \|\| Uterpy \|\| Psychology & Counseling |
| 15 | `case-2.html` | `/cases-2` | `CasesTwo` | Cases Two \|\| Uterpy \|\| Psychology & Counseling |
| 16 | `case-details.html` | `/case-details` | `CaseDetails` | Case Details \|\| Uterpy \|\| Psychology & Counseling |
| 17 | `team.html` | `/team` | `Team` | Team \|\| Uterpy \|\| Psychology & Counseling |
| 18 | `blog-list.html` | `/blog` | `BlogList` | Blog List \|\| Uterpy \|\| Psychology & Counseling |
| 19 | `blog-details.html` | `/blog-details` | `BlogDetails` | Blog Details \|\| Uterpy \|\| Psychology & Counseling |
| 20 | `shop.html` | `/shop` | `Shop` | Shop \|\| Uterpy \|\| Psychology & Counseling |
| 21 | `shop-details.html` | `/shop-details` | `ShopDetails` | Shop Details \|\| Uterpy \|\| Psychology & Counseling |
| 22 | `cart.html` | `/cart` | `Cart` | Cart \|\| Uterpy \|\| Psychology & Counseling |
| 23 | `checkout.html` | `/checkout` | `Checkout` | Checkout \|\| Uterpy \|\| Psychology & Counseling |
| 24 | `faq.html` | `/faq` | `FAQ` | FAQ \|\| Uterpy \|\| Psychology & Counseling |
| 25 | `contact.html` | `/contact` | `Contact` | Contact \|\| Uterpy \|\| Psychology & Counseling |
| 26 | `error.html` | `/404` (and `*`) | `Error404` | 404 Error \|\| Uterpy \|\| Psychology & Counseling |
| 27 | `demo-landing.html` | `/demo-landing` | `DemoLanding` | Demo Landing \|\| Uterpy \|\| Psychology & Counseling |

---

## Legacy HTML URL Redirect Compatibility

To prevent broken links when users or external anchors request `.html` extensions directly, the React Router configuration includes explicit alias redirects:

```jsx
// Example legacy route redirects
<Route path="/index.html" element={<Navigate to="/" replace />} />
<Route path="/index-2.html" element={<Navigate to="/home-2" replace />} />
<Route path="/index-3.html" element={<Navigate to="/home-3" replace />} />
<Route path="/index-boxed.html" element={<Navigate to="/home-boxed" replace />} />
<Route path="/about.html" element={<Navigate to="/about" replace />} />
<Route path="/services-1.html" element={<Navigate to="/services" replace />} />
<Route path="/services-2.html" element={<Navigate to="/services-2" replace />} />
<Route path="/personal-counselling.html" element={<Navigate to="/personal-counselling" replace />} />
<Route path="/couple-counselling.html" element={<Navigate to="/couple-counselling" replace />} />
<Route path="/children-counselling.html" element={<Navigate to="/children-counselling" replace />} />
<Route path="/family-psychology.html" element={<Navigate to="/family-psychology" replace />} />
<Route path="/depression-treatment.html" element={<Navigate to="/depression-treatment" replace />} />
<Route path="/group-theraphy.html" element={<Navigate to="/group-theraphy" replace />} />
<Route path="/case-1.html" element={<Navigate to="/cases" replace />} />
<Route path="/case-2.html" element={<Navigate to="/cases-2" replace />} />
<Route path="/case-details.html" element={<Navigate to="/case-details" replace />} />
<Route path="/team.html" element={<Navigate to="/team" replace />} />
<Route path="/blog-list.html" element={<Navigate to="/blog" replace />} />
<Route path="/blog-details.html" element={<Navigate to="/blog-details" replace />} />
<Route path="/shop.html" element={<Navigate to="/shop" replace />} />
<Route path="/shop-details.html" element={<Navigate to="/shop-details" replace />} />
<Route path="/cart.html" element={<Navigate to="/cart" replace />} />
<Route path="/checkout.html" element={<Navigate to="/checkout" replace />} />
<Route path="/faq.html" element={<Navigate to="/faq" replace />} />
<Route path="/contact.html" element={<Navigate to="/contact" replace />} />
<Route path="/error.html" element={<Navigate to="/404" replace />} />
<Route path="/demo-landing.html" element={<Navigate to="/demo-landing" replace />} />
```

---

## Route Scroll Restoration Logic
React Router does not automatically scroll to the top of the viewport on route change. A dedicated `<ScrollToTopOnRoute />` component will listen to `useLocation()` and trigger `window.scrollTo(0, 0)` immediately on location change.
