'use client';

import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { formatPrice } from '@/utils/format';
import { useLanguage } from '@/context/LanguageContext';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CategorySectionProps {
  category: {
    id: string;
    name: string;
    description: string;
    image: string;
  };
  products: Product[];
  isReversed?: boolean;
}

const CategorySection = ({ category, products, isReversed }: CategorySectionProps) => {
  const { t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden">
      <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} min-h-[500px] md:h-[650px]`}>
        
        {/* Image Side */}
        <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden group">
          <AppImage 
            src={category.image} 
            alt={category.name} 
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
        </div>

        {/* Content Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-14 lg:p-20 z-10">
          <div className="max-w-md w-full space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
            <div className="space-y-3">
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] block mb-1">
                {t('catalog.exclusive') || 'Collection Exclusive'}
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-foreground leading-tight">
                {category.name}
              </h2>
              <div className="h-1 w-16 bg-primary/20 rounded-full" />
              <p className="text-muted-foreground text-base italic leading-relaxed font-light">
                {category.description}
              </p>
            </div>

            {/* Menu-style Products (Border-free for elegance) */}
            <div className="space-y-3 pt-2">
              {products.slice(0, 3).map((product) => (
                <Link 
                  href={`/product/${product.id}`}
                  key={product.id} 
                  className="flex justify-between items-baseline group cursor-pointer transition-all duration-300 hover:translate-x-1"
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </span>
                  <div className="flex-1 mx-3 border-b border-dotted border-border/10 mb-1 opacity-40" />
                  <span className="text-sm font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href={`/product-catalog?category=${category.name}`}
              className="inline-flex items-center justify-center px-10 py-3.5 bg-primary text-primary-foreground rounded-full font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/10 hover:bg-black hover:text-white hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {t('home.hero.cta') || 'Commander'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
