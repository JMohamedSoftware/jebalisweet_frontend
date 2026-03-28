'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

interface CartItem {
  productId: any;
  quantity: number;
  customOptions?: any;
  customImage?: string;
  comment?: string;
  price: number;
  name: string;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  addItem: (product: any, quantity: number, options?: any) => Promise<void>;
  removeItem: (product: any) => Promise<void>;
  refreshCart: () => Promise<void>;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartItems([]);
      setCartCount(0);
      setTotalAmount(0);
      return;
    }

    try {
      const data = await api.cart.get();
      if (data.items) {
        setCartItems(data.items);
        const count = data.items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
        setCartCount(count);
        
        const total = data.items.reduce((sum: number, item: any) => {
            const price = item.price || item.productId?.price || 0;
            return sum + (price * (item.quantity || 0));
        }, 0);
        setTotalAmount(total);
      }
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    }
  }, []);

  useEffect(() => {
    refreshCart();
    
    const handleUpdate = () => refreshCart();
    window.addEventListener('cartUpdated', handleUpdate);
    window.addEventListener('authChanged', handleUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleUpdate);
      window.removeEventListener('authChanged', handleUpdate);
    };
  }, [refreshCart]);

  const addItem = async (product: any, quantity: number, options?: any) => {
    try {
      await api.cart.add(product.id || product._id, quantity, options);
      await refreshCart();
      setIsDrawerOpen(true); // Open drawer on addition
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  };

  const removeItem = async (item: any) => {
    try {
      await api.cart.remove(item.productId?._id || item.productId);
      await refreshCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartCount, 
      isDrawerOpen, 
      setIsDrawerOpen, 
      addItem, 
      removeItem, 
      refreshCart,
      totalAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
