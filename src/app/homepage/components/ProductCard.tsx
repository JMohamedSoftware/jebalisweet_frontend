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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding) return;
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
    router.push(`/product/${product.id}`);
  };



  return (
    <div 
      className="group relative flex flex-col bg-transparent transition-all duration-500 cursor-pointer"
      onClick={handleCardClick}
    >

      {/* ── Image Container - Professional 4:3 Aspect Ratio ── */}
      <Link
        href={`/product/${product.id}`}
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



        {/* Subtle Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none" />
      </Link>

      {/* ── Product Info - High-Density Minimalist ── */}
      <div className="flex flex-col p-3 sm:p-4 space-y-3">
        <div className="flex flex-col space-y-1">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-heading font-semibold text-sm sm:text-lg text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300 tracking-tight min-h-[40px]">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-heading font-black text-foreground tracking-tighter">
                {product.price.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                DT
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              aria-label={t('product.addToCartAria', { productName: product.name })}
              className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 shadow-sm ${isAdding
                  ? 'bg-success text-white scale-90'
                  : 'bg-primary text-white hover:bg-black hover:scale-110 active:scale-95'
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
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;