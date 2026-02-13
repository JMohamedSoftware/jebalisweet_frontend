import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BreadcrumbTrail from '@/components/common/BreadcrumbTrail';
import ProductCatalogInteractive from './components/ProductCatalogInteractive';
import LoadingSkeleton from './components/LoadingSkeleton';

export const metadata: Metadata = {
  title: 'Catalogue de Produits - Jebali Sweet',
  description: 'Découvrez notre collection complète de douceurs orientales authentiques. Parcourez nos pâtisseries, confiseries et biscuits traditionnels avec filtres par catégorie, prix et marque.',
};

export default function ProductCatalogPage() {
  return (
    <>
      <Header />
      <BreadcrumbTrail />
      <Suspense fallback={
        <div className="container mx-auto px-6 py-8">
          <LoadingSkeleton />
        </div>
      }>
        <ProductCatalogInteractive />
      </Suspense>
    </>
  );
}