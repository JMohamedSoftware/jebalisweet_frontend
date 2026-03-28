'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const BreadcrumbTrail = () => {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const isRtl = language === 'ar_tn';

  if (pathname === '/' || pathname === '/homepage') {
    return null;
  }

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t('nav.home'), path: '/' },
    ];

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      
      // Use translation keys based on path
      let label = path;
      if (currentPath === '/product-catalog') label = t('nav.products');
      else if (currentPath === '/shopping-cart') label = t('cart.title');
      else if (currentPath === '/checkout-payment') label = t('checkout.title');
      else if (currentPath === '/user-profile') label = t('nav.account');
      else if (currentPath === '/orders') label = t('nav.orders');
      else if (currentPath === '/login') label = t('nav.login');
      else if (currentPath === '/register') label = t('auth.register.title');
      else if (currentPath === '/terms') label = t('nav.terms') || 'Terms';
      else if (currentPath === '/privacy') label = t('nav.privacy') || 'Privacy';
      else if (currentPath.startsWith('/admin')) label = t('nav.admin');

      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav
      aria-label="Breadcrumb"
      className="py-4 px-6 bg-background border-b border-border/5"
    >
      <div className="container mx-auto">
        <ol className="flex items-center gap-2 text-sm flex-wrap">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const isFirst = index === 0;

            return (
              <li key={crumb.path} className="flex items-center gap-2">
                {!isFirst && (
                  <Icon
                    name={isRtl ? "ChevronLeftIcon" : "ChevronRightIcon"}
                    size={14}
                    className="text-muted-foreground/40"
                  />
                )}
                {isLast ? (
                  <span className="font-semibold text-foreground">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {isFirst && <Icon name="HomeIcon" size={14} className="opacity-70" />}
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default BreadcrumbTrail;