'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { formatPrice } from '@/utils/format';
import Link from 'next/link';

const CartDrawer = () => {
  const { cartItems, isDrawerOpen, setIsDrawerOpen, removeItem, totalAmount } = useCart();
  const { t, direction } = useLanguage();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] overflow-hidden" dir={direction}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className={`absolute inset-y-0 ${direction === 'rtl' ? 'left-0' : 'right-0'} max-w-full flex`}>
        <div className={`w-screen max-w-md bg-white shadow-warm-2xl flex flex-col animate-slide-in-${direction === 'rtl' ? 'left' : 'right'} border-l border-border/10`}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-border/10">
            <div className="flex items-center gap-3">
              <Icon name="ShoppingCartIcon" size={24} className="text-primary" />
              <h2 className="text-xl font-black font-heading">{t('cart.title')}</h2>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-full hover:bg-muted transition-colors active:scale-90"
            >
              <Icon name="XMarkIcon" size={24} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">
            {cartItems.length > 0 ? (
              cartItems.map((item, idx) => (
                <div key={`${item.productId?._id}-${idx}`} className="flex gap-4 group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted/20 border border-border/5 flex-shrink-0">
                    <AppImage 
                      src={item.image || item.productId?.image} 
                      alt={item.name || item.productId?.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground text-sm truncate">{item.name || item.productId?.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.productId?.categoryName || item.productId?.category}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-black text-primary">{formatPrice(item.price || item.productId?.price)} x {item.quantity}</span>
                      <button 
                        onClick={() => removeItem(item)}
                        className="text-error/40 hover:text-error transition-colors p-1"
                      >
                        <Icon name="TrashIcon" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40">
                <Icon name="ShoppingCartIcon" size={64} variant="outline" />
                <p className="font-black text-lg text-center tracking-tight uppercase">{t('cart.empty.title')}</p>
                <p className="text-sm text-center max-w-[200px]">{t('cart.empty.subtitle')}</p>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-6 py-2.5 bg-primary text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
                >
                  {t('cart.empty.cta')}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-border/10 space-y-6 bg-muted/5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Total</span>
                <span className="font-heading text-3xl font-black text-foreground">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              
              <div className="space-y-3">
                <Link 
                  href="/shopping-cart"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full h-14 rounded-2xl bg-white border border-border/10 text-black flex items-center justify-center font-black text-base shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
                >
                  {t('cart.title')}
                </Link>
                <Link 
                  href="/checkout-payment"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-base shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all"
                >
                  {t('cart.summary.checkout')}
                </Link>
              </div>

              <p className="text-[10px] text-center text-muted-foreground opacity-60">
                TVA incluse. Frais de port calculés à l'étape suivante.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
