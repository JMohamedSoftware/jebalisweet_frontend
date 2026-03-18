import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BreadcrumbTrail from '@/components/common/BreadcrumbTrail';
import ProductCatalogInteractive from './components/ProductCatalogInteractive';
import LoadingSkeleton from './components/LoadingSkeleton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Catalogue Pâtisserie & Chocolaterie - Jebali Sweet',
  description: 'Découvrez notre collection complète : chocolats artisanaux, gâteaux personnalisés sur mesure et salés raffinés. Achetez en ligne vos gourmandises préférées de chez Chef Aida Jebali.',
};

async function getInitialData(params: { [key: string]: string | string[] | undefined }) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://jebalisweet-backend.onrender.com/api';

  const page = params.page ? Number(params.page) : 1;
  const category = params.category as string | undefined;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: '8',
  });
  if (category) queryParams.append('category', category);

  try {
    const [productsRes, categoriesRes, metadataRes] = await Promise.all([
      fetch(`${apiBaseUrl}/products?${queryParams.toString()}`, {
        cache: 'no-store',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      }),
      fetch(`${apiBaseUrl}/categories`, {
        cache: 'no-store',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      }),
      fetch(`${apiBaseUrl}/products/metadata`, {
        cache: 'no-store',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
    ]);

    if (!productsRes.ok || !categoriesRes.ok || !metadataRes.ok) {
      return null;
    }

    const productsData = await productsRes.json();
    const categoriesData = await categoriesRes.json();
    const metadataData = await metadataRes.json();

    return {
      products: (productsData.products || []).map((p: any) => ({
        ...p,
        id: (p._id || p.id).toString(),
        stockQuantity: Math.max(0, p.stockQuantity ?? p.stock_quantity ?? 0),
        inStock: (p.stockQuantity ?? p.stock_quantity ?? 0) > 0,
        category: p.categoryName || (p.category && p.category.name) || p.category,
        priceUnit: p.priceUnit || 'pièce',
      })),
      categories: categoriesData.map((c: any) => c.name),
      brands: metadataData.brands || [],
      maxPrice: metadataData.maxPrice || 100,
      totalPages: productsData.totalPages || 1,
      total: productsData.total || 0
    };
  } catch (error) {
    console.error('SSR Fetch Error:', error);
    return null;
  }
}

export default async function ProductCatalogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const initialData = await getInitialData(searchParams);

  return (
    <>
      <Header />
      <BreadcrumbTrail />
      <Suspense fallback={
        <div className="container mx-auto px-6 py-8">
          <LoadingSkeleton />
        </div>
      }>
        <ProductCatalogInteractive initialData={initialData || undefined} />
      </Suspense>
    </>
  );
}