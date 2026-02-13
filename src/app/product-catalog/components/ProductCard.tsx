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
    <div className="bg-card rounded-lg shadow-warm hover:shadow-warm-md transition-smooth overflow-hidden group">
      <div className="relative h-64 overflow-hidden bg-muted">
        <AppImage
          src={product.image}
          alt={product.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="bg-error text-error-foreground px-4 py-2 rounded-lg font-semibold">
              {t('product.outOfStock')}
            </span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] bg-white/90 backdrop-blur-sm text-foreground py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-smooth hover:bg-white border border-border/50 shadow-sm"
          aria-label={t('product.quickViewProduct', { productName: product.name })}
        >
          <Icon name="EyeIcon" size={16} />
          {t('catalog.quickView')}
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="caption text-muted-foreground">{product.brand}</p>
          <h3 className="font-heading text-lg font-semibold text-foreground line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="font-heading text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.inStock === false || isAdding}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-smooth font-medium focus:outline-none focus:ring-3 focus:ring-ring focus:ring-offset-3 ${isAdding
              ? 'bg-accent text-accent-foreground animate-pulse'
              : 'bg-primary text-primary-foreground hover:opacity-90'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={t('product.addToCartAria', { productName: product.name })}
          >
            {isAdding ? (
              <Icon name="CheckIcon" size={20} />
            ) : (
              <Icon name="ShoppingCartIcon" size={20} />
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