'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Icon from '@/components/ui/AppIcon';

interface SortControlsProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  onToggleFilters: () => void;
  isMobileFiltersOpen: boolean;
}

const SortControls = ({
  sortBy,
  onSortChange,
  onToggleFilters,
  isMobileFiltersOpen,
}: SortControlsProps) => {
  const { t } = useLanguage();

  const sortOptions = [
    { value: 'relevance', label: t('catalog.sort.relevance') },
    { value: 'price-asc', label: t('catalog.sort.priceAsc') },
    { value: 'price-desc', label: t('catalog.sort.priceDesc') },
    { value: 'newest', label: t('catalog.sort.newest') },
    { value: 'bestsellers', label: t('catalog.sort.bestsellers') },
  ];

  return (
    <div className="flex items-center justify-between gap-4 bg-card rounded-lg shadow-warm p-4">
      <button
        onClick={onToggleFilters}
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg transition-smooth hover:opacity-90 focus:outline-none focus:ring-3 focus:ring-ring font-medium"
      >
        <Icon name="AdjustmentsHorizontalIcon" size={20} />
        <span>Filtres</span>
      </button>

      <div className="flex items-center gap-3 flex-1 justify-end">
        <label htmlFor="sort-select" className="text-sm font-medium text-foreground hidden sm:block">
          Trier par:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 bg-background border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-3 focus:ring-ring cursor-pointer font-medium"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SortControls;