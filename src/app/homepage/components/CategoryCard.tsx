import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  productCount: number;
}

const CategoryCard = ({ name, description, image, alt, productCount }: CategoryCardProps) => {
  return (
    <Link
      href={`/product-catalog?category=${encodeURIComponent(name)}`}
      className="group relative block aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-2xl border border-border/10 bg-muted/20 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110">
        <AppImage
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 33vw, 30vw"
          className="object-cover"
        />
      </div>

      {/* Layered Overlays for Depth and Readability - Lightened */}
      {/* 1. Remove base dark overlay to keep image bright */}
      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500 z-1" />
      
      {/* 2. Very subtle Text Support Gradient (Bottom only) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-2 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Content Overlay - Immersive Typography */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-8 space-y-3">
        
        {/* Subtle Product Count */}
        <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <span className="px-3 py-1 bg-primary text-black font-black text-[9px] uppercase tracking-[0.2em] rounded-sm shadow-xl">
             {productCount} {productCount > 1 ? 'Créations' : 'Création'}
          </span>
        </div>

        <div className="space-y-1 transform transition-transform duration-500 group-hover:-translate-y-1">
          <h3 className="font-heading font-black text-white text-2xl sm:text-3xl lg:text-4xl leading-[0.9] tracking-tighter uppercase drop-shadow-2xl">
            {name}
          </h3>
          <p className="text-white/80 text-[11px] sm:text-[13px] line-clamp-2 leading-relaxed font-serif italic max-w-[90%] transition-opacity duration-500">
            {description}
          </p>
        </div>

        {/* Hover Action Indicator */}
        <div className="flex items-center gap-3 pt-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
          <span className="text-primary font-black text-[9px] sm:text-[10px] uppercase tracking-[0.4em]">Explorer l'univers</span>
          <div className="h-[1px] w-8 bg-primary/40 group-hover:w-16 transition-all duration-500" />
        </div>
      </div>

      {/* Luxury Border Animation (on hover) */}
      <div className="absolute inset-3 border border-white/0 group-hover:border-white/10 transition-all duration-1000 z-5 pointer-events-none" />

    </Link>
  );
};

export default CategoryCard;