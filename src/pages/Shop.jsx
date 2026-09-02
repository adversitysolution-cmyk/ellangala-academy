import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
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
import { productService } from '../admin/services/productService';
import SEO from '../seo/SEO';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '../seo/schemas/schemaGenerators';

const resourceCategories = [
  {
    id: 'books',
    label: 'Books',
    subtitle: 'Physical Workbooks',
    img: '/assets/images/books/Bhagavadgeetha for Meaningful Life.png'
  },
  {
    id: 'affirmation-cards',
    label: 'Affirmation Cards',
    subtitle: 'Daily Mind Decks',
    img: '/assets/images/books/affirmation cards.jpeg'
  }
];

export const resolveProductImg = (item) => {
  if (!item) return '/assets/images/books/Bhagavadgeetha for Meaningful Life.png';
  if (item.image && typeof item.image === 'string' && item.image.trim()) return item.image;
  if (item.img && typeof item.img === 'string' && item.img.trim()) return item.img;
  const match = shopContent.shop.products.find(
    (p) => p.id === item.id || (p.title && item.title && p.title.toLowerCase() === item.title.toLowerCase())
  );
  if (match) return match.image || match.img;
  return '/assets/images/books/Bhagavadgeetha for Meaningful Life.png';
};

export default function Shop() {
  useUterpyPlugins();
  const { header } = shopContent.shop;
  const [products, setProducts] = useState(shopContent.shop.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    productService
      .getPublishedProducts()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setProducts(res);
        } else {
          setProducts(shopContent.shop.products);
        }
      })
      .catch(() => {
        setProducts(shopContent.shop.products);
      });
  }, []);

  const tabParam = searchParams.get('tab');
  const [activeCategory, setActiveCategory] = useState(
    tabParam && resourceCategories.some((c) => c.id === tabParam) ? tabParam : 'books'
  );

  useEffect(() => {
    if (tabParam === 'blogs' || tabParam === 'blog') {
      navigate('/blog', { replace: true });
    } else if (tabParam && resourceCategories.some((c) => c.id === tabParam)) {
      setActiveCategory(tabParam);
    }
  }, [tabParam, navigate]);

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setSearchParams({ tab: catId });
  };

  const selectedCategoryObj = resourceCategories.find((c) => c.id === activeCategory);

  const filteredProducts = products.filter((item) => {
    if (activeCategory === 'affirmation-cards') {
      return item.category === 'AFFIRMATION CARDS' || item.type === 'Affirmation Cards';
    }
    return item.category !== 'AFFIRMATION CARDS';
  });

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO
          title="Books & Mind Publications | Ellangala’s Academy"
          description="Explore mind training workbooks, positive psychology publications, Bhagavad Gita guides, and affirmation decks by Dr. Naveen Ellangala."
          canonical="/shop"
          structuredData={[
            generateOrganizationSchema(),
            generateBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Books & Resources', path: '/shop' }
            ])
          ]}
        />
        <HeaderOne />
        <PageHeader title={header.title} breadcrumb={header.breadcrumb} />

        {/* Start Resources Section */}
        <section className="shop-page" style={{ paddingTop: '50px', paddingBottom: '90px' }}>
          <div className="container">
            {/* Circular Image Category Filter Options */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', marginBottom: '45px', flexWrap: 'wrap' }}>
              {resourceCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const count = products.filter((p) =>
                  cat.id === 'affirmation-cards' ? p.category === 'AFFIRMATION CARDS' : p.category !== 'AFFIRMATION CARDS'
                ).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      outline: 'none',
                      transition: 'transform 0.25s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    {/* Circular Image Container */}
                    <div
                      style={{
                        width: '110px',
                        height: '110px',
                        borderRadius: '50%',
                        padding: '4px',
                        backgroundColor: '#ffffff',
                        border: isActive ? '3.5px solid var(--uterpy-base, #CA8A38)' : '2px solid #E2E8F0',
                        boxShadow: isActive
                          ? '0 0 0 5px rgba(202, 138, 56, 0.25), 0 10px 25px rgba(202, 138, 56, 0.2)'
                          : '0 4px 14px rgba(0,0,0,0.06)',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                    >
                      <img
                        src={cat.img}
                        alt={cat.label}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          transform: isActive ? 'scale(1.05)' : 'scale(1)',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                      {isActive && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#CA8A38',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                          }}
                        >
                          <i className="fa fa-check"></i>
                        </div>
                      )}
                    </div>

                    {/* Labels */}
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: '800',
                          color: isActive ? 'var(--uterpy-base, #CA8A38)' : '#0F231B',
                          letterSpacing: '0.6px',
                          textTransform: 'uppercase',
                          transition: 'color 0.2s ease'
                        }}
                      >
                        {cat.label}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', marginTop: '2px' }}>
                        ({count} products)
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Category Header & Author Details */}
            <div className="shop-page__top" style={{ marginBottom: '30px' }}>
              <div className="shop-page__top-inner">
                <div className="shop-page__top-left">
                  <p style={{ margin: 0, fontWeight: '600' }}>
                    Showing {filteredProducts.length} of {filteredProducts.length} {selectedCategoryObj ? selectedCategoryObj.label : 'Products'}
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

            {/* Products Grid */}
            <div className="row gy-4">
              {filteredProducts.map((item, index) => (
                <div
                  key={index}
                  className="col-xl-4 col-lg-6 col-md-6 wow animated fadeInUp"
                  data-wow-delay={`${0.08 * ((index % 3) + 1)}s`}
                >
                  <div className="shop-page__single">
                    <div className="shop-page__single-img">
                      <img
                        src={resolveProductImg(item)}
                        alt={item.alt || item.title}
                        onError={(e) => {
                          const match = shopContent.shop.products.find(
                            (p) => p.id === item.id || (p.title && item.title && p.title.toLowerCase() === item.title.toLowerCase())
                          );
                          if (match && (match.image || match.img) && e.currentTarget.src !== (match.image || match.img)) {
                            e.currentTarget.src = match.image || match.img;
                          }
                        }}
                      />
                      {(item.inStock === false || (item.stock != null && Number(item.stock) <= 0)) ? (
                        <div className="text" style={{ backgroundColor: '#64748B' }}>Out of Stock</div>
                      ) : (
                        item.sale && <div className="text">Sale</div>
                      )}
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
                          {item.inStock === false ? (
                            <p style={{ color: '#dc2626', fontWeight: '600', fontSize: '14px' }}>Currently Out of Stock</p>
                          ) : (
                            <p>
                              {item.price}{' '}
                              {item.originalPrice && item.originalPrice !== item.price && (
                                <del style={{ color: '#94a3b8', fontSize: '13px', marginLeft: '4px' }}>{item.originalPrice}</del>
                              )}
                            </p>
                          )}
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
