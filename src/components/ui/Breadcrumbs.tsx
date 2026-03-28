'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar_tn';

  return (
    <nav className="flex mb-6 overflow-x-auto no-scrollbar py-1" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 md:space-x-4">
        <li className="flex items-center">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <Icon name="HomeIcon" size={16} />
            <span className="hidden sm:inline">{t('nav.home')}</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <Icon 
              name={isRtl ? "ChevronLeftIcon" : "ChevronRightIcon"} 
              size={14} 
              className="text-muted-foreground/40 mx-1 md:mx-2" 
            />
            {item.href ? (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium whitespace-nowrap"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-black text-sm whitespace-nowrap tracking-tight uppercase" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
