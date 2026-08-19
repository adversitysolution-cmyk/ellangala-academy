import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import PageHeader from '../components/common/PageHeader';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { shopContent } from '../contents/shop.content';

const resourceCategories = [
  { id: 'books', label: 'Books', icon: 'fa fa-book' },
  { id: 'affirmation-cards', label: 'Affirmation Cards', icon: 'fa fa-layer-group' },
  { id: 'blogs', label: 'Blogs & Articles', icon: 'fa fa-newspaper' },
  { id: 'videos', label: 'Videos on Talks', icon: 'fa fa-video' },
  { id: 'meditation', label: 'Meditation & Music', icon: 'fa fa-spa' },
  { id: 'free-resources', label: 'Free Resources', icon: 'fa fa-gift' },
];

export default function Shop() {
  useUterpyPlugins();
  const { header, products } = shopContent.shop;
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const [activeCategory, setActiveCategory] = useState(
    tabParam && resourceCategories.some((c) => c.id === tabParam) ? tabParam : 'books'
  );

  useEffect(() => {
    if (tabParam && resourceCategories.some((c) => c.id === tabParam)) {
      setActiveCategory(tabParam);
    }
  }, [tabParam]);

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setSearchParams({ tab: catId });
  };

  const selectedCategoryObj = resourceCategories.find((c) => c.id === activeCategory);

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title={header.title} breadcrumb={header.breadcrumb} />

        {/* Start Resources Section */}
        <section className="shop-page" style={{ paddingTop: '50px', paddingBottom: '90px' }}>
          <div className="container">
            {/* Category Filter Horizontal Sharp-Edged Slab Navigation */}
            <div style={{ marginBottom: '35px' }}>
              <div
                className="shop-category-filter-bar"
                style={{
                  border: '1px solid #ECE7DE',
                  borderTop: '3px solid var(--uterpy-base, #CA8A38)',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
                  borderRadius: '6px'
                }}
              >
                {resourceCategories.map((cat, idx) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryClick(cat.id)}
                      aria-label={cat.label}
                      style={{
                        border: 'none',
                        borderRight: idx < resourceCategories.length - 1 ? '1px solid #ECE7DE' : 'none',
                        backgroundColor: isActive ? 'var(--uterpy-base, #CA8A38)' : '#ffffff',
                        color: isActive ? '#ffffff' : '#1F2937',
                        fontWeight: isActive ? '700' : '600',
                        letterSpacing: '0.4px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = '#FAF7F2';
                          e.currentTarget.style.color = 'var(--uterpy-base, #CA8A38)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.color = '#1F2937';
                        }
                      }}
                    >
                      <i
                        className={cat.icon}
                        style={{
                          fontSize: '15px',
                          color: isActive ? '#ffffff' : 'var(--uterpy-base, #CA8A38)',
                        }}
                      ></i>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Header & Books Catalog */}
            <div className="shop-page__top" style={{ marginBottom: '30px' }}>
              <div className="shop-page__top-inner">
                <div className="shop-page__top-left">
                  <p style={{ margin: 0, fontWeight: '600' }}>
                    Showing {products.length} of {products.length} {selectedCategoryObj ? selectedCategoryObj.label : 'Books'}
                  </p>
                </div>
                <div className="shop-page__top-right">
                  <div className="product__showing-sort">
                    <p style={{ margin: 0, fontWeight: '700', color: 'var(--uterpy-black, #021B41)' }}>
                      Author: Dr. Naveen Ellangala
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Books Grid */}
            <div className="row gy-4">
              {products.map((item, index) => (
                <div
                  key={index}
                  className="col-xl-4 col-lg-6 col-md-6 wow animated fadeInUp"
                  data-wow-delay={`${0.08 * ((index % 3) + 1)}s`}
                >
                  <div className="shop-page__single">
                    <div className="shop-page__single-img">
                      <img src={item.img} alt={item.alt || item.title} />
                      {item.sale && <div className="text">Sale</div>}
                    </div>
                    <div className="shop-page__single-content">
                      <div className="btn-box text-center">
                        <Link to={`/shop-details?id=${item.id}`}>Quick View</Link>
                      </div>
                      <div className="bottom-text">
                        <div className="text-box">
                          <h4>
                            <Link to={`/shop-details?id=${item.id}`}>{item.title}</Link>
                          </h4>
                          <p>{item.price}</p>
                        </div>
                        <div className="rating-box">
                          <ul>
                            <li><span className="icon-star2"></span></li>
                            <li><span className="icon-star2"></span></li>
                            <li><span className="icon-star2"></span></li>
                            <li><span className="icon-star2"></span></li>
                            <li><span className="icon-star3"></span></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* End Resources Section */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
