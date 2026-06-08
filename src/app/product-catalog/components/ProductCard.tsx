'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/utils/format';

import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const isCustom = product.name.toLowerCase().includes('personnalisé');

  // Determine if product is "New" (less than 7 days old)
  const isNew = React.useMemo(() => {
    if (!product.createdAt) return false;
    return (new Date().getTime() - new Date(product.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
  }, [product.createdAt]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.inStock === false || isAdding) return;

    setIsAdding(true);
    try {
      await addItem(product, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div 
      className="bg-transparent transition-all duration-500 group flex flex-col h-full relative"
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {product.originalPrice && product.originalPrice > product.price && !isCustom && (
          <span className="bg-error text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
            {t('product.promo') || 'Promo'}
          </span>
        )}
        {isNew && (
          <span className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
            {t('product.new') || 'Nouveau'}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
          isWishlisted ? 'bg-error text-white' : 'bg-white/60 backdrop-blur-md text-foreground hover:bg-white hover:text-error'
        }`}
      >
        <Icon name="HeartIcon" size={18} variant={isWishlisted ? 'solid' : 'outline'} />
      </button>

      {/* Clickable Area (Image + Title) */}
      <Link href={isCustom ? '/custom-cake' : `/product/${product.id}`} className="flex flex-col flex-grow outline-none relative z-10" aria-label={product.name}>
        {/* Image Section */}
        <div className="relative h-48 sm:h-72 overflow-hidden bg-transparent group-hover:scale-105 transition-transform duration-700 rounded-2xl border border-border/5">
          <AppImage
            src={product.image}
            alt={product.alt}
            className="w-full h-full object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-10 transition-opacity">
              <span className="bg-background/90 text-foreground px-5 py-2.5 rounded-full font-heading font-semibold text-sm tracking-wide shadow-lg border border-border/50">
                {t('product.outOfStock')}
              </span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none" />
        </div>

        {/* Content Section - High-Density Minimalist */}
        <div className="p-4 sm:p-5 flex flex-col space-y-4 flex-grow">
          <div className="flex flex-col space-y-2">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[50px]">
              {product.name}
            </h3>
          </div>
        </div>
      </Link>
          
      {/* Price & Add to Cart Area (Positioned at bottom of card, outside Link) */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              {isCustom ? (
                <span className="font-heading text-lg font-black text-primary uppercase tracking-wider">
                  {t('product.customCakePrice') || 'Sur devis'}
                </span>
              ) : (
                <>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-[10px] text-muted-foreground line-through opacity-60 mb-0.5">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="font-heading text-xl font-black text-primary flex items-baseline gap-0.5">
                    {formatPrice(product.price).replace('DT', '').trim()} 
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">DT</span>
                  </span>
                </>
              )}
            </div>

            {isCustom ? (
              <Link
                href="/custom-cake"
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm transform bg-primary text-primary-foreground hover:bg-black hover:text-white hover:scale-110 active:scale-95"
                title={t('product.customize') || 'Personnaliser'}
              >
                <Icon name="SparklesIcon" size={22} variant="outline" />
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={product.inStock === false || isAdding}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm transform ${
                  isAdding
                  ? 'bg-success text-white scale-90'
                  : 'bg-primary text-primary-foreground hover:bg-black hover:text-white hover:scale-110 active:scale-95'
                } disabled:opacity-30 disabled:grayscale`}
              >
                <Icon name={isAdding ? 'CheckIcon' : 'ShoppingBagIcon'} size={22} variant="outline" />
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;