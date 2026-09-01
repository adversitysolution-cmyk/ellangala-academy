import React, { createContext, useContext, useState, useEffect } from 'react';
import { computeDiscount } from '../shared/couponMath';
import { validateCoupon } from '../admin/services/couponService';

const CartContext = createContext();

const INITIAL_CART = [
  {
    id: 'bhagavadgeetha-for-meaningful-life',
    title: 'Bhagavadgeetha for Meaningful Life',
    img: '/assets/images/books/Bagavadhgeetha for Meaningfull Life.png',
    price: 180,
    quantity: 1,
    link: '/shop-details?id=bhagavadgeetha-for-meaningful-life'
  }
];

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ellangala_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CART;
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const [shippingLocation, setShippingLocation] = useState({
    state: 'Karnataka',
    country: 'India',
    rate: 50
  });

  useEffect(() => {
    try {
      localStorage.setItem('ellangala_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const parsePrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 180;
    const match = priceStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 180;
  };

  const addToCart = (product, qty = 1) => {
    if (!product || product.inStock === false) return;
    const numericPrice = product.numericPrice || parsePrice(product.price);
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            title: product.title,
            img: product.image || product.img,
            price: numericPrice,
            quantity: qty,
            link: `/shop-details?id=${product.id}`
          }
        ];
      }
    });
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const applyCoupon = async (code) => {
    const trimmed = (code || '').trim().toUpperCase();
    setCouponSuccess('');
    if (!trimmed) {
      setCouponError('Please enter a coupon code.');
      return false;
    }
    setCouponLoading(true);
    setCouponError('');
    try {
      const currentSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const c = await validateCoupon(trimmed, currentSubtotal);
      setAppliedCoupon({
        code: c.code,
        type: c.type,
        value: c.value,
        minSubtotal: c.minSubtotal,
        maxDiscount: c.maxDiscount
      });
      setCouponSuccess(
        c.type === 'percent'
          ? `${c.value}% discount applied — you save ₹${c.discount}!`
          : `₹${c.value} discount applied!`
      );
      return true;
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.message || 'Invalid coupon code.');
      return false;
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  const updateShipping = (state, country = 'India', rate = 50) => {
    setShippingLocation({ state, country, rate });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = computeDiscount(appliedCoupon, subtotal);
  const discountPercent = appliedCoupon?.type === 'percent' ? appliedCoupon.value : 0;
  const couponCode = appliedCoupon?.code || '';
  const shipping = cartItems.length > 0 ? (subtotal >= 499 ? 0 : shippingLocation.rate) : 0;
  const total = Math.max(0, subtotal - discountAmount + shipping);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        couponCode,
        appliedCoupon,
        discountPercent,
        discountAmount,
        couponError,
        couponSuccess,
        couponLoading,
        applyCoupon,
        removeCoupon,
        shippingLocation,
        updateShipping,
        subtotal,
        shipping,
        total,
        totalCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
