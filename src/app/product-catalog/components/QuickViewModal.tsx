'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';
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
}

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const QuickViewModal = ({
  product,
  onClose,
  onAddToCart,
}: QuickViewModalProps) => {
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const handleAddToCart = async () => {
    if (product.inStock === false || isAdding) return;

    setIsAdding(true);
    await onAddToCart(product);

    // Feedback duration
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="StarIcon"
        size={20}
        variant={index < Math.floor(rating) ? 'solid' : 'outline'}
        className={index < Math.floor(rating) ? 'text-accent' : 'text-muted-foreground'}
      />
    ));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-500 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-lg shadow-warm-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border/50 p-4 flex items-center justify-between z-20">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
            {t('quickView.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-all active:scale-90"
            aria-label={t('quickView.close')}
          >
            <Icon name="XMarkIcon" size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-muted shadow-inner">
              <AppImage
                src={product.image}
                alt={product.alt}
                className="w-full h-full object-cover"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-error text-error-foreground px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
                    {t('quickView.outOfStock')}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="caption text-muted-foreground font-medium uppercase tracking-wider">{product.brand}</p>
                  <h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground leading-tight">
                    {product.name}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{product.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-muted-foreground">
                  {product.rating.toFixed(1)} ({product.reviewCount} {t('quickView.reviews')})
                </span>
              </div>

              <div className="pt-4 border-t border-border">
                <span className="font-heading text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon
                    name="TagIcon"
                    size={20}
                    className="text-muted-foreground"
                  />
                  <span className="text-foreground">
                    {t('quickView.category')}: <span className="font-medium">{product.category}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    name={product.inStock ? 'CheckCircleIcon' : 'XCircleIcon'}
                    size={20}
                    className={product.inStock ? 'text-success' : 'text-error'}
                  />
                  <span className="text-foreground">
                    {product.inStock ? t('quickView.inStock') : t('quickView.outOfStock')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.inStock === false || isAdding}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition-smooth font-semibold text-lg focus:outline-none focus:ring-3 focus:ring-ring ${isAdding
                  ? 'bg-accent text-accent-foreground animate-pulse'
                  : 'bg-primary text-primary-foreground hover:opacity-90'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isAdding ? (
                  <Icon name="CheckIcon" size={24} />
                ) : (
                  <Icon name="ShoppingCartIcon" size={24} />
                )}
                <span>{isAdding ? t('common.loading') : t('catalog.addToCart')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;