import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ProductDetailInteractive from './components/ProductDetailInteractive';
import DiscoveryGrid from '../components/DiscoveryGrid';
import Link from 'next/link';
import { api } from '@/services/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  let product = null;
  let discoveryProducts = [];
  
  try {
    // 1. Attempt to fetch primary product and enforce branded loading delay
    const [fetchedProduct] = await Promise.all([
      api.products.getById(id),
      delay(500) // Branded intro delay
    ]);
    product = fetchedProduct;
    
    if (product) {
      product = {
        ...product,
        id: (product._id || product.id).toString()
      };
    } else {
      // 2. If not found, fetch discovery products (limit 4)
      const res = await api.products.getAll(1, 4);
      discoveryProducts = (res.products || []).map((p: any) => ({
        ...p,
        id: (p._id || p.id).toString()
      }));
    }
  } catch (error) {
    console.error('Failed to fetch product data:', error);
    // Fallback discovery products
    try {
      const res = await api.products.getAll(1, 4);
      discoveryProducts = (res.products || []).map((p: any) => ({
        ...p,
        id: (p._id || p.id).toString()
      }));
    } catch (e) {}
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] relative overflow-hidden flex flex-col">
        <Header />
        
        {/* Background Layer: Unified Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />

        {/* Subtle Logo Watermark - Replaces "OUPS" */}
        <div className="absolute inset-0 pointer-events-none z-0 flex flex-col justify-center items-center opacity-5">
           <img src="/images/jebali_sweet_logo.png" alt="" className="w-96 h-96 object-contain filter grayscale" />
        </div>

        <main className="flex-grow flex flex-col items-center relative z-10 px-6 pt-32 pb-24">
          <div className="max-w-4xl w-full text-center space-y-10 animate-fade-in">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center mx-auto">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 border-b border-foreground/10 pb-2">Information</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-heading font-light text-foreground uppercase tracking-[0.1em]">
                Création <br />
                <span className="text-primary font-serif italic capitalize">Indisponible</span>
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed max-w-md mx-auto italic font-serif">
              "Il semblerait que cette douceur ait déjà trouvé preneur, ou qu'elle ne soit pas disponible pour le moment."
            </p>

            <div className="pt-6 flex justify-center">
              <Link
                href="/product-catalog"
                className="group relative overflow-hidden px-14 py-4 border border-foreground/10 text-foreground rounded-full font-bold text-[10px] uppercase tracking-[0.3em] transition-all duration-500 hover:border-primary hover:text-white"
              >
                <span className="relative z-10 transition-colors duration-500">Retour au Catalogue</span>
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
              </Link>
            </div>

            <div className="pt-16 sm:pt-24 text-left">
              <div className="flex flex-col items-center text-center mb-10">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-3">Laissez-vous tenter</span>
                 <h2 className="text-2xl font-heading font-black text-foreground">Découvrez d'autres délices</h2>
                 <div className="h-[1px] w-12 bg-border mt-4" />
              </div>

            {/* Discovery Section - The "Details of each product" the user wanted */}
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <DiscoveryGrid products={discoveryProducts} />
            </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        <ProductDetailInteractive product={product} />
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
