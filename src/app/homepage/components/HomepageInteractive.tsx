'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import CategoryCard from './CategoryCard';
import ProductCard from './ProductCard';
import TestimonialCard from './TestimonialCard';
import PromotionalBanner from './PromotionalBanner';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/utils/format';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  productCount: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  category: string;
  inStock: boolean;
  stockQuantity?: number;
}

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
}

interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  discount: string;
  active: boolean;
}

const HomepageInteractive = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [isHydrated, setIsHydrated] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activePromotion, setActivePromotion] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, productsData, testimonialsData, promoData] = await Promise.all([
          api.categories.getAll(),
          api.products.getAll(1, 6, { featured: true }),
          api.testimonials.getAll().catch(() => []), // Fallback to empty if fails
          api.promotions.getActive().catch(() => null)
        ]);

        const testimonialsArray = Array.isArray(testimonialsData) ? testimonialsData : (testimonialsData.testimonials || []);

        const productsArray = Array.isArray(productsData) ? productsData : (productsData.products || []);
        const prods = productsArray;

        const mappedCategories = cats.map((c: any) => ({
          id: c.id || c._id,
          name: c.name,
          description: c.description || t('home.categories.descriptionDefault', { category: c.name }),
          image: c.image || "/images/portioned-chocolate-cake-garnished-with-berries-chocolate.jpg",
          alt: c.name,
          productCount: c.productCount || 0
        }));

        setCategories(mappedCategories);

        const mappedProducts = prods.map((p: any) => ({
          ...p,
          id: p.id || p._id,
          stockQuantity: Math.max(0, p.stockQuantity ?? p.stock_quantity ?? 0),
          inStock: (p.stockQuantity ?? p.stock_quantity ?? 0) > 0,
          category: p.categoryName || (p.category && p.category.name) || "Général",
        }));
        setFeaturedProducts(mappedProducts);
        setTestimonials(testimonialsArray);
        setActivePromotion(promoData);

      } catch (error) {
        console.error("Failed to fetch homepage data", error);
      } finally {
        setIsHydrated(true);
        setIsLoading(false);
      }
    };

    loadData();
  }, [t]);


  const handleAddToCart = async (product: any) => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      await api.cart.add(product.id, 1);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error: any) {
      console.error('Error adding to backend cart:', error);
      if (error.message.includes('Token') || error.message.includes('Accès refusé')) {
        alert("Votre session a expiré. Veuillez vous reconnecter.");
        router.push('/login');
      } else {
        alert(`Erreur: ${error.message || 'Problème de connexion au panier'}`);
      }
    }
  };

  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium animate-pulse">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 space-y-16">
        <HeroSection
          title={t('home.hero.title')}
          subtitle={t('home.hero.subtitle')}
          ctaText={t('home.hero.cta')}
          ctaLink="/product-catalog"
          backgroundImage="/images/17189029461596829888opals_3200x1200.jpg"
          backgroundAlt="Hero Background" />


        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              {t('home.categories.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
            {categories.length > 0 ? (
              categories.map((category, index) =>
                <div
                  key={category.id}
                  className="animate-in fade-in slide-in-from-bottom duration-700 fill-mode-both"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CategoryCard {...category} />
                </div>
              )
            ) : (
              <p className="text-center col-span-3 text-muted-foreground">{t('home.categories.empty')}</p>
            )}
          </div>
        </section>

        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              {t('home.featured.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.featured.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) =>
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onQuickView={() => router.push(`/product-catalog?category=${product.category}`)} />
              )
            ) : (
              <p className="text-center w-full text-muted-foreground">{t('home.featured.empty')}</p>
            )}
          </div>
        </section>

        {activePromotion && (
          <PromotionalBanner
            title={activePromotion.title}
            description={activePromotion.subtitle}
            ctaText={activePromotion.ctaText}
            ctaLink={activePromotion.ctaLink}
            backgroundImage={activePromotion.backgroundImage}
            backgroundAlt={activePromotion.title}
            discount={activePromotion.discount} />
        )}


        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  name={testimonial.name}
                  location={testimonial.location}
                  rating={testimonial.rating}
                  comment={testimonial.comment}
                  date={testimonial.date}
                />
              ))
            ) : (
              <p className="text-center col-span-full text-muted-foreground">{t('home.testimonials.empty')}</p>
            )}
          </div>
        </section>

      </div >
    </div >
  );
};

export default HomepageInteractive;