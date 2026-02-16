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
  const [isImageExpanded, setIsImageExpanded] = useState(false);

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
        size={18}
        variant={index < Math.floor(rating) ? 'solid' : 'outline'}
        className={index < Math.floor(rating) ? 'text-accent' : 'text-muted-foreground/30'}
      />
    ));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-500 flex items-end sm:items-center justify-center bg-background/60 backdrop-blur-md animate-fade-in"
        onClick={handleBackdropClick}
      >
        <div className="bg-card w-full max-w-4xl sm:rounded-3xl rounded-t-[2.5rem] shadow-warm-2xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-slide-up relative border-t sm:border border-border/40">
          {/* Mobile Handle */}
          <div className="sm:hidden w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mt-4 mb-2 flex-shrink-0" />

          {/* Header */}
          <div className="bg-card/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-border/30 flex-shrink-0">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-bold mb-0.5">{product.brand}</span>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                {t('quickView.title')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-muted/60 hover:bg-muted text-foreground transition-all active:scale-90 border border-border/20"
              aria-label={t('quickView.close')}
            >
              <Icon name="XMarkIcon" size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 scrollbar-hide">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Section */}
              <div className="space-y-4">
                <div
                  className="relative h-56 sm:h-96 rounded-3xl overflow-hidden bg-muted/50 border border-border/20 group cursor-zoom-in group shadow-warm-lg transition-transform active:scale-[0.98]"
                  onClick={() => setIsImageExpanded(true)}
                >
                  <AppImage
                    src={product.image}
                    alt={product.alt}
                    className="w-full h-full object-cover transition-smooth group-hover:scale-110"
                  />

                  {/* Zoom Overlay Button */}
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-border/20 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                    <Icon name="MagnifyingGlassPlusIcon" size={20} className="text-primary" />
                  </div>

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-background/70 backdrop-blur-[4px] flex items-center justify-center">
                      <span className="bg-error/90 text-white px-8 py-3 rounded-2xl font-black text-lg shadow-2xl border border-white/20 uppercase tracking-widest">
                        {t('quickView.outOfStock')}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-2 italic">
                  <Icon name="InformationCircleIcon" size={14} className="opacity-50" />
                  Cliquer sur l'image pour l'agrandir
                </p>
              </div>

              {/* Info Section */}
              <div className="flex flex-col h-full">
                <div className="space-y-6 flex-grow">
                  <div className="space-y-4">
                    <h3 className="font-heading text-3xl sm:text-4xl font-black text-foreground leading-[1.1] tracking-tight">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-4 py-1">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 rounded-full border border-accent/20">
                        <div className="flex items-center gap-0.5">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-sm font-bold text-accent">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">
                        {product.reviewCount} {t('quickView.reviews')}
                      </span>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-base sm:text-lg font-normal">
                      {product.description}
                    </p>
                  </div>

                  <div className="py-6 border-y border-border/30 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold mb-1">Prix de délice</p>
                      <span className="font-heading text-4xl sm:text-5xl font-black text-primary flex items-baseline">
                        {formatPrice(product.price)}
                        <span className="text-lg font-medium text-muted-foreground ml-1">DT</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <Icon
                          name={product.inStock ? 'CheckCircleIcon' : 'XCircleIcon'}
                          size={18}
                          className={product.inStock ? 'text-success' : 'text-error'}
                        />
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${product.inStock ? 'text-success' : 'text-error'}`}>
                          {product.inStock ? t('quickView.inStock') : t('quickView.outOfStock')}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium block">
                        Catégorie: <span className="text-foreground">{product.category}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-auto">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.inStock === false || isAdding}
                    className={`w-full h-16 flex items-center justify-center gap-4 rounded-2xl transition-all duration-300 font-black text-xl shadow-warm-lg transform group overflow-hidden relative ${isAdding
                      ? 'bg-accent text-accent-foreground scale-[0.98]'
                      : 'bg-primary text-primary-foreground hover:shadow-primary/30 active:scale-[0.97]'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <div className={`absolute inset-0 bg-white/10 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none`} />
                    {isAdding ? (
                      <Icon name="CheckIcon" size={28} className="animate-bounce" />
                    ) : (
                      <Icon name="ShoppingCartIcon" size={28} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    )}
                    <span className="tracking-tight">{isAdding ? 'Ajouté !' : 'Ajouter au Panier'}</span>
                  </button>

                  <div className="pt-4 flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                    <Icon name="TruckIcon" size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Livraison Rapide</span>
                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <Icon name="LockClosedIcon" size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Paiement Sécurisé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High-Level Image Expanded Overlay */}
      {isImageExpanded && (
        <div
          className="fixed inset-0 z-1000 bg-background/95 backdrop-blur-2xl flex flex-col animate-fade-in p-4 sm:p-10"
          onClick={() => setIsImageExpanded(false)}
        >
          <div className="flex justify-between items-center w-full max-w-7xl mx-auto mb-6">
            <h4 className="font-heading text-xl sm:text-2xl font-black text-foreground">{product.name}</h4>
            <button
              className="p-4 rounded-full bg-muted/80 hover:bg-muted text-foreground transition-all border border-border/20 shadow-xl active:scale-90"
              onClick={() => setIsImageExpanded(false)}
            >
              <Icon name="XMarkIcon" size={28} />
            </button>
          </div>

          <div className="flex-grow flex items-center justify-center relative group">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden underline decoration-primary/20 decoration-8 underline-offset-[100px]">
              <span className="text-[20vw] font-black uppercase text-primary/10 select-none tracking-tighter italic">JEBALI SWEET</span>
            </div>

            <div className="relative max-w-5xl w-full h-full max-h-[75vh] sm:rounded-[3rem] overflow-hidden shadow-warm-2xl border border-white/10 animate-scale-in">
              <AppImage
                src={product.image}
                alt={product.alt}
                className="w-full h-full object-contain sm:object-cover"
              />
            </div>
          </div>

          <div className="mt-8 text-center animate-slide-up">
            <p className="text-muted-foreground font-medium text-lg sm:text-xl italic">
              "L'élégance de la pâtisserie fine, capturée dans chaque détail."
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickViewModal;