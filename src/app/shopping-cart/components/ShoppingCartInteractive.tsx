'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import EmptyCart from './EmptyCart';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/utils/format';

interface CartItemData {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  maxQuantity: number;
  comment?: string;
  customImage?: string;
  customOptions?: any;
}

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
}

const validPromoCodes: Record<string, number> = {
  'SWEET10': 10,
  'NOEL2025': 15,
  'BIENVENUE': 5
};

const ShoppingCartInteractive = () => {
  const { t } = useLanguage();
  const [isHydrated, setIsHydrated] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeError, setPromoCodeError] = useState('');
  const [promoCodeSuccess, setPromoCodeSuccess] = useState('');

  const fetchCart = async () => {
    try {
      const response = await api.cart.get();
      const mappedItems = response.items.map((item: any) => ({
        ...item,
        id: item.id || item._id,
        productId: item.productId,
        image: item.image || "https://images.unsplash.com/photo-1663214956771-9c6d8f646a2d",
        alt: item.name,
        availability: 'in_stock',
        maxQuantity: 10
      }));
      setCartItems(mappedItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
    fetchCart();

    const fetchFeatured = async () => {
      try {
        const data = await api.products.getAll(1, 3, { featured: true });
        const productsArray = Array.isArray(data) ? data : (data.products || []);
        setFeaturedProducts(productsArray.map((p: any) => ({
          id: p.id || p._id,
          name: p.name,
          price: p.price,
          image: p.image || "https://images.unsplash.com/photo-1663214956771-9c6d8f646a2d",
          alt: p.name
        })));
      } catch (error) {
        console.error('Error fetching featured:', error);
      }
    };
    fetchFeatured();

    const handleCartUpdate = () => fetchCart();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleUpdateQuantity = async (productId: string, newQuantity: number, customOptions?: any, customImage?: string) => {
    try {
      await api.cart.add(productId, newQuantity, customOptions, undefined, customImage, true);
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleUpdateComment = async (productId: string, newComment: string, customOptions?: any, customImage?: string) => {
    setCartItems(prev => prev.map(item =>
      item.productId === productId &&
        JSON.stringify(item.customOptions) === JSON.stringify(customOptions) &&
        item.customImage === customImage
        ? { ...item, comment: newComment } : item
    ));

    try {
      await api.cart.add(productId, 0, customOptions, newComment, customImage);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleRemoveItem = async (productId: string, customOptions?: any, customImage?: string) => {
    try {
      await api.cart.remove(productId, customOptions, customImage);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleApplyPromoCode = (code: string) => {
    const upperCode = code.toUpperCase();
    if (validPromoCodes[upperCode]) {
      setPromoCode(upperCode);
      setPromoCodeSuccess(t('cart.summary.successCode', { code: upperCode }));
      setPromoCodeError('');
    } else {
      setPromoCodeError(t('cart.summary.invalidCode'));
      setPromoCodeSuccess('');
      setPromoCode('');
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) =>
                  <div key={i} className="h-40 bg-muted rounded-lg"></div>
                )}
              </div>
              <div className="h-96 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = (promoCode && validPromoCodes[promoCode]) ? (subtotal * validPromoCodes[promoCode] / 100) : 0;
  const deliveryCost = 0;
  const total = subtotal + deliveryCost - discount;
  const hasCustomItems = cartItems.some(item => item.customImage || (item.customOptions && item.customOptions.isCustom));

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <EmptyCart featuredProducts={featuredProducts} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="font-heading text-4xl font-bold text-foreground">
            {t('cart.title')}
          </h1>
          <Link
            href="/product-catalog"
            className="flex items-center gap-2 text-primary hover:text-secondary transition-smooth font-medium">
            <Icon name="ArrowLeftIcon" size={20} />
            {t('cart.continueShopping')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">

            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(pid, q) => handleUpdateQuantity(pid, q, item.customOptions, item.customImage)}
                onUpdateComment={(pid, c) => handleUpdateComment(pid, c, item.customOptions, item.customImage)}
                onRemove={(pid) => handleRemoveItem(pid, item.customOptions, item.customImage)}
              />
            ))}
          </div>

          <div>
            <OrderSummary
              subtotal={subtotal}
              deliveryCost={deliveryCost}
              discount={discount}
              total={total}
              onApplyPromoCode={handleApplyPromoCode}
              promoCodeError={promoCodeError}
              promoCodeSuccess={promoCodeSuccess}
              hasCustomItems={hasCustomItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartInteractive;