'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import ThematicCategorySection from './ThematicCategorySection';
import CategoryCard from './CategoryCard';
import ProductCard from './ProductCard';
import TestimonialCard from './TestimonialCard';
import PromotionalBanner from './PromotionalBanner';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/utils/format';
import PageLoader from '@/components/ui/PageLoader';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  productCount: number;
}

import { Product } from '@/types/product';

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
  const [heroes, setHeroes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Force scroll to top on mount to fix refresh issue
  useEffect(() => {
    window.scrollTo(0, 0);
    // As a backup for slower loading content
    const timeoutId = setTimeout(() => window.scrollTo(0, 0), 100);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, productsData, testimonialsData, promoData, heroData] = await Promise.all([
          api.categories.getAll(),
          api.products.getAll(1, 20),
          api.testimonials.getAll().catch(() => []), 
          api.promotions.getActive().catch(() => null),
          api.hero.getSlides().catch(() => null)
        ]);

        const testimonialsArray = Array.isArray(testimonialsData) ? testimonialsData : (testimonialsData.testimonials || []);

        const productsArray = Array.isArray(productsData) ? productsData : (productsData.products || []);
        const prods = productsArray;

        const mappedCategories = cats.map((c: any) => ({
          id: c.id || c._id,
          name: c.name,
          description: c.description || t('home.categories.descriptionDefault', { category: c.name }),
          image: c.image || "/images/17189029461596829888opals_3200x1200.jpg",
          alt: c.name,
          productCount: c.productCount || 0
        }));

        setCategories(mappedCategories);

        const mappedProducts = prods.map((p: any) => ({
          ...p,
          id: p.id || p._id,
          inStock: true,
          category: p.categoryName || (p.category && p.category.name) || "Général",
        }));
        setFeaturedProducts(mappedProducts);
        setTestimonials(testimonialsArray);
        setActivePromotion(promoData);
        // Support both array (multi-slide) and single object (legacy)
        if (Array.isArray(heroData)) {
          setHeroes(heroData);
        } else if (heroData) {
          setHeroes([heroData]);
        }

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
        alert(t('cart.errors.sessionExpired'));
        router.push('/login');
      } else {
        alert(t('cart.errors.addError', { message: error.message || t('common.error') }));
      }
    }
  };

  if (!isHydrated || isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col">
        <HeroSection
          heroes={heroes.length > 0 ? heroes : [{
            title: t('home.hero.title'),
            subtitle: t('home.hero.subtitle'),
            image: "/images/17189029461596829888opals_3200x1200.jpg",
            ctaText: "Déguster",
            targetCategory: "Général"
          }]}
        />

        {/* Quick Access Category Grid - High Visibility Position */}
        <section id="category-grid" className="pt-20 pb-12 bg-background relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center mb-10 sm:mb-16 reveal">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 mb-3">Découvrez nos univers</span>
              <h2 className="text-3xl sm:text-5xl font-heading font-black text-foreground tracking-tight">
                {t('home.categories.title') || 'Nos Créations'}
              </h2>
              <div className="h-1.5 w-24 bg-primary/20 rounded-full mt-6" />
            </div>

            {categories.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                {categories.map((category, index) => (
                  <div key={category.id} className="reveal" style={{ animationDelay: `${index * 100}ms` }}>
                    <CategoryCard
                      id={category.id}
                      name={category.name}
                      description={category.description}
                      image={category.image}
                      alt={category.name}
                      productCount={category.productCount || 0}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <div className="py-8 sm:py-16 space-y-12 sm:space-y-16">

        {/* Immersive Thematic Sections (Les Galets Inspired) */}
        <div className="space-y-0">
          {categories.slice(1, 4).map((category) => {
            const categoryProducts = featuredProducts.filter(p => p.category === category.name);
            return (
              <ThematicCategorySection
                key={category.id}
                category={category}
                products={categoryProducts}
                onAddToCart={handleAddToCart}
              />
            );
          })}
        </div>

        {/* Featured Products Section (Secondary Selection) */}
        <section id="featured" className="py-10 sm:py-20 bg-muted/10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center mb-10 sm:mb-16 reveal">
              <h2 className="text-3xl sm:text-fluid-h2 font-heading font-bold text-foreground mb-4">
                {t('home.featured.title')}
              </h2>
              <div className="h-1 w-20 bg-primary/20 rounded-full mb-6" />
              <p className="text-muted-foreground max-w-2xl font-sans text-sm sm:text-lg px-4 italic">
                {t('home.featured.subtitle')}
              </p>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                {featuredProducts.map((product, index) => (
                  <div key={product.id} className="reveal" style={{ animationDelay: `${(index % 3) * 150}ms` }}>
                    <ProductCard
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 reveal">
                <p className="text-muted-foreground">{t('home.featured.empty')}</p>
              </div>
            )}
          </div>
        </section>


        {activePromotion && (
          <PromotionalBanner
            title={activePromotion.title || ''}
            description={activePromotion.subtitle || ''}
            ctaText={activePromotion.ctaText || ''}
            ctaLink={activePromotion.ctaLink || '/product-catalog'}
            backgroundImage={activePromotion.backgroundImage || ''}
            backgroundAlt={activePromotion.title || 'Promotion'}
            discount={activePromotion.discount} />
        )}


        {testimonials.length > 0 && (
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
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  name={testimonial.name}
                  location={testimonial.location}
                  rating={testimonial.rating}
                  comment={testimonial.comment}
                  date={testimonial.date}
                />
              ))}
            </div>
          </section>
        )}

        </div >
      </div >
    </div >
  );
};

export default HomepageInteractive;