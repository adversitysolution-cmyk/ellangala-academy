import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

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
    const numericPrice = parsePrice(product.price || product.numericPrice);
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
            img: product.img,
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

  const applyCoupon = (code) => {
    const trimmed = (code || '').trim().toUpperCase();
    if (!trimmed) {
      setCouponError('Please enter a coupon code.');
      setCouponSuccess('');
      return false;
    }
    if (trimmed === 'ELLANGALA10' || trimmed === 'WELCOME10' || trimmed === 'OFFER10') {
      setDiscountPercent(10);
      setCouponCode(trimmed);
      setCouponSuccess('10% discount coupon applied successfully!');
      setCouponError('');
      return true;
    } else if (trimmed === 'SUPER20' || trimmed === 'SAVE20') {
      setDiscountPercent(20);
      setCouponCode(trimmed);
      setCouponSuccess('20% discount coupon applied successfully!');
      setCouponError('');
      return true;
    } else {
      setCouponError('Invalid coupon code. Try ELLANGALA10');
      setCouponSuccess('');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    setCouponSuccess('');
    setCouponError('');
  };

  const updateShipping = (state, country = 'India', rate = 50) => {
    setShippingLocation({ state, country, rate });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
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
