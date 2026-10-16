import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import HomeOne from '../pages/HomeOne';

// Secondary Public Pages (Lazy Loaded)
const About = React.lazy(() => import('../pages/About'));
const PositiveWorkshops = React.lazy(() => import('../pages/PositiveWorkshops'));
const PositiveMentoring = React.lazy(() => import('../pages/PositiveMentoring'));
const MindGymPage = React.lazy(() => import('../pages/MindGymPage'));
const PositiveMindGymAppPage = React.lazy(() => import('../pages/PositiveMindGymAppPage'));
const ServicesDetails = React.lazy(() => import('../pages/ServicesDetails'));
const FounderPage = React.lazy(() => import('../pages/FounderPage'));
const BlogList = React.lazy(() => import('../pages/BlogList'));
const BlogDetails = React.lazy(() => import('../pages/BlogDetails'));
const Shop = React.lazy(() => import('../pages/Shop'));
const ShopDetails = React.lazy(() => import('../pages/ShopDetails'));
const Cart = React.lazy(() => import('../pages/Cart'));
const Checkout = React.lazy(() => import('../pages/Checkout'));
const FAQ = React.lazy(() => import('../pages/FAQ'));
const Contact = React.lazy(() => import('../pages/Contact'));
const Error404 = React.lazy(() => import('../pages/Error404'));
const VideosOnTalksPage = React.lazy(() => import('../pages/VideosOnTalksPage'));
const MeditationMusicPage = React.lazy(() => import('../pages/MeditationMusicPage'));
const FreeResourcesPage = React.lazy(() => import('../pages/FreeResourcesPage'));
const TrackOrderPage = React.lazy(() => import('../pages/TrackOrderPage'));
const VerifyCertificate = React.lazy(() => import('../pages/VerifyCertificate'));

// Layout & Context
import MobileNav from '../components/layout/MobileNav';
import { MobileNavProvider } from '../context/MobileNavContext';
import { EnrollModalProvider } from '../context/EnrollModalContext';
import EnrollModal from '../components/common/EnrollModal';
import { CommunityAuthProvider } from '../features/community/context/CommunityAuthContext';
import CommunityAuthModal from '../features/community/components/CommunityAuthModal';

// Admin System Imports (Lazy Loaded)
import { AdminAuthProvider } from '../admin/context/AdminAuthContext';
import AdminProtectedRoute from '../admin/components/AdminProtectedRoute';
const AdminLoginPage = React.lazy(() => import('../admin/pages/AdminLoginPage'));
const AdminDashboardPage = React.lazy(() => import('../admin/pages/AdminDashboardPage'));
const AdminNotificationsPage = React.lazy(() => import('../admin/pages/AdminNotificationsPage'));
const AdminUsersPage = React.lazy(() => import('../admin/pages/AdminUsersPage'));
const EnrollmentListPage = React.lazy(() => import('../admin/pages/EnrollmentListPage'));
const EnrollmentDetailPage = React.lazy(() => import('../admin/pages/EnrollmentDetailPage'));
const OrderListPage = React.lazy(() => import('../admin/pages/OrderListPage'));
const OrderDetailPage = React.lazy(() => import('../admin/pages/OrderDetailPage'));

// Events Module Imports (Lazy Loaded)
const EventsPage = React.lazy(() => import('../features/events/pages/EventsPage'));
const EventDetailsPage = React.lazy(() => import('../features/events/pages/EventDetailsPage'));
const EventRegisterPage = React.lazy(() => import('../features/events/pages/EventRegisterPage'));

// Community Module Imports (Lazy Loaded)
const CommunityFeedPage = React.lazy(() => import('../features/community/pages/CommunityFeedPage'));
const EventListPage = React.lazy(() => import('../admin/pages/EventListPage'));
const EventCreatePage = React.lazy(() => import('../admin/pages/EventCreatePage'));
const EventEditPage = React.lazy(() => import('../admin/pages/EventEditPage'));
const EventRegistrationsPage = React.lazy(() => import('../admin/pages/EventRegistrationsPage'));
const EventCertificatesPage = React.lazy(() => import('../admin/pages/EventCertificatesPage'));
const CertificateImportPage = React.lazy(() => import('../admin/pages/CertificateImportPage'));
const CertificateBatchPage = React.lazy(() => import('../admin/pages/CertificateBatchPage'));
const CertificateTemplatesPage = React.lazy(() => import('../admin/pages/CertificateTemplatesPage'));

// Admin Blogs Module Imports (Lazy Loaded)
const BlogListPage = React.lazy(() => import('../admin/pages/BlogListPage'));
const BlogCreatePage = React.lazy(() => import('../admin/pages/BlogCreatePage'));
const BlogEditPage = React.lazy(() => import('../admin/pages/BlogEditPage'));

// Admin Community Module Imports (Lazy Loaded)
const CommunityAdminPage = React.lazy(() => import('../admin/pages/CommunityAdminPage'));
const CommunityPostCreatePage = React.lazy(() => import('../admin/pages/CommunityPostCreatePage'));
const CommunityPostEditPage = React.lazy(() => import('../admin/pages/CommunityPostEditPage'));

// Admin Products Module Imports (Lazy Loaded)
const ProductListPage = React.lazy(() => import('../admin/pages/ProductListPage'));
const CouponListPage = React.lazy(() => import('../admin/pages/CouponListPage'));
const ProductCreatePage = React.lazy(() => import('../admin/pages/ProductCreatePage'));
const ProductEditPage = React.lazy(() => import('../admin/pages/ProductEditPage'));

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
        <CommunityAuthProvider>
          <EnrollModalProvider>
            <MobileNavProvider>
              <ScrollToTopOnRoute />
              <MobileNav />
              <EnrollModal />
              <CommunityAuthModal />
              <React.Suspense fallback={null}>
                <Routes>
              {/* Core Public Pages */}
              <Route path="/" element={<HomeOne />} />

              <Route path="/about" element={<About />} />
              <Route path="/founder" element={<FounderPage />} />
              <Route path="/about/founder" element={<Navigate to="/founder" replace />} />
              <Route path="/dr-naveen-ellangala" element={<Navigate to="/founder" replace />} />
              <Route path="/mr-naveen-ellangala" element={<Navigate to="/founder" replace />} />
              <Route path="/naveen-ellangala" element={<Navigate to="/founder" replace />} />
              <Route path="/about/dr-naveen-ellangala" element={<Navigate to="/founder" replace />} />
              <Route path="/about/naveen-ellangala" element={<Navigate to="/founder" replace />} />
              <Route path="/our-team/mr-naveen-ellangala" element={<Navigate to="/founder" replace />} />
              <Route path="/our-team/dr-naveen-ellangala" element={<Navigate to="/founder" replace />} />
              <Route path="/our-team/naveen-ellangala" element={<Navigate to="/founder" replace />} />
              <Route path="/our-team/*" element={<Navigate to="/founder" replace />} />
              <Route path="/our-team" element={<Navigate to="/founder" replace />} />
              <Route path="/team/mr-naveen-ellangala" element={<Navigate to="/founder" replace />} />
              <Route path="/team/dr-naveen-ellangala" element={<Navigate to="/founder" replace />} />
              <Route path="/team/naveen-ellangala" element={<Navigate to="/founder" replace />} />
              <Route path="/positive-workshops" element={<PositiveWorkshops />} />
              <Route path="/workshops" element={<PositiveWorkshops />} />
              <Route path="/positive-mentoring" element={<PositiveMentoring />} />
              <Route path="/mentoring" element={<PositiveMentoring />} />
              <Route path="/1-on-1-mentoring" element={<PositiveMentoring />} />
              <Route path="/one-on-one-mentoring" element={<PositiveMentoring />} />
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

              {/* Public Feed Routes */}
              <Route path="/feed" element={<CommunityFeedPage />} />
              <Route path="/feed/saved" element={<CommunityFeedPage />} />
              <Route path="/feed/profile" element={<CommunityFeedPage />} />
              <Route path="/feed/posts/:id" element={<CommunityFeedPage />} />

              {/* Legacy /community URLs compatibility */}
              <Route path="/community" element={<Navigate to="/feed" replace />} />
              <Route path="/community/saved" element={<Navigate to="/feed/saved" replace />} />
              <Route path="/community/profile" element={<Navigate to="/feed/profile" replace />} />
              <Route path="/community/posts/:id" element={<CommunityFeedPage />} />

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
                path="/admin/notifications"
                element={
                  <AdminProtectedRoute>
                    <AdminNotificationsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminProtectedRoute>
                    <AdminUsersPage />
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

              {/* Admin Feed Routes */}
              <Route
                path="/admin/feed"
                element={
                  <AdminProtectedRoute>
                    <CommunityAdminPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/feed/new"
                element={
                  <AdminProtectedRoute>
                    <CommunityPostCreatePage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/feed/:id/edit"
                element={
                  <AdminProtectedRoute>
                    <CommunityPostEditPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/community"
                element={
                  <AdminProtectedRoute>
                    <Navigate to="/admin/feed" replace />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/community/new"
                element={
                  <AdminProtectedRoute>
                    <Navigate to="/admin/feed/new" replace />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/community/:id/edit"
                element={
                  <AdminProtectedRoute>
                    <CommunityPostEditPage />
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
          </React.Suspense>
          </MobileNavProvider>
        </EnrollModalProvider>
        </CommunityAuthProvider>
      </AdminAuthProvider>
    </Router>
  );
}
