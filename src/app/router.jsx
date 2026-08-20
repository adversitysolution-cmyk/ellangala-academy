import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import HomeOne from '../pages/HomeOne';
import HomeTwo from '../pages/HomeTwo';
import HomeThree from '../pages/HomeThree';
import HomeBoxed from '../pages/HomeBoxed';
import About from '../pages/About';
import PositiveWorkshops from '../pages/PositiveWorkshops';
import PositiveMentoring from '../pages/PositiveMentoring';
import MindGymPage from '../pages/MindGymPage';
import PositiveMindGymAppPage from '../pages/PositiveMindGymAppPage';
import ServicesDetails from '../pages/ServicesDetails';
import PersonalCounselling from '../pages/PersonalCounselling';
import CoupleCounselling from '../pages/CoupleCounselling';
import ChildrenCounselling from '../pages/ChildrenCounselling';
import FamilyPsychology from '../pages/FamilyPsychology';
import DepressionTreatment from '../pages/DepressionTreatment';
import GroupTherapy from '../pages/GroupTherapy';
import CasesOne from '../pages/CasesOne';
import CasesTwo from '../pages/CasesTwo';
import CaseDetails from '../pages/CaseDetails';
import Team from '../pages/Team';
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
import DemoLanding from '../pages/DemoLanding';

import MobileNav from '../components/layout/MobileNav';
import { MobileNavProvider } from '../context/MobileNavContext';

function ScrollToTopOnRoute() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function AppRouter() {
  return (
    <Router>
      <MobileNavProvider>
        <ScrollToTopOnRoute />
        <MobileNav />
        <Routes>
        {/* Core Pages */}
        <Route path="/" element={<HomeOne />} />
        <Route path="/home-2" element={<HomeTwo />} />
        <Route path="/home-3" element={<HomeThree />} />
        <Route path="/home-boxed" element={<HomeBoxed />} />

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
        <Route path="/couple-counselling" element={<CoupleCounselling />} />
        <Route path="/children-counselling" element={<ChildrenCounselling />} />
        <Route path="/family-psychology" element={<FamilyPsychology />} />
        <Route path="/depression-treatment" element={<DepressionTreatment />} />
        <Route path="/group-theraphy" element={<GroupTherapy />} />

        <Route path="/cases" element={<CasesOne />} />
        <Route path="/cases-2" element={<CasesTwo />} />
        <Route path="/case-details" element={<CaseDetails />} />

        <Route path="/team" element={<Team />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog-details" element={<BlogDetails />} />
        <Route path="/blog-details/:id" element={<BlogDetails />} />

        <Route path="/shop" element={<Shop />} />
        <Route path="/resources" element={<Shop />} />
        <Route path="/shop-details" element={<ShopDetails />} />
        <Route path="/shop-details/:id" element={<ShopDetails />} />
        <Route path="/resources-details" element={<ShopDetails />} />
        <Route path="/resources-details/:id" element={<ShopDetails />} />
        <Route path="/resources/:id" element={<ShopDetails />} />
        <Route path="/shop/:id" element={<ShopDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/demo-landing" element={<DemoLanding />} />

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

        {/* 404 Catch All */}
        <Route path="/404" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      </MobileNavProvider>
    </Router>
  );
}
