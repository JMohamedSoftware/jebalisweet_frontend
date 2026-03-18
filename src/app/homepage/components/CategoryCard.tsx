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
      className="group relative block overflow-hidden rounded-2xl shadow-warm-md border border-white/10 transition-all duration-500 hover:shadow-warm-xl"
      style={{ minHeight: '220px' }}
    >
      {/* Background Image - with a subtle overlay for text readability */}
      <div className="absolute inset-0">
        <AppImage
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 33vw, 30vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Ombre légère uniquement en bas pour rendre le texte lisible, l'image reste très lumineuse */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 group-hover:h-2/3" />
      </div>

      {/* Content - Sophisticated and Minimalist */}
      <div className="relative flex flex-col justify-end h-full p-4 sm:p-6" style={{ minHeight: '220px' }}>

        {/* Subtle Product Count - "High Level" styling */}
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/5 backdrop-blur-xl text-white font-medium text-[9px] sm:text-xs tracking-wider border border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          {productCount} CRÉATIONS
        </div>

        <div className="space-y-1.5 sm:space-y-2 transform transition-transform duration-500 group-hover:-translate-y-1">
          <h3 className="font-heading font-bold text-white text-base sm:text-2xl leading-tight tracking-wide drop-shadow-md">
            {name}
          </h3>
          <p className="text-white/80 text-[10px] sm:text-[13px] line-clamp-2 leading-relaxed font-sans max-w-[90%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
            {description}
          </p>
        </div>

        {/* Action Indicator - "Classy" arrow */}
        <div className="flex items-center gap-2 mt-3 sm:mt-5 text-accent font-bold text-[10px] sm:text-sm uppercase tracking-[0.15em] transition-all duration-300 group-hover:text-white">
          <span>Découvrir</span>
          <div className="h-px w-6 bg-accent group-hover:bg-white group-hover:w-10 transition-all duration-300" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;