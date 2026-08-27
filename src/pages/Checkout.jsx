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
import { orderService } from '../admin/services/orderService';
import SEO from '../seo/SEO';

export default function Checkout() {
  useUterpyPlugins();
  const navigate = useNavigate();
  const { cartItems, subtotal, shipping, discountAmount, discountPercent, total, shippingLocation, clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: 'India',
    streetAddress: '',
    city: '',
    state: shippingLocation.state || 'Karnataka',
    zipcode: '',
    phone: '',
    email: '',
    orderNotes: '',
    paymentMethod: 'cod'
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phone || !formData.streetAddress) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setIsPlacingOrder(true);
    setOrderError('');

    try {
      await orderService.addOrder({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        country: formData.country,
        cartItems: cartItems,
        subtotal: subtotal,
        shipping: shipping,
        discountAmount: discountAmount,
        total: total,
        paymentMethod: formData.paymentMethod,
        orderNotes: formData.orderNotes
      });
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      setOrderError(err.message || 'Could not place your order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO title="Checkout | Ellangala’s Academy" noindex={true} />
        <HeaderOne />
        <PageHeader title="Checkout" pageName="Checkout" />

        {/* Start Checkout Area */}
        <section className="checkout-area">
          <div className="container">
            {orderPlaced ? (
              <div className="text-center py-5">
                <div style={{ maxWidth: '650px', margin: '0 auto', backgroundColor: '#fcfaf7', padding: '50px 30px', borderRadius: '12px', border: '1px solid #e8e2d8' }}>
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '64px', marginBottom: '20px' }}></i>
                  <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '15px' }}>Thank You For Your Order!</h2>
                  <p style={{ fontSize: '17px', color: '#555', lineHeight: '1.7', marginBottom: '25px' }}>
                    Your book order has been successfully placed. We will contact you at <strong>{formData.phone}</strong> and ship your books to <strong>{formData.city}, {formData.state}</strong> shortly.
                  </p>
                  <Link to="/shop" className="thm-btn">
                    <span>Continue Browsing Books</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-xl-8 col-lg-7 col-md-12 col-sm-12">
                  <div className="form billing-info">
                    <div className="title">
                      <h3>Billing & Delivery details</h3>
                    </div>
                    <form onSubmit={handlePlaceOrder}>
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="field-label">First name *</div>
                          <div className="field-input">
                            <input
                              type="text"
                              name="firstName"
                              placeholder="First name"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="field-label">Last name *</div>
                          <div className="field-input">
                            <input
                              type="text"
                              name="lastName"
                              placeholder="Last name"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="field-label">Country / Region *</div>
                          <div className="field-input">
                            <input
                              type="text"
                              name="country"
                              value={formData.country}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="field-label">Street address *</div>
                          <div className="field-input address">
                            <input
                              type="text"
                              name="streetAddress"
                              placeholder="House number and street name"
                              value={formData.streetAddress}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                          <div className="field-label">Town / City *</div>
                          <div className="field-input address">
                            <input
                              type="text"
                              name="city"
                              placeholder="Town or City"
                              value={formData.city}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                          <div className="field-label">State *</div>
                          <div className="field-input">
                            <input
                              type="text"
                              name="state"
                              placeholder="State (e.g. Karnataka)"
                              value={formData.state}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                          <div className="field-label">PIN / ZIP Code *</div>
                          <div className="field-input">
                            <input
                              type="text"
                              name="zipcode"
                              placeholder="PIN / ZIP Code"
                              value={formData.zipcode}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                          <div className="field-label">Phone Number *</div>
                          <div className="field-input">
                            <input
                              type="tel"
                              name="phone"
                              placeholder="Phone number"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="field-label">Email address *</div>
                          <div className="field-input">
                            <input
                              type="email"
                              name="email"
                              placeholder="Email address"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="field-label">Order notes (optional)</div>
                          <div className="field-input">
                            <textarea
                              name="orderNotes"
                              placeholder="Special notes for delivery or book dedication..."
                              value={formData.orderNotes}
                              onChange={handleChange}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Start Checkout Area Sidebar */}
                <div className="col-xl-4 col-lg-5 col-md-12 col-sm-12 mt-4 mt-lg-0">
                  <div className="checkout-area__sidebar">
                    <div className="checkout-area__sidebar-single">
                      <div className="title">
                        <h3>Your Order</h3>
                      </div>
                      <ul>
                        {cartItems && cartItems.length > 0 ? (
                          cartItems.map((item) => (
                            <li key={item.id}>
                              <div className="text-box d-flex align-items-center">
                                <div className="img-box me-3" style={{ width: '50px', height: '60px', overflow: 'hidden' }}>
                                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div className="title-one">
                                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
                                    {item.title} <br />
                                    <span style={{ fontSize: '12px', color: '#888' }}>Qty: {item.quantity}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="price">
                                <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li>
                            <p className="text-muted">No items in cart</p>
                          </li>
                        )}

                        <li className="bg">
                          <div className="text-box">
                            <div className="title-box">
                              <p>Subtotal</p>
                            </div>
                          </div>
                          <div className="price">
                            <p>₹{subtotal}.00</p>
                          </div>
                        </li>

                        {discountPercent > 0 && (
                          <li className="bg">
                            <div className="text-box">
                              <div className="title-box">
                                <p>Discount ({discountPercent}%)</p>
                              </div>
                            </div>
                            <div className="price">
                              <p style={{ color: '#28a745' }}>-₹{discountAmount}.00</p>
                            </div>
                          </li>
                        )}

                        <li className="bg">
                          <div className="text-box">
                            <div className="title-box">
                              <p>Shipping ({shippingLocation.state})</p>
                            </div>
                          </div>
                          <div className="price">
                            <p>{shipping === 0 ? 'FREE' : `₹${shipping}.00`}</p>
                          </div>
                        </li>

                        <li className="bg">
                          <div className="text-box">
                            <div className="title-box">
                              <p>
                                <strong>Total Amount</strong>
                              </p>
                            </div>
                          </div>
                          <div className="price">
                            <p>
                              <strong>₹{total}.00</strong>
                            </p>
                          </div>
                        </li>
                      </ul>

                      {orderError && (
                        <p className="text-danger mt-3 mb-0">{orderError}</p>
                      )}

                      <div className="btn-box mt-4">
                        <button
                          type="button"
                          className="thm-btn w-100"
                          disabled={cartItems.length === 0 || isPlacingOrder}
                          onClick={handlePlaceOrder}
                        >
                          <span>{isPlacingOrder ? 'Placing Order...' : 'Place Order'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        {/* End Checkout Area */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
