'use client';

import React from 'react';
import AppImage from '@/components/ui/AppImage';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

import { Product } from '@/types/product';
import { formatPrice } from '@/utils/format';

interface DiscoveryGridProps {
  products: Product[];
}

const DiscoveryGrid = ({ products }: DiscoveryGridProps) => {
  const { addItem } = useCart();

  if (!products || products.length === 0) return null;

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  return (
    <div className="w-full mt-24 animate-fade-in-up">
      {/* Maison Turki Style Separator & Title */}
      <div className="w-full border-t border-black/5 pt-16 mb-16 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-heading text-foreground tracking-[0.05em] text-center mb-12">
           Nos Incontournables
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {products.map((product) => (
          <div key={product.id} className="group flex flex-col items-center text-center space-y-4">
            {/* Clean Square Image Container */}
            <Link 
              href={`/product/${product.id}`}
              className="relative w-full aspect-square overflow-hidden bg-[#f4f4f4] rounded-sm transition-all duration-700"
            >
              <AppImage 
                src={product.image} 
                alt={product.alt || product.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Subtle Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
            </Link>

            {/* Typography in 'Maison Turki' style */}
            <div className="flex flex-col items-center space-y-1 px-2">
              <Link href={`/product/${product.id}`}>
                <h3 className="text-[13px] md:text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <span className="text-[10px] md:text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-light">
                {product.category || 'Pâtisserie Fine'}
              </span>
              
              <div className="pt-2 flex items-baseline justify-center gap-1">
                <span className="text-lg md:text-xl font-heading font-black text-foreground tracking-tight">
                  {formatPrice(product.price).replace(' DT', '')}
                </span>
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
                  DT
                </span>
                <span className="text-[9px] text-muted-foreground ml-1 font-light italic">
                   / Pièce
                </span>
              </div>
            </div>

            {/* Add to Cart - Minimal Text Link or Button */}
            <button
               onClick={() => handleAddToCart(product)}
               disabled={!product.inStock}
               className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-foreground border-b border-primary/20 pb-0.5 transition-all mt-2"
            >
               {product.inStock ? 'Ajouter au Panier' : 'Indisponible'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoveryGrid;
