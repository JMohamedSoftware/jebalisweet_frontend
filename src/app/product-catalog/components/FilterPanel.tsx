'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CATEGORY_ALL } from '@/constants';
import { formatPrice } from '@/utils/format';

interface FilterPanelProps {
  categories: string[];
  brands: string[];
  selectedCategory: string;
  selectedBrands: string[];
  priceRange: [number, number];
  maxPrice: number;
  showInStockOnly: boolean;
  onCategoryChange: (category: string) => void;
  onBrandToggle: (brand: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onStockToggle: () => void;
  onClearFilters: () => void;
  resultCount: number;
}

const FilterPanel = ({
  categories,
  brands,
  selectedCategory,
  selectedBrands,
  priceRange,
  maxPrice,
  showInStockOnly,
  onCategoryChange,
  onBrandToggle,
  onPriceRangeChange,
  onStockToggle,
  onClearFilters,
  resultCount,
}: FilterPanelProps) => {
  const { t } = useLanguage();



  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onPriceRangeChange([0, value]);
  };

  return (
    <div className="bg-card rounded-lg shadow-warm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          {t('catalog.filters.title')}
        </h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary hover:underline focus:outline-none focus:ring-3 focus:ring-ring rounded"
        >
          {t('catalog.filters.reset')}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-foreground mb-3">
            {t('catalog.filters.categories')} ({resultCount})
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange(CATEGORY_ALL)}
              className={`px-4 py-2 rounded-full transition-smooth font-medium caption ${selectedCategory === CATEGORY_ALL
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted-foreground/10'
                }`}
            >
              {t('catalog.filters.all')}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 rounded-full transition-smooth font-medium caption ${selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted-foreground/10'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold text-foreground mb-3">{t('catalog.filters.price')}</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Max: {formatPrice(priceRange[1])}</span>
              </div>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={handleMaxPriceChange}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                aria-label="Prix maximum"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold text-foreground mb-3">{t('catalog.filters.brands')}</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => onBrandToggle(brand)}
                  className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-3 focus:ring-ring cursor-pointer"
                />
                <span className="text-foreground group-hover:text-primary transition-smooth">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={showInStockOnly}
              onChange={onStockToggle}
              className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-3 focus:ring-ring cursor-pointer"
            />
            <span className="text-foreground group-hover:text-primary transition-smooth font-medium">
              {t('catalog.filters.stockOnly')}
            </span>
          </label>
        </div>

      </div>
    </div>
  );
};

export default FilterPanel;