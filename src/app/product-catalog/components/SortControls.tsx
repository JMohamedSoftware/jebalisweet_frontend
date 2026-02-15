'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Icon from '@/components/ui/AppIcon';

interface SortControlsProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  onToggleFilters: () => void;
  isMobileFiltersOpen: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SortControls = ({
  sortBy,
  onSortChange,
  onToggleFilters,
  isMobileFiltersOpen,
  searchQuery,
  onSearchChange,
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
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card rounded-2xl shadow-warm p-4 border border-border/50">
      <div className="flex items-center gap-2 flex-1 relative group">
        <div className="absolute left-4 text-muted-foreground group-focus-within:text-primary transition-colors">
          <Icon name="MagnifyingGlassIcon" size={20} />
        </div>
        <input
          type="text"
          placeholder={t('catalog.searchPlaceholder') || "Rechercher un délice..."}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleFilters}
          className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20 font-bold"
        >
          <Icon name="AdjustmentsHorizontalIcon" size={20} />
          <span>Filtres</span>
        </button>

        <div className="flex items-center gap-3 min-w-[200px]">
          <label htmlFor="sort-select" className="text-sm font-bold text-muted-foreground uppercase tracking-wider hidden sm:block whitespace-nowrap">
            {t('catalog.sort.label') || "Trier par:"}
          </label>
          <div className="relative flex-1">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 cursor-pointer font-bold appearance-none transition-all"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <Icon name="ChevronDownIcon" size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortControls;