'use client';

import React from 'react';
import { CATEGORY_ALL } from '@/constants';
import { useLanguage } from '@/context/LanguageContext';

interface CategoryScrollProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryScroll = ({ categories, selectedCategory, onCategoryChange }: CategoryScrollProps) => {
  const { t } = useLanguage();

  return (
    <div className="lg:hidden w-full overflow-x-auto no-scrollbar -mx-4 px-4 py-4 mb-4 sticky top-[104px] z-20 bg-background/60 backdrop-blur-xl border-b border-border/5">
      <div className="flex gap-3 min-w-max">
        <button
          onClick={() => onCategoryChange(CATEGORY_ALL)}
          className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 border ${
            selectedCategory === CATEGORY_ALL
              ? 'bg-primary border-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-105'
              : 'bg-white/40 border-border/10 text-muted-foreground/60 hover:bg-white hover:text-primary active:scale-95'
          }`}
        >
          {t('catalog.filters.all')}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 border whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-primary border-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-105'
                : 'bg-white/40 border-border/10 text-muted-foreground/60 hover:bg-white hover:text-primary active:scale-95'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;
