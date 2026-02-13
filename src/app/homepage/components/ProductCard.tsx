'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
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
    if (product.inStock === false || isAdding) return;

    setIsAdding(true);
    await onAddToCart();

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-warm hover-lift">
      <Link href={`/product-catalog?category=${product.category}`} className="block">
        <div className="relative h-56 overflow-hidden">
          <AppImage
            src={product.image}
            alt={product.alt}
            className="w-full h-full object-cover transition-smooth group-hover:scale-110"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="px-4 py-2 bg-error text-error-foreground rounded-lg font-semibold">
                {t('product.outOfStock')}
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3 px-3 py-1 bg-primary text-primary-foreground rounded-full caption font-semibold">
            {product.category}
          </div>
          {onQuickView && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(); }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] bg-white/90 backdrop-blur-sm text-foreground py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-smooth hover:bg-white border border-border/50 shadow-sm"
            >
              <Icon name="EyeIcon" size={16} />
              {t('catalog.quickView')}
            </button>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product-catalog?category=${product.category}`}>
          <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary data-text">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={product.inStock === false || isAdding}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-smooth ${isAdding
              ? 'bg-accent text-accent-foreground animate-pulse'
              : product.inStock !== false
                ? 'bg-primary text-primary-foreground hover:opacity-90 hover:scale-105'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            aria-label={t('product.addToCartAria', { productName: product.name })}
          >
            {isAdding ? (
              <Icon name="CheckIcon" size={18} />
            ) : (
              <Icon name="ShoppingCartIcon" size={18} />
            )}
            <span className="hidden sm:inline">
              {isAdding ? t('common.loading') : t('product.addToCart')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;