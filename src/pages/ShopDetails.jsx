import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
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
import { useCart } from '../context/CartContext';
import SEO from '../seo/SEO';
import { generateBookSchema, generateBreadcrumbSchema } from '../seo/schemas/schemaGenerators';

export default function ShopDetails() {
  useUterpyPlugins();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);
  const [searchParams] = useSearchParams();
  const { id: paramId } = useParams();

  const bookId = paramId || searchParams.get('id');

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fallbackList = shopContent.shop.products;
    
    Promise.all([
      bookId ? productService.getProductById(bookId).catch(() => null) : Promise.resolve(null),
      productService.getPublishedProducts().catch(() => [])
    ]).then(([fetchedProduct, allProducts]) => {
      const combinedAll = Array.isArray(allProducts) && allProducts.length > 0 ? allProducts : fallbackList;
      const resolved =
        fetchedProduct ||
        combinedAll.find((p) => p.id === bookId || String(p.id).toLowerCase() === String(bookId).toLowerCase()) ||
        fallbackList.find((p) => p.id === bookId || String(p.id).toLowerCase() === String(bookId).toLowerCase()) ||
        combinedAll[0] ||
        fallbackList[0] ||
        null;
        
      setProduct(resolved);
      if (resolved) {
        const related = combinedAll
          .filter((p) => p.id !== resolved.id)
          .slice(0, 3);
        setRelatedProducts(related);
      } else {
        setRelatedProducts([]);
      }
      setLoading(false);
    }).catch(() => {
      const resolved =
        fallbackList.find((p) => p.id === bookId || String(p.id).toLowerCase() === String(bookId).toLowerCase()) ||
        fallbackList[0] ||
        null;
      setProduct(resolved);
      if (resolved) {
        setRelatedProducts(fallbackList.filter((p) => p.id !== resolved.id).slice(0, 3));
      }
      setLoading(false);
    });
  }, [bookId]);

  const outOfStock = product && product.stock != null && Number(product.stock) <= 0;

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <>
        <CustomCursor />
        <Preloader />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <CustomCursor />
        <Preloader />
        <div className="page-wrapper">
          <HeaderOne />
          <PageHeader title="Product Not Found" pageName="Shop Details" />
          <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <h2>Product Not Found</h2>
            <p style={{ color: '#64748B', margin: '16px 0 24px' }}>The product you are looking for could not be found.</p>
            <Link to="/shop" className="thm-btn">Back to Shop</Link>
          </div>
          <FooterOne />
        </div>
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO
          title={`${product.title} | Ellangala’s Academy`}
          description={product.description || `Read and order ${product.title} by Dr. Naveen Ellangala.`}
          canonical={`/shop/${product.id}`}
          image={product.image}
          type="product"
          structuredData={[
            generateBookSchema(product),
            generateBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Books', path: '/shop' },
              { name: product.title, path: `/shop/${product.id}` }
            ])
          ]}
        />
        <HeaderOne />
        <PageHeader title={product.title} pageName="Shop Details" />

        {/* Start Shop Details */}
        <section className="shop-details">
          <div className="container">
            <div className="row">
              {/* Start Shop Details Img Box */}
              <div className="col-xl-6">
                <div className="shop-details__img-box">
                  <div className="shop-details__img-box-inner">
                    {/* Main Book Image Display */}
                    <div className="shop-details__img-box-img">
                      <div className="swiper-container" id="shop-details-one__carousel">
                        <div className="swiper-wrapper">
                          <div className="swiper-slide">
                            <div className="img-box">
                              <img
                                src={product.image || product.img}
                                alt={product.alt || product.title}
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  display: 'block',
                                  borderRadius: '30px',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End Shop Details Img Box */}

              {/* Start Shop Details Content */}
              <div className="col-xl-6">
                <div className="shop-details__content">
                  <div className="title">
                    <h2>{product.title}</h2>
                  </div>

                  <div className="shop-details__content-text1">
                    {(product.inStock === false || (product.stock != null && Number(product.stock) <= 0)) ? (
                      <h3 style={{ color: '#dc2626' }}>
                        <span className="text2" style={{ color: '#dc2626', fontWeight: '700', fontSize: '18px' }}>
                          (Currently Out of Stock)
                        </span>
                      </h3>
                    ) : (
                      <h3>
                        {product.price}{' '}
                        {product.originalPrice && product.originalPrice !== product.price && (
                          <del>{product.originalPrice}</del>
                        )}{' '}
                        {product.discount && <span className="text">{product.discount}</span>}{' '}
                        <span className="text2">(In stock)</span>
                      </h3>
                    )}
                  </div>

                  <div className="shop-details__review">
                    <ul>
                      <li><span className="fa fa-star"></span></li>
                      <li><span className="fa fa-star"></span></li>
                      <li><span className="fa fa-star"></span></li>
                      <li><span className="fa fa-star"></span></li>
                      <li><span className="fa fa-star"></span></li>
                      <li>
                        <p>(5 Customer Review)</p>
                      </li>
                    </ul>
                  </div>

                  <div className="shop-details__content-text2">
                    <p>{product.description}</p>

                    <ul>
                      {product.highlights &&
                        product.highlights.map((feat, idx) => (
                          <li key={idx}>
                            <p>
                              <span className="icon-tick"></span> {feat}
                            </p>
                          </li>
                        ))}
                    </ul>
                  </div>

                  {(product.inStock === false || (product.stock != null && Number(product.stock) <= 0)) ? (
                    <div className="shop-details__content-text3">
                      <div className="inner" style={{ marginTop: '15px' }}>
                        <div className="btn-box">
                          <button
                            type="button"
                            disabled
                            style={{
                              backgroundColor: '#94a3b8',
                              color: '#ffffff',
                              border: 'none',
                              padding: '13px 32px',
                              fontWeight: '700',
                              cursor: 'not-allowed',
                              fontSize: '15px',
                              borderRadius: '0px'
                            }}
                          >
                            Currently Out of Stock
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="shop-details__content-text3">
                      <div className="title">
                        <p>Quantity</p>
                      </div>
                      <div className="inner">
                        <div className="product-quantity">
                          <div
                            className="product-quantity-box"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '142px',
                              height: '56px',
                              backgroundColor: '#f8f8f8',
                              border: '1px solid #e2e2e2',
                              borderRadius: '4px',
                              padding: '0 8px'
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e8e8e8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#333333',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                transition: 'all 0.2s ease',
                                padding: 0
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                              title="Decrease quantity"
                            >
                              <i className="fa fa-angle-down" style={{ fontSize: '16px', fontWeight: 'bold' }}></i>
                            </button>

                            <span
                              style={{
                                fontSize: '17px',
                                fontWeight: '600',
                                color: 'var(--uterpy-black)',
                                minWidth: '32px',
                                textAlign: 'center',
                                userSelect: 'none'
                              }}
                            >
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => setQuantity((q) => q + 1)}
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e8e8e8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#333333',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                transition: 'all 0.2s ease',
                                padding: 0
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                              title="Increase quantity"
                            >
                              <i className="fa fa-angle-up" style={{ fontSize: '16px', fontWeight: 'bold' }}></i>
                            </button>
                          </div>
                        </div>

                        <div className="btn-box">
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart();
                            }}
                          >
                            Add to Cart
                          </a>
                        </div>

                        <div
                          className="icon-box"
                          onClick={() => setIsWishlisted(!isWishlisted)}
                          style={{ cursor: 'pointer' }}
                          title="Add to Wishlist"
                        >
                          <span
                            className={isWishlisted ? 'fas fa-heart' : 'icon-heart'}
                            style={{ color: isWishlisted ? '#f42647' : 'inherit' }}
                          ></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="shop-details__content-text4">
                    <ul>
                      <li>
                        <div className="text">
                          <p>
                            <i className="icon-tick"></i> <span>Estimated Delivery:</span> 3–5 business days across India
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="text">
                          <p>
                            <i className="icon-tick"></i> <span>Free Shipping:</span> On all prepaid orders above ₹499
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Social links (hidden as requested, easy to re-enable in future)
                  <div className="shop-details__content-social-links">
                    <div className="title">
                      <h4>Share:</h4>
                    </div>
                    <ul>
                      <li>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                          <span className="fab fa-facebook"></span>
                        </a>
                      </li>
                      <li>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                          <span className="icon-linkedin"></span>
                        </a>
                      </li>
                      <li>
                        <a href="https://pinterest.com" target="_blank" rel="noreferrer">
                          <span className="fab fa-pinterest-p"></span>
                        </a>
                      </li>
                      <li>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">
                          <span className="fab fa-instagram"></span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  */}
                </div>
              </div>
              {/* End Shop Details Content */}
            </div>

            {/* Shop Details Tab (hidden as requested, easy to re-enable in future)
            <div className="row">
              <div className="col-xl-12">
                <div className="shop-details__tab tabs-box">
                  <div className="shop-details__tab-button">
                    <ul className="tab-buttons clearfix">
                      <li
                        className={`tab-btn ${activeTab === 'description' ? 'active-btn' : ''}`}
                        onClick={() => setActiveTab('description')}
                        style={{ cursor: 'pointer' }}
                      >
                        <h4>Description</h4>
                      </li>
                      <li
                        className={`tab-btn ${activeTab === 'specifications' ? 'active-btn' : ''}`}
                        onClick={() => setActiveTab('specifications')}
                        style={{ cursor: 'pointer' }}
                      >
                        <h4>Specifications</h4>
                      </li>
                      <li
                        className={`tab-btn ${activeTab === 'reviews' ? 'active-btn' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                        style={{ cursor: 'pointer' }}
                      >
                        <h4>Reviews (1)</h4>
                      </li>
                    </ul>
                  </div>

                  <div className="tabs-content">
                    {activeTab === 'description' && (
                      <div className="tab active-tab" id="description">
                        <div className="shop-details__tab-content-item">
                          <div className="shop-details__tab-description text-center">
                            <div className="text-box1">
                              <p>{product.description}</p>
                            </div>
                            <div className="text-box2">
                              <p>
                                Authored by Dr. Naveen Ellangala, this workbook offers practical psychological insights,
                                reflective exercises, and actionable guidance to nurture positive mental health, clarity,
                                and meaningful living for readers and learners.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'specifications' && (
                      <div className="tab active-tab" id="specifications">
                        <div className="shop-details__tab-content-item">
                          <div className="shop-details__tab-specifications">
                            <table className="table table-bordered" style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'left' }}>
                              <tbody>
                                <tr>
                                  <th style={{ width: '220px', backgroundColor: '#faf8f5' }}>Category</th>
                                  <td>{product.category || 'Books & Workbooks'}</td>
                                </tr>
                                <tr>
                                  <th style={{ backgroundColor: '#faf8f5' }}>Author</th>
                                  <td>{product.author || 'Dr. Naveen Ellangala'}</td>
                                </tr>
                                <tr>
                                  <th style={{ backgroundColor: '#faf8f5' }}>Language</th>
                                  <td>{product.language || 'English / Kannada'}</td>
                                </tr>
                                <tr>
                                  <th style={{ backgroundColor: '#faf8f5' }}>Type</th>
                                  <td>{product.type || 'Workbook / Guide'}</td>
                                </tr>
                                <tr>
                                  <th style={{ backgroundColor: '#faf8f5' }}>Theme</th>
                                  <td>{product.theme || 'Positive Psychology · Mind Training · Self-Care'}</td>
                                </tr>
                                <tr>
                                  <th style={{ backgroundColor: '#faf8f5' }}>Publisher</th>
                                  <td>Ellangala's Academy</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'reviews' && (
                      <div className="tab active-tab" id="reviews">
                        <div className="shop-details__tab-content-item style2">
                          <div className="shop-details__tab-reviews">
                            <div className="review-box-outer">
                              <div className="row">
                                <div className="col-xl-6 col-lg-6">
                                  <div className="single-review-box-outer">
                                    <div className="single-review-box">
                                      <div className="img-box">
                                        <img src="/assets/images/resources/review-img1.jpg" alt="#" />
                                      </div>
                                      <div className="text-box">
                                        <div className="review-box">
                                          <ul>
                                            <li><i className="icon-star2"></i></li>
                                            <li><i className="icon-star2"></i></li>
                                            <li><i className="icon-star2"></i></li>
                                            <li><i className="icon-star2"></i></li>
                                            <li><i className="icon-star2"></i></li>
                                          </ul>
                                        </div>
                                        <h3>Sourav Ahamed, <span>12 Aug 2026</span></h3>
                                        <p>
                                          Extremely insightful and practical. The exercises helped me gain emotional clarity
                                          and build positive daily habits. Highly recommended!
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-xl-6 col-lg-6">
                                  <div className="single-review-box-outer">
                                    <div className="single-review-box">
                                      <div className="img-box">
                                        <img src="/assets/images/resources/review-img2.jpg" alt="#" />
                                      </div>
                                      <div className="text-box">
                                        <div className="review-box">
                                          <ul>
                                            <li><i className="icon-star2"></i></li>
                                            <li><i className="icon-star2"></i></li>
                                            <li><i className="icon-star2"></i></li>
                                            <li><i className="icon-star2"></i></li>
                                            <li><i className="icon-star2"></i></li>
                                          </ul>
                                        </div>
                                        <h3>Dr. Priya Sharma, <span>05 Aug 2026</span></h3>
                                        <p>
                                          A wonderful synthesis of ancient wisdom and modern psychology. Simple, deep, and
                                          transformative for personal growth.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="review-form text-right-rtl">
                              <div className="title-box">
                                <h2>Add Your Comments</h2>
                              </div>
                              <form id="review-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="input-box">
                                      <div className="field-label">Comments</div>
                                      <textarea name="fcomments" placeholder="Write your review here..." required></textarea>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-4">
                                    <div className="input-box">
                                      <div className="field-label">Name*</div>
                                      <input type="text" name="fname" placeholder="Your name" required />
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <div className="input-box">
                                      <div className="field-label">Email*</div>
                                      <input type="email" name="femail" placeholder="Your email" required />
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <div className="input-box">
                                      <div className="field-label">Website</div>
                                      <input type="text" name="fwebsite" placeholder="Website URL" />
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-xl-12">
                                    <div className="add-rating-box">
                                      <div className="add-rating-title">
                                        <p>Your Rating</p>
                                      </div>
                                      <div className="review-box">
                                        <ul>
                                          <li><i className="icon-star2"></i></li>
                                          <li><i className="icon-star2"></i></li>
                                          <li><i className="icon-star2"></i></li>
                                          <li><i className="icon-star2"></i></li>
                                          <li><i className="icon-star2"></i></li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-xl-12">
                                    <div className="button-box">
                                      <div className="left">
                                        <button className="thm-btn" type="submit">
                                          Submit
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            */}
          </div>
        </section>
        {/* End Shop Details */}

        {/* Start Related Products */}
        <section className="shop-page shop-page--shop-details" style={{ paddingTop: '30px' }}>
          <div className="container">
            <div className="title-box">
              <h2>Related Products</h2>
            </div>
            <div className="row">
              {relatedProducts.map((item, idx) => (
                <div key={idx} className="col-xl-4 col-lg-6 col-md-6 wow animated fadeInUp" data-wow-delay={`${0.1 * (idx + 1)}s`}>
                  <div className="shop-page__single">
                    <div className="shop-page__single-img">
                      <img src={item.image || item.img} alt={item.alt || item.title} />
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
        {/* End Related Products */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
