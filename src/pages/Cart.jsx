import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import PageHeader from '../components/common/PageHeader';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { useCart } from '../context/CartContext';
import SEO from '../seo/SEO';

export default function Cart() {
  useUterpyPlugins();
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    couponCode,
    discountPercent,
    discountAmount,
    couponError,
    couponSuccess,
    applyCoupon,
    removeCoupon,
    shippingLocation,
    updateShipping,
    subtotal,
    shipping,
    total
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedState, setSelectedState] = useState(shippingLocation.state);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    applyCoupon(inputCoupon);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    const rate = selectedState === 'Karnataka' ? 50 : selectedState === 'International' ? 350 : 80;
    updateShipping(selectedState, selectedState === 'International' ? 'Worldwide' : 'India', rate);
    setShowAddressModal(false);
  };

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO title="Shopping Cart | Ellangala’s Academy" noindex={true} />
        <HeaderOne />
        <PageHeader title="Cart" pageName="Cart" />

        {/* Cart Page Start */}
        <section className="cart-page">
          <div className="container">
            <div className="row">
              {/* Left Column: Cart Table & Coupon */}
              <div className="col-xl-8 col-lg-7">
                <div className="cart-page__left">
                  {/* Desktop Table View (Hidden on mobile < 576px) */}
                  <div className="table-responsive d-none d-sm-block">
                    <table className="table cart-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems && cartItems.length > 0 ? (
                          cartItems.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <div className="product-box">
                                  <div className="img-box">
                                    <div className="inner">
                                      <img
                                        src={item.img}
                                        alt={item.title}
                                        style={{ width: '85px', height: '95px', objectFit: 'contain', backgroundColor: '#f9f9f9', padding: '4px' }}
                                      />
                                    </div>
                                    <div
                                      className="product-box-croos-icon"
                                      onClick={() => removeFromCart(item.id)}
                                      style={{ cursor: 'pointer' }}
                                      title="Remove item"
                                    >
                                      <i className="fas fa-times"></i>
                                    </div>
                                  </div>
                                  <h3>
                                    <Link to={item.link || `/shop-details?id=${item.id}`}>
                                      {item.title}
                                    </Link>
                                  </h3>
                                </div>
                              </td>
                              <td>
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
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                                      {item.quantity}
                                    </span>

                                    <button
                                      type="button"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                              </td>
                              <td>₹{item.price}.00</td>
                              <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))
                        ) : null}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked Cards (Visible only on < 576px) */}
                  <div className="cart-mobile-card-list d-block d-sm-none">
                    {cartItems && cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div key={item.id} className="cart-mobile-card">
                          <div className="cart-mobile-card__header">
                            <img src={item.img} alt={item.title} />
                            <h4 className="cart-mobile-card__title">
                              <Link to={item.link || `/shop-details?id=${item.id}`}>
                                {item.title}
                              </Link>
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Remove item"
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                border: '1px solid #ECE7DE',
                                backgroundColor: '#FAF8F5',
                                color: '#f42647',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                flexShrink: 0
                              }}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>

                          <div className="cart-mobile-card__row">
                            <span>Unit Price:</span>
                            <strong>₹{item.price}.00</strong>
                          </div>

                          <div className="cart-mobile-card__row">
                            <span>Quantity:</span>
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                backgroundColor: '#FAF8F5',
                                border: '1px solid #ECE7DE',
                                borderRadius: '6px',
                                padding: '4px 8px'
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #e0e0e0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: '#333'
                                }}
                              >
                                <i className="fa fa-minus" style={{ fontSize: '11px' }}></i>
                              </button>
                              <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #e0e0e0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: '#333'
                                }}
                              >
                                <i className="fa fa-plus" style={{ fontSize: '11px' }}></i>
                              </button>
                            </div>
                          </div>

                          <div className="cart-mobile-card__row" style={{ paddingTop: '8px', borderTop: '1px dashed #ECE7DE', marginTop: '6px' }}>
                            <span style={{ fontWeight: '600', color: '#1F2937' }}>Subtotal:</span>
                            <strong style={{ color: 'var(--uterpy-base, #CA8A38)', fontSize: '16px' }}>
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </strong>
                          </div>
                        </div>
                      ))
                    ) : null}
                  </div>

                  {(!cartItems || cartItems.length === 0) && (
                    <div className="text-center py-5">
                      <div style={{ padding: '30px 0' }}>
                        <i className="fas fa-shopping-cart" style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }}></i>
                        <h4 style={{ color: '#333', marginBottom: '10px' }}>Your cart is currently empty</h4>
                        <p style={{ color: '#777', marginBottom: '20px' }}>Explore our publications and add inspiring books to your cart.</p>
                        <Link to="/shop" className="thm-btn">
                          <span>Return to Bookstore</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Coupon Form Box (hidden as requested, easy to re-enable in future)
                  <div className="cart-cupon__form-box">
                    <p className="cart-cupon__sub-title">Coupon code:</p>
                    <form onSubmit={handleApplyCoupon} className="default-form cart-cupon__form">
                      <input
                        type="text"
                        placeholder="Type Code (e.g. ELLANGALA10)"
                        className="cart-cupon__input"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                      />
                      <button className="thm-btn" type="submit">
                        <span>Add Code</span>
                      </button>
                    </form>

                    {couponSuccess && (
                      <div className="alert alert-success mt-2 d-flex justify-content-between align-items-center" style={{ padding: '8px 16px' }}>
                        <span><i className="fas fa-check-circle me-2"></i>{couponSuccess}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger p-0"
                          onClick={removeCoupon}
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {couponError && (
                      <div className="alert alert-danger mt-2" style={{ padding: '8px 16px' }}>
                        <i className="fas fa-exclamation-circle me-2"></i>{couponError}
                      </div>
                    )}
                  </div>
                  */}

                  <div className="mt-4">
                    <Link to="/shop" className="cart-cupon__btn">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Cart Totals & Checkout */}
              <div className="col-xl-4 col-lg-5">
                <div className="cart-page__right">
                  <div className="cart-page__total-box">
                    <div className="cart-page__total-table-outer">
                      <table className="cart-page__total-table">
                        <tbody>
                          <tr>
                            <td>Cart totals</td>
                            <td>₹{total}.00</td>
                          </tr>
                          <tr>
                            <td>Subtotal</td>
                            <td>₹{subtotal}.00</td>
                          </tr>

                          {discountPercent > 0 && (
                            <tr>
                              <td>Discount ({discountPercent}%)</td>
                              <td style={{ color: '#28a745' }}>-₹{discountAmount}.00</td>
                            </tr>
                          )}

                          <tr>
                            <td>Shipping</td>
                            <td>
                              <p className="flat-rate">
                                {subtotal >= 499 ? (
                                  <span style={{ color: '#28a745', fontWeight: 'bold' }}>FREE Shipping</span>
                                ) : (
                                  `Flat rate: ₹${shipping}.00`
                                )}
                              </p>
                              <p className="shipping-usa">
                                Shipping to {shippingLocation.state}, {shippingLocation.country}
                              </p>
                              <p className="change-address">
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setShowAddressModal(!showAddressModal);
                                  }}
                                >
                                  Change address
                                </a>
                              </p>

                              {/* Inline Change Address Form */}
                              {showAddressModal && (
                                <div
                                  className="mt-3 p-3"
                                  style={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                  }}
                                >
                                  <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                                    Select Delivery Region:
                                  </label>
                                  <select
                                    className="form-select form-select-sm mb-2"
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                  >
                                    <option value="Karnataka">Karnataka (₹50 Flat)</option>
                                    <option value="South India">Other South India States (₹80)</option>
                                    <option value="Rest of India">Rest of India (₹80)</option>
                                    <option value="International">International Delivery (₹350)</option>
                                  </select>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-dark w-100"
                                    onClick={handleSaveAddress}
                                  >
                                    Update Shipping
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>

                          <tr>
                            <td>Total</td>
                            <td>₹{total}.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <button
                      className="proceed-checkout"
                      type="button"
                      disabled={cartItems.length === 0}
                      onClick={() => navigate('/checkout')}
                      style={{
                        cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: cartItems.length === 0 ? 0.6 : 1
                      }}
                    >
                      Proceed to checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Cart Page End */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
