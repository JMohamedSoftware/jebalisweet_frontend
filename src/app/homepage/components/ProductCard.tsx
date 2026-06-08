'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { t } = useLanguage();
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const isCustom = product.name.toLowerCase().includes('personnalisé');

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock || isAdding) return;
    setIsAdding(true);
    await onAddToCart();
    setTimeout(() => setIsAdding(false), 1200);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({
      ...product,
      description: product.description || '',
      alt: product.alt || product.name
    } as any);
  };

  const handleCardClick = () => {
    router.push(isCustom ? '/custom-cake' : `/product/${product.id}`);
  };

  const stockQty = Math.max(0, product.stockQuantity || 0);
  const isLowStock = stockQty > 0 && stockQty <= 5;

  return (
    <div 
      className="group relative flex flex-col bg-transparent transition-all duration-500 cursor-pointer"
      onClick={handleCardClick}
    >

      {/* ── Image Container - Professional 4:3 Aspect Ratio ── */}
      <Link
        href={isCustom ? '/custom-cake' : `/product/${product.id}`}
        className="relative block overflow-hidden rounded-xl border border-border/5"
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


        {/* Low Stock Indicator - Understated */}
        {isLowStock && product.inStock && !isCustom && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-accent/90 backdrop-blur-sm text-white font-bold text-[9px] sm:text-[10px] tracking-wider animate-pulse shadow-sm z-20">
            PIÈCES LIMITÉES
          </div>
        )}

        {/* Jadour (Wishlist) Button */}
        <button 
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md transform hover:scale-110 active:scale-95 ${
            isWishlisted ? 'bg-error text-white' : 'bg-white/70 backdrop-blur-md text-foreground hover:bg-white hover:text-error'
          }`}
          aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Icon name="HeartIcon" size={18} variant={isWishlisted ? 'solid' : 'outline'} />
        </button>

        {/* Out of stock - High-end style */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-5 py-2.5 bg-foreground text-background rounded-lg font-bold text-[11px] tracking-[0.2em] uppercase shadow-lg">
              Indisponible
            </span>
          </div>
        )}

        {/* Subtle Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none" />
      </Link>

      {/* ── Product Info - High-Density Minimalist ── */}
      <div className="flex flex-col p-3 sm:p-4 space-y-3">
        <div className="flex flex-col space-y-1">
          <Link href={isCustom ? '/custom-cake' : `/product/${product.id}`}>
            <h3 className="font-heading font-semibold text-sm sm:text-lg text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300 tracking-tight min-h-[40px]">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between gap-2">
            {isCustom ? (
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-heading font-bold text-primary uppercase tracking-wider">
                  {t('product.customCakePrice') || 'Sur devis'}
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-heading font-black text-foreground tracking-tighter">
                  {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  DT
                </span>
              </div>
            )}

            {isCustom ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/custom-cake');
                }}
                aria-label={t('product.customize') || 'Personnaliser'}
                className="flex items-center justify-center p-2 rounded-lg transition-all duration-300 shadow-sm bg-primary text-white hover:bg-black hover:scale-110 active:scale-95"
              >
                <Icon name="SparklesIcon" size={20} variant="outline" strokeWidth={2.5} />
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
                aria-label={t('product.addToCartAria', { productName: product.name })}
                className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 shadow-sm ${isAdding
                    ? 'bg-success text-white scale-90'
                    : product.inStock
                      ? 'bg-primary text-white hover:bg-black hover:scale-110 active:scale-95'
                      : 'bg-muted text-muted-foreground cursor-not-allowed opacity-30'
                  }`}
              >
                {isAdding ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <Icon name="ShoppingBagIcon" size={20} variant="outline" strokeWidth={2.5} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;