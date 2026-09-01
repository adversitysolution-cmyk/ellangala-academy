import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import HomeOne from '../pages/HomeOne';
import About from '../pages/About';
import PositiveWorkshops from '../pages/PositiveWorkshops';
import PositiveMentoring from '../pages/PositiveMentoring';
import MindGymPage from '../pages/MindGymPage';
import PositiveMindGymAppPage from '../pages/PositiveMindGymAppPage';
import ServicesDetails from '../pages/ServicesDetails';
import FounderPage from '../pages/FounderPage';
import BlogList from '../pages/BlogList';
import BlogDetails from '../pages/BlogDetails';
import Shop from '../pages/Shop';
import ShopDetails from '../pages/ShopDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import FAQ from '../pages/FAQ';
import Contact from '../pages/Contact';
import Error404 from '../pages/Error404';
import VideosOnTalksPage from '../pages/VideosOnTalksPage';
import MeditationMusicPage from '../pages/MeditationMusicPage';
import FreeResourcesPage from '../pages/FreeResourcesPage';
import TrackOrderPage from '../pages/TrackOrderPage';
import VerifyCertificate from '../pages/VerifyCertificate';

// Layout & Context
import MobileNav from '../components/layout/MobileNav';
import { MobileNavProvider } from '../context/MobileNavContext';
import { EnrollModalProvider } from '../context/EnrollModalContext';
import EnrollModal from '../components/common/EnrollModal';

// Admin System Imports
import { AdminAuthProvider } from '../admin/context/AdminAuthContext';
import AdminProtectedRoute from '../admin/components/AdminProtectedRoute';
import AdminLoginPage from '../admin/pages/AdminLoginPage';
import AdminDashboardPage from '../admin/pages/AdminDashboardPage';
import EnrollmentListPage from '../admin/pages/EnrollmentListPage';
import EnrollmentDetailPage from '../admin/pages/EnrollmentDetailPage';
import OrderListPage from '../admin/pages/OrderListPage';
import OrderDetailPage from '../admin/pages/OrderDetailPage';

// Events Module Imports
import EventsPage from '../features/events/pages/EventsPage';
import EventDetailsPage from '../features/events/pages/EventDetailsPage';
import EventRegisterPage from '../features/events/pages/EventRegisterPage';
import EventListPage from '../admin/pages/EventListPage';
import EventCreatePage from '../admin/pages/EventCreatePage';
import EventEditPage from '../admin/pages/EventEditPage';
import EventRegistrationsPage from '../admin/pages/EventRegistrationsPage';
import EventCertificatesPage from '../admin/pages/EventCertificatesPage';
import CertificateImportPage from '../admin/pages/CertificateImportPage';
import CertificateBatchPage from '../admin/pages/CertificateBatchPage';
import CertificateTemplatesPage from '../admin/pages/CertificateTemplatesPage';

// Admin Blogs Module Imports
import BlogListPage from '../admin/pages/BlogListPage';
import BlogCreatePage from '../admin/pages/BlogCreatePage';
import BlogEditPage from '../admin/pages/BlogEditPage';

// Admin Products Module Imports
import ProductListPage from '../admin/pages/ProductListPage';
import CouponListPage from '../admin/pages/CouponListPage';
import ProductCreatePage from '../admin/pages/ProductCreatePage';
import ProductEditPage from '../admin/pages/ProductEditPage';

function ScrollToTopOnRoute() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const elem = document.querySelector(hash);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function AppRouter() {
  return (
    <Router>
      <AdminAuthProvider>
        <EnrollModalProvider>
          <MobileNavProvider>
            <ScrollToTopOnRoute />
            <MobileNav />
            <EnrollModal />
            <Routes>
              {/* Core Public Pages */}
              <Route path="/" element={<HomeOne />} />

              <Route path="/about" element={<About />} />
              <Route path="/founder" element={<FounderPage />} />
              <Route path="/about/founder" element={<FounderPage />} />
              <Route path="/dr-naveen-ellangala" element={<FounderPage />} />
              <Route path="/positive-workshops" element={<PositiveWorkshops />} />
              <Route path="/workshops" element={<PositiveWorkshops />} />
              <Route path="/positive-mentoring" element={<PositiveMentoring />} />
              <Route path="/mentoring" element={<PositiveMentoring />} />
              <Route path="/mindgym" element={<MindGymPage />} />
              <Route path="/mind-gym-programs" element={<MindGymPage />} />
              <Route path="/mindgym/app" element={<PositiveMindGymAppPage />} />
              <Route path="/services-details" element={<ServicesDetails />} />
              <Route path="/service-details" element={<ServicesDetails />} />
              <Route path="/services/:slug" element={<ServicesDetails />} />
              <Route path="/programs/:slug" element={<ServicesDetails />} />
              <Route path="/mentoring/:slug" element={<ServicesDetails />} />
              <Route path="/mindgym/:slug" element={<ServicesDetails />} />
              <Route path="/personal-counselling" element={<ServicesDetails />} />

              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/insights" element={<BlogList />} />
              <Route path="/blog-details" element={<BlogDetails />} />
              <Route path="/blog-details/:id" element={<BlogDetails />} />
              <Route path="/insights/:slug" element={<BlogDetails />} />

              <Route path="/shop" element={<Shop />} />
              <Route path="/resources" element={<Shop />} />
              <Route path="/resources/videos" element={<VideosOnTalksPage />} />
              <Route path="/videos" element={<VideosOnTalksPage />} />
              <Route path="/resources/meditation" element={<MeditationMusicPage />} />
              <Route path="/meditation" element={<MeditationMusicPage />} />
              <Route path="/resources/free-downloads" element={<FreeResourcesPage />} />
              <Route path="/free-resources" element={<FreeResourcesPage />} />
              <Route path="/shop-details" element={<ShopDetails />} />
              <Route path="/shop-details/:id" element={<ShopDetails />} />
              <Route path="/resources-details" element={<ShopDetails />} />
              <Route path="/resources-details/:id" element={<ShopDetails />} />
              <Route path="/resources/:id" element={<ShopDetails />} />
              <Route path="/shop/:id" element={<ShopDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/track-order" element={<TrackOrderPage />} />

              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />

              {/* Public Events Module Routes */}
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:slug" element={<EventDetailsPage />} />
              <Route path="/events/:slug/register" element={<EventRegisterPage />} />

              {/* Public Certificate Verification */}
              <Route path="/verify-certificate" element={<VerifyCertificate />} />
              <Route path="/verify/c/:token" element={<VerifyCertificate />} />

              {/* Admin Portal Routes */}
              <Route path="/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboardPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/enrollments"
                element={
                  <AdminProtectedRoute>
                    <EnrollmentListPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/enrollments/:id"
                element={
                  <AdminProtectedRoute>
                    <EnrollmentDetailPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminProtectedRoute>
                    <OrderListPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/orders/:id"
                element={
                  <AdminProtectedRoute>
                    <OrderDetailPage />
                  </AdminProtectedRoute>
                }
              />

              {/* Admin Events Routes */}
              <Route
                path="/admin/events"
                element={
                  <AdminProtectedRoute>
                    <EventListPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/events/new"
                element={
                  <AdminProtectedRoute>
                    <EventCreatePage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:id"
                element={
                  <AdminProtectedRoute>
                    <EventEditPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:id/edit"
                element={
                  <AdminProtectedRoute>
                    <EventEditPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:id/registrations"
                element={
                  <AdminProtectedRoute>
                    <EventRegistrationsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:id/certificates"
                element={
                  <AdminProtectedRoute>
                    <EventCertificatesPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:id/certificates/import"
                element={
                  <AdminProtectedRoute>
                    <CertificateImportPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:id/certificates/batches/:batchId"
                element={
                  <AdminProtectedRoute>
                    <CertificateBatchPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/certificate-templates"
                element={
                  <AdminProtectedRoute>
                    <CertificateTemplatesPage />
                  </AdminProtectedRoute>
                }
              />

              {/* Admin Blogs Routes */}
              <Route
                path="/admin/blogs"
                element={
                  <AdminProtectedRoute>
                    <BlogListPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/blogs/new"
                element={
                  <AdminProtectedRoute>
                    <BlogCreatePage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/blogs/:id"
                element={
                  <AdminProtectedRoute>
                    <BlogEditPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/blogs/:id/edit"
                element={
                  <AdminProtectedRoute>
                    <BlogEditPage />
                  </AdminProtectedRoute>
                }
              />

              {/* Admin Products Routes */}
              <Route
                path="/admin/products"
                element={
                  <AdminProtectedRoute>
                    <ProductListPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/products/new"
                element={
                  <AdminProtectedRoute>
                    <ProductCreatePage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/products/:id/edit"
                element={
                  <AdminProtectedRoute>
                    <ProductEditPage />
                  </AdminProtectedRoute>
                }
              />

              {/* Admin Coupons Route */}
              <Route
                path="/admin/coupons"
                element={
                  <AdminProtectedRoute>
                    <CouponListPage />
                  </AdminProtectedRoute>
                }
              />

              {/* Legacy HTML Alias Redirects */}
              <Route path="/index.html" element={<Navigate to="/" replace />} />
              <Route path="/index-2.html" element={<Navigate to="/home-2" replace />} />
              <Route path="/index-3.html" element={<Navigate to="/home-3" replace />} />
              <Route path="/index-boxed.html" element={<Navigate to="/home-boxed" replace />} />
              <Route path="/about.html" element={<Navigate to="/about" replace />} />
              <Route path="/services-1.html" element={<Navigate to="/services" replace />} />
              <Route path="/services-2.html" element={<Navigate to="/services-2" replace />} />
              <Route path="/services-details.html" element={<Navigate to="/services-details" replace />} />
              <Route path="/service-details.html" element={<Navigate to="/services-details" replace />} />
              <Route path="/personal-counselling.html" element={<Navigate to="/services-details" replace />} />
              <Route path="/couple-counselling.html" element={<Navigate to="/couple-counselling" replace />} />
              <Route path="/children-counselling.html" element={<Navigate to="/children-counselling" replace />} />
              <Route path="/family-psychology.html" element={<Navigate to="/family-psychology" replace />} />
              <Route path="/depression-treatment.html" element={<Navigate to="/depression-treatment" replace />} />
              <Route path="/group-theraphy.html" element={<Navigate to="/group-theraphy" replace />} />
              <Route path="/case-1.html" element={<Navigate to="/cases" replace />} />
              <Route path="/case-2.html" element={<Navigate to="/cases-2" replace />} />
              <Route path="/case-details.html" element={<Navigate to="/case-details" replace />} />
              <Route path="/team.html" element={<Navigate to="/team" replace />} />
              <Route path="/founder.html" element={<Navigate to="/founder" replace />} />
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

              {/* 404 Fallback */}
              <Route path="*" element={<Error404 />} />
            </Routes>
          </MobileNavProvider>
        </EnrollModalProvider>
      </AdminAuthProvider>
    </Router>
  );
}
