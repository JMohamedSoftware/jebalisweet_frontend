'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';
import Icon from '@/components/ui/AppIcon';
import FilterPanel from './FilterPanel';
import SortControls from './SortControls';
import ProductGrid from './ProductGrid';
import QuickViewModal from './QuickViewModal';
import LoadingSkeleton from './LoadingSkeleton';
import { useLanguage } from '@/context/LanguageContext';
import { CATEGORY_ALL, ITEMS_PER_PAGE } from '@/constants';
import { formatPrice } from '@/utils/format';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  inStock: boolean;
  stockQuantity?: number;
  priceUnit?: string;
}

interface ProductCatalogInteractiveProps {
  initialData?: {
    products: Product[];
    categories: string[];
    brands: string[];
    maxPrice: number;
    totalPages: number;
    total: number;
  };
}

const ProductCatalogInteractive = ({ initialData }: ProductCatalogInteractiveProps) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [isHydrated, setIsHydrated] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialData?.products || []);
  const [categories, setCategories] = useState<string[]>(initialData?.categories || []);
  const [brands, setBrands] = useState<string[]>(initialData?.brands || []);
  const [maxPrice, setMaxPrice] = useState(initialData?.maxPrice || 100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [responseTotal, setResponseTotal] = useState(initialData?.total || 0);
  const ITEMS_PER_PAGE = 8;

  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_ALL);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, initialData?.maxPrice || 100]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQuery, setSearchQuery] = useState('');

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (hasInitialized.current) return;
    const categoryParam = searchParams.get('category');
    const pageParam = searchParams.get('page');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (pageParam) {
      const p = parseInt(pageParam);
      if (!isNaN(p)) setCurrentPage(p);
    }
    hasInitialized.current = true;
  }, [searchParams]);

  useEffect(() => {
    if (isHydrated) {
      const params = new URLSearchParams();
      if (selectedCategory !== CATEGORY_ALL) params.set('category', selectedCategory);
      if (currentPage > 1) params.set('page', currentPage.toString());
      const queryString = params.toString();
      router.replace(queryString ? `/product-catalog?${queryString}` : '/product-catalog', { scroll: false });
    }
  }, [selectedCategory, currentPage, isHydrated, router]);

  useEffect(() => {
    const loadData = async () => {
      // Skip fetching on mount if we already have initial data
      if (isFirstRender.current && initialData) {
        isFirstRender.current = false;
        setIsHydrated(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const filters = {
          category: selectedCategory,
          brands: selectedBrands,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          inStock: showInStockOnly,
          sortBy: sortBy,
          search: searchQuery
        };
        const response = await api.products.getAll(currentPage, ITEMS_PER_PAGE, filters);
        setProducts(response.products.map((p: any) => ({
          ...p,
          id: (p._id || p.id).toString(),
          stockQuantity: Math.max(0, p.stockQuantity ?? p.stock_quantity ?? 0),
          inStock: (p.stockQuantity ?? p.stock_quantity ?? 0) > 0,
          category: p.categoryName || (p.category && p.category.name) || p.category,
          priceUnit: p.priceUnit || 'pièce',
        })));
        setTotalPages(response.totalPages || 1);
        setResponseTotal(response.total || 0);

        if (categories.length === 0) {
          const [cats, metadata] = await Promise.all([api.categories.getAll(), api.products.getMetadata()]);
          setCategories(cats.map((c: any) => c.name));
          setBrands(metadata.brands || []);
          setMaxPrice(metadata.maxPrice || 100);
          setPriceRange([0, metadata.maxPrice || 100]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsHydrated(true);
        setIsLoading(false);
        isFirstRender.current = false;
      }
    };
    loadData();
  }, [currentPage, selectedCategory, selectedBrands, priceRange, showInStockOnly, sortBy, searchQuery, initialData]);

  const handleAddToCart = async (product: Product) => {
    if (!localStorage.getItem('user')) {
      router.push('/login');
      return;
    }
    try {
      await api.cart.add(product.id, 1);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error: any) {
      console.error('Cart error:', error);
      if (error.message.includes('Token') || error.message.includes('Accès refusé')) {
        alert("Votre session a expiré. Veuillez vous reconnecter.");
        router.push('/login');
      } else {
        alert(`Erreur: ${error.message || 'Impossible d\'ajouter au panier'}`);
      }
    }
  };

  if (!isHydrated && !initialData) return <LoadingSkeleton />;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-2">{t('catalog.title')}</h1>
        <p className="text-muted-foreground">{t('catalog.subtitle')}</p>
      </div>

      <div className="mb-6">
        <SortControls
          sortBy={sortBy}
          onSortChange={(s) => { setSortBy(s); setCurrentPage(1); }}
          onToggleFilters={() => setIsMobileFiltersOpen(true)}
          isMobileFiltersOpen={isMobileFiltersOpen}
          searchQuery={searchQuery}
          onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        />
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <aside className="hidden lg:block">
          <FilterPanel
            categories={categories} brands={brands} selectedCategory={selectedCategory}
            selectedBrands={selectedBrands} priceRange={priceRange} maxPrice={maxPrice}
            showInStockOnly={showInStockOnly}
            onCategoryChange={(cat) => { setSelectedCategory(cat); setCurrentPage(1); }}
            onBrandToggle={(b) => { setSelectedBrands(prev => prev.includes(b) ? prev.filter(i => i !== b) : [...prev, b]); setCurrentPage(1); }}
            onPriceRangeChange={setPriceRange} onStockToggle={() => setShowInStockOnly(!showInStockOnly)}
            onClearFilters={() => { setSelectedCategory(CATEGORY_ALL); setSelectedBrands([]); setPriceRange([0, maxPrice]); }}
            resultCount={responseTotal}
          />
        </aside>

        <main>
          {selectedCategory === t('product.customCakeCategory') && (
            <div className="mb-10 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 border border-primary/20 flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-top duration-700">
              <div className="flex-1 space-y-4">
                <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full">{t('catalog.customCake.exclusive')}</span>
                <h2 className="text-3xl font-heading font-bold text-foreground">{t('catalog.customCake.title')}</h2>
                <p className="text-muted-foreground text-lg">{t('catalog.customCake.subtitle')}</p>
                <button onClick={() => router.push('/custom-cake')} className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  {t('catalog.customCake.cta')}
                </button>
              </div>
              <div className="w-48 h-48 hidden md:block">
                <img src="/images/17189029461596829888opals_3200x1200.jpg" className="w-full h-full object-cover rounded-2xl shadow-xl rotate-3" alt="Custom" />
              </div>
            </div>
          )}

          {isLoading ? <LoadingSkeleton /> : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                <ProductGrid products={products} onAddToCart={handleAddToCart} onQuickView={setSelectedProduct} />
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setCurrentPage(p)} className={`w-10 h-10 rounded-lg transition-smooth hover:scale-105 active:scale-95 ${currentPage === p ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'bg-background border border-border text-muted-foreground hover:border-primary hover:text-primary'}`}>{p}</button>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="relative w-full max-w-[320px] ml-auto bg-card h-full shadow-warm-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-heading text-xl font-bold text-foreground">{t('catalog.filters.title')}</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-smooth"
              >
                <Icon name="XMarkIcon" size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <FilterPanel
                categories={categories} brands={brands} selectedCategory={selectedCategory}
                selectedBrands={selectedBrands} priceRange={priceRange} maxPrice={maxPrice}
                showInStockOnly={showInStockOnly}
                onCategoryChange={(cat) => { setSelectedCategory(cat); }}
                onBrandToggle={(b) => setSelectedBrands(prev => prev.includes(b) ? prev.filter(i => i !== b) : [...prev, b])}
                onPriceRangeChange={setPriceRange} onStockToggle={() => setShowInStockOnly(!showInStockOnly)}
                onClearFilters={() => { setSelectedCategory(CATEGORY_ALL); setSelectedBrands([]); setPriceRange([0, maxPrice]); }}
                resultCount={responseTotal}
              />
            </div>

            <div className="p-4 border-t border-border bg-card">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all text-lg"
              >
                Voir {responseTotal} produits
              </button>
            </div>
          </div>
        </div>
      )}

      <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} />
    </div>
  );
};

export default ProductCatalogInteractive;