import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  productCount: number;
}

const CategoryCard = ({ id, name, description, image, alt, productCount }: CategoryCardProps) => {
  return (
    <Link
      href={`/product-catalog?category=${encodeURIComponent(name)}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-warm hover-lift border border-border/50"
    >
      <div className="relative h-24 sm:h-32 md:h-48 overflow-hidden">
        <AppImage
          src={image}
          alt={alt}
          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4">
          <h3 className="text-xs sm:text-lg md:text-2xl font-heading font-semibold text-primary-foreground mb-0.5 line-clamp-1">
            {name}
          </h3>
          <p className="text-[10px] md:caption text-primary-foreground/90">
            {productCount} <span className="hidden sm:inline">produits</span>
          </p>
        </div>
      </div>

      <div className="p-2 md:p-4">
        <p className="hidden md:block text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-1 md:gap-2 text-primary font-medium text-[10px] sm:text-sm md:text-base">
          <span className="truncate">Découvrir</span>
          <Icon name="ArrowRightIcon" size={12} className="shrink-0 transition-smooth group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;