'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { api } from '@/services/api';

const CartIndicator = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const loadCartCount = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartCount(0);
        return;
      }
      try {
        const data = await api.cart.get();
        if (data.items) {
          const totalItems = data.items.reduce(
            (sum: number, item: any) => sum + (item.quantity || 0),
            0
          );
          setCartCount(totalItems);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCartCount();

    const handleCartUpdate = () => {
      loadCartCount();
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('authChanged', loadCartCount);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('authChanged', loadCartCount);
    };
  }, []);

  return (
    <Link
      href="/shopping-cart"
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
    </Link>
  );
};

export default CartIndicator;