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
      className="group block bg-card rounded-xl overflow-hidden shadow-warm hover-lift"
    >
      <div className="relative h-48 overflow-hidden">
        <AppImage
          src={image}
          alt={alt}
          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-heading font-semibold text-primary-foreground mb-1">
            {name}
          </h3>
          <p className="caption text-primary-foreground/90">
            {productCount} produits
          </p>
        </div>
      </div>

      <div className="p-4">
        <p className="text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-2 text-primary font-medium">
          <span>Découvrir</span>
          <Icon name="ArrowRightIcon" size={16} className="transition-smooth group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;