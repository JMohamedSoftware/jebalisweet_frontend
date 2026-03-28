'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ProductCard from '@/app/product-catalog/components/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const { addItem } = useCart();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 sm:py-20">
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Icon name="HeartIcon" size={32} className="text-primary" variant="solid" />
          </div>
          <h1 className="text-fluid-h2 font-heading font-bold text-foreground mb-4">
            {t('wishlist.title') || 'Mes Coups de Cœur'}
          </h1>
          <p className="text-muted-foreground max-w-xl text-balance">
            {t('wishlist.subtitle') || 'Retrouvez ici toutes vos créations Jadour préférées.'}
          </p>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {wishlist.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product as any} 
                onAddToCart={() => addItem(product as any, 1)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-8 opacity-40">
              <Icon name="HeartIcon" size={48} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-heading font-medium text-foreground mb-4">
              {t('wishlist.empty') || 'Votre liste est vide'}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {t('wishlist.emptyText') || 'Parcourez notre catalogue et cliquez sur le cœur pour enregistrer vos douceurs préférées.'}
            </p>
            <Link 
              href="/product-catalog"
              className="px-8 py-3 bg-primary text-white rounded-full font-bold transition-all hover:bg-black hover:shadow-lg active:scale-95"
            >
              {t('wishlist.shopNow') || 'Découvrir nos créations'}
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
