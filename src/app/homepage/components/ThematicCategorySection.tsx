'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  category: string;
  inStock: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface ThematicCategorySectionProps {
  category: Category;
  products: Product[];
  onAddToCart: (product: any) => void;
}

const ThematicCategorySection = ({ category, products, onAddToCart }: ThematicCategorySectionProps) => {
  const { t } = useLanguage();

  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
      {/* Decorative center line background */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/5 -translate-x-1/2 hidden md:block" />

      {/* Ro3eb Typography Watermark */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 flex items-center justify-center overflow-hidden">
        <span 
          className="text-[30vw] font-black opacity-[0.02] uppercase tracking-[0.2em] whitespace-nowrap"
          style={{ color: 'transparent', WebkitTextStroke: '1px black' }}
        >
          {category.name}
        </span>
      </div>

      {/* Decorative center line background */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/5 -translate-x-1/2 hidden md:block" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Centered Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-20 space-y-4 reveal">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
            {t('catalog.exclusive') || 'Collection Exclusive'}
          </span>
          <h2 className="text-4xl sm:text-6xl font-heading font-black text-foreground tracking-tight">
            {category.name}
          </h2>
          <div className="h-1.5 w-20 bg-primary/20 rounded-full" />
          <p className="text-muted-foreground text-lg italic max-w-xl leading-relaxed font-light">
            {category.description}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-12">
          {products.slice(0, 4).map((product, index) => (
            <div 
              key={product.id} 
              className="reveal" 
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <ProductCard 
                product={product as any} 
                onAddToCart={() => onAddToCart(product)} 
              />
            </div>
          ))}
        </div>

        {/* See More Link */}
        <div className="mt-16 flex justify-center">
          <Link
            href={`/product-catalog?category=${category.name}`}
            className="group inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary hover:text-black transition-colors"
          >
            <span>{t('home.hero.cta') || 'Voir la collection'}</span>
            <div className="w-8 h-px bg-primary group-hover:bg-black group-hover:w-12 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ThematicCategorySection;
