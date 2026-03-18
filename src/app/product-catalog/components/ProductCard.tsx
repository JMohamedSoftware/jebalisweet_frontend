'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/utils/format';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  inStock: boolean;
  stockQuantity?: number;
  priceUnit?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onQuickView }: ProductCardProps) => {
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (product.inStock === false || isAdding) return;

    setIsAdding(true);
    await onAddToCart(product);

    // Feedback duration
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="StarIcon"
        size={16}
        variant={index < Math.floor(rating) ? 'solid' : 'outline'}
        className={index < Math.floor(rating) ? 'text-accent' : 'text-muted-foreground'}
      />
    ));
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group border border-white/20 flex flex-col h-full">
      <div className="relative h-48 sm:h-64 overflow-hidden bg-transparent">
        <AppImage
          src={product.image}
          alt={product.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-10 transition-opacity">
            <span className="bg-background/90 text-foreground px-5 py-2.5 rounded-full font-heading font-semibold text-sm tracking-wide shadow-lg border border-border/50">
              {t('product.outOfStock')}
            </span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
          className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] bg-white/40 backdrop-blur-xl text-foreground py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-white border border-white/20 shadow-lg translate-y-2 sm:group-hover:translate-y-0 z-20"
          aria-label={t('product.quickViewProduct', { productName: product.name })}
        >
          <Icon name="EyeIcon" size={16} className="sm:w-5 sm:h-5 text-primary" />
          {t('catalog.quickView')}
        </button>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 space-y-3 sm:space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] sm:text-xs font-semibold tracking-widest text-muted-foreground uppercase hidden sm:block">{product.brand}</p>
          <h3 className="font-heading text-base sm:text-xl font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {product.inStock && (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${(product.stockQuantity || 0) > 5 ? 'bg-success' : 'bg-warning'}`}></div>
            <span className={`text-[10px] sm:text-xs font-semibold ${(product.stockQuantity || 0) > 5 ? 'text-success' : 'text-warning'}`}>
              Stock: {Math.max(0, product.stockQuantity || 0)} {product.priceUnit === 'kg' ? 'kg' : 'pcs'}
            </span>
          </div>
        )}

        <div className="flex items-end justify-between pt-3 sm:pt-4 border-t border-border/40 mt-auto">
          <div className="flex flex-col">
            <span className="font-heading text-xl sm:text-2xl font-bold text-primary leading-none">
              {formatPrice(product.price)}
            </span>
            {product.priceUnit === 'kg' && <span className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5">/ kg</span>}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.inStock === false || isAdding}
            className={`group/btn flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-300 font-bold focus:outline-none focus:ring-4 focus:ring-primary/20 ${isAdding
              ? 'bg-accent text-accent-foreground animate-pulse'
              : 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={t('product.addToCartAria', { productName: product.name })}
          >
            {isAdding ? (
              <Icon name="CheckIcon" size={16} className="sm:w-5 sm:h-5" />
            ) : (
              <Icon name="ShoppingCartIcon" size={16} className="sm:w-5 sm:h-5" />
            )}
            <span className="text-xs sm:text-base">
              {isAdding ? t('common.loading') : t('product.addToCart')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;