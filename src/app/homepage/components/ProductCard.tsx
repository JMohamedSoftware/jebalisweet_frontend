'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/utils/format';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  category: string;
  inStock: boolean;
  stockQuantity?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  onQuickView?: () => void;
}

const ProductCard = ({ product, onAddToCart, onQuickView }: ProductCardProps) => {
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock || isAdding) return;
    setIsAdding(true);
    await onAddToCart();
    setTimeout(() => setIsAdding(false), 1200);
  };

  const stockQty = Math.max(0, product.stockQuantity || 0);
  const isLowStock = stockQty > 0 && stockQty <= 5;

  return (
    <div className="group relative flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-warm-sm border border-white/20 hover:-translate-y-2 hover:shadow-warm-xl transition-all duration-500">

      {/* ── Image Container - Professional 4:3 Aspect Ratio ── */}
      <Link
        href={`/product-catalog?category=${product.category}`}
        className="relative block overflow-hidden"
        style={{ aspectRatio: '4/3' }}
      >
        <AppImage
          src={product.image}
          alt={product.alt || product.name}
          fill
          sizes="(max-width: 640px) 48vw, (max-width: 1024px) 33vw, 350px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Sophisticated Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />

        {/* Subtle Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none" />

        {/* Minimalist Badge: Category */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-white/90 backdrop-blur-sm text-foreground font-bold text-[9px] sm:text-[10px] tracking-[0.1em] uppercase shadow-sm">
          {product.category}
        </div>

        {/* Low Stock Indicator - Understated */}
        {isLowStock && product.inStock && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-md bg-accent/90 backdrop-blur-sm text-white font-bold text-[9px] sm:text-[10px] tracking-wider animate-pulse shadow-sm">
            PIÈCES LIMITÉES
          </div>
        )}

        {/* Out of stock - High-end style */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-5 py-2.5 bg-foreground text-background rounded-lg font-bold text-[11px] tracking-[0.2em] uppercase shadow-lg">
              Indisponible
            </span>
          </div>
        )}

        {/* Quick View Button - High Level design */}
        {onQuickView && product.inStock && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(); }}
            className="absolute bottom-4 left-4 right-4 py-3 bg-white text-foreground font-bold text-[11px] tracking-[0.1em] uppercase shadow-warm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-foreground hover:text-white"
          >
            Aperçu rapide
          </button>
        )}
      </Link>

      {/* ── Product Info - Clean and Classy ── */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <Link href={`/product-catalog?category=${product.category}`}>
          <h3 className="font-heading font-semibold text-sm sm:text-lg text-foreground mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300 tracking-tight">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between gap-3 mt-auto">
          <div className="flex flex-col leading-none">
            <span className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            aria-label={t('product.addToCartAria', { productName: product.name })}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 shadow-sm ${isAdding
                ? 'bg-accent text-white scale-95'
                : product.inStock
                  ? 'bg-primary text-white hover:bg-primary/95 hover:shadow-md hover:scale-105 active:scale-95'
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-40'
              }`}
          >
            {isAdding ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="hidden sm:inline uppercase tracking-widest">OK</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="hidden sm:inline uppercase tracking-widest">{t('product.addToCart')}</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;