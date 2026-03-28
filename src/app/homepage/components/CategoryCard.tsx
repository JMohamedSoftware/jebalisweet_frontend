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
      className="group relative flex flex-col bg-transparent transition-all duration-500 overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-2xl border border-border/5 mb-4 group-hover:shadow-lg transition-all duration-500">
        <AppImage
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 33vw, 30vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Subtle Product Count - High Level styling */}
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xl text-foreground font-medium text-[9px] sm:text-xs tracking-wider border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
          {productCount}
        </div>
      </div>

      {/* Content - Below Image */}
      <div className="flex flex-col space-y-2 p-1">
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-foreground text-lg sm:text-2xl leading-tight tracking-wide group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-muted-foreground text-[11px] sm:text-[13px] line-clamp-2 leading-relaxed font-light">
            {description}
          </p>
        </div>

        {/* Action Indicator */}
        <div className="flex items-center gap-2 pt-1 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-[0.15em] transition-all duration-300">
          <span>Découvrir</span>
          <div className="h-px w-6 bg-primary/30 group-hover:bg-primary group-hover:w-10 transition-all duration-300" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;