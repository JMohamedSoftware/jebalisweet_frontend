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

  const routeLabels: Record<string, string> = {
    '/homepage': 'Accueil',
    '/product-catalog': 'Produits',
    '/shopping-cart': 'Panier',
    '/login': 'Connexion',
    '/register': 'Inscription',
    '/profile': 'Mon Profil',
    '/user-profile': 'Mon Profil',
    '/orders': 'Mes Commandes',
    '/admin': 'Administration',
    '/admin-dashboard': 'Tableau de Bord Admin',
    '/admin-product-management': 'Gestion des Produits',
    '/admin-order-management': 'Gestion des Commandes',
    '/checkout-payment': 'Paiement',
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Accueil', path: '/' },
    ];

    if (pathname === '/homepage') {
      return breadcrumbs;
    }

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const label = routeLabels[currentPath] || path;
      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Fil d'Ariane"
      className="py-4 px-6 bg-background"
    >
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isFirst = index === 0;

          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {!isFirst && (
                <Icon
                  name="ChevronRightIcon"
                  size={16}
                  className="text-muted-foreground"
                />
              )}
              {isLast ? (
                <span className="font-medium text-foreground caption">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="text-muted-foreground hover:text-primary transition-smooth caption"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbTrail;