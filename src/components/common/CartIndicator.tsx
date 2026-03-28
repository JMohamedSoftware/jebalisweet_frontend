'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/context/CartContext';

const CartIndicator = () => {
  const { cartCount, setIsDrawerOpen } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <button
      onClick={() => setIsDrawerOpen(true)}
      className="relative p-2 rounded-lg transition-smooth hover:bg-muted focus:outline-none focus:ring-3 focus:ring-ring focus:ring-offset-3"
      aria-label={`Panier - ${cartCount} article${cartCount !== 1 ? 's' : ''}`}
    >
      <Icon name="ShoppingCartIcon" size={24} className="text-foreground" />
      {cartCount > 0 && (
        <span
          className={`absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-accent text-accent-foreground text-xs font-bold rounded-full transition-smooth ${isAnimating ? 'animate-bounce-gentle' : ''
            }`}
        >
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </button>
  );
};

export default CartIndicator;