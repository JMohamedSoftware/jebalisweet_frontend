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
import HomepageSkeleton from '@/components/ui/HomepageSkeleton';

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
        alert(t('cart.errors.sessionExpired'));
        router.push('/login');
      } else {
        alert(t('cart.errors.addError', { message: error.message || t('common.error') }));
      }
    }
  };

  if (!isHydrated || isLoading) {
    return <HomepageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="py-4 sm:py-8 space-y-12 sm:space-y-16">
        <HeroSection
          title={t('home.hero.title')}
          subtitle={t('home.hero.subtitle')}
          ctaText={t('home.hero.cta')}
          ctaLink="/product-catalog"
          backgroundImage="/images/17189029461596829888opals_3200x1200.jpg"
          backgroundAlt="Hero Background" />


        {/* Categories Section */}
        <section id="categories" className="py-10 sm:py-20 bg-background relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center mb-10 sm:mb-16 reveal">
              <h2 className="text-3xl sm:text-fluid-h2 font-heading font-bold text-foreground mb-4">
                {t('home.categories.title')}
              </h2>
              <div className="h-1 w-20 bg-primary/20 rounded-full mb-6" />
              <p className="text-muted-foreground max-w-2xl font-sans text-sm sm:text-lg px-4 italic">
                {t('home.categories.subtitle')}
              </p>
            </div>

            {categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
            ) : (
              <div className="text-center py-10 reveal">
                <p className="text-muted-foreground">{t('home.categories.empty')}</p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="featured" className="py-10 sm:py-20 bg-muted/30">
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
                      onQuickView={() => { /* Handled by catalog */ }}
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
            title={activePromotion.title}
            description={activePromotion.subtitle}
            ctaText={activePromotion.ctaText}
            ctaLink={activePromotion.ctaLink}
            backgroundImage={activePromotion.backgroundImage}
            backgroundAlt={activePromotion.title}
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
  );
};

export default HomepageInteractive;