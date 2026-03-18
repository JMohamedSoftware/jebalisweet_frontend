'use client';

import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/utils/format';

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
}

interface EmptyCartProps {
  featuredProducts: FeaturedProduct[];
}

const EmptyCart = ({ featuredProducts }: EmptyCartProps) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <div className="mb-8">
        <Icon name="ShoppingCartIcon" size={80} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="font-heading text-3xl font-semibold text-foreground mb-3">
          {t('cart.empty.title')}
        </h2>
        <p className="text-muted-foreground text-lg">
          {t('cart.empty.subtitle')}
        </p>
      </div>

      <Link
        href="/product-catalog"
        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-primary/20 mb-12"
      >
        <Icon name="ShoppingBagIcon" size={20} />
        {t('cart.empty.cta')}
      </Link>

      <div className="mt-12">
        <h3 className="font-heading text-2xl font-semibold text-foreground mb-6">
          {t('catalog.popularProducts')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href="/product-catalog"
              className="bg-card rounded-2xl shadow-sm border border-border/5 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden">
                <AppImage
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                />
              </div>
              <div className="p-4">
                <h4 className="font-heading font-semibold text-foreground mb-2">
                  {product.name}
                </h4>
                <p className="data-text font-bold text-primary text-lg">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;