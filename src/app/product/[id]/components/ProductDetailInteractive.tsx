'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { api } from '@/services/api';
import { formatPrice } from '@/utils/format';
import ProductCard from '@/app/product-catalog/components/ProductCard';

import { Product } from '@/types/product';

interface ProductDetailInteractiveProps {
  product: Product;
}

const ProductDetailInteractive = ({ product }: ProductDetailInteractiveProps) => {
  const { t, direction } = useLanguage();
  const router = useRouter();
  const { addItem } = useCart();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeImage, setActiveImage] = useState(product.image);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  // Accordion states
  const [openSection, setOpenSection] = useState<'ingredients' | 'conservation' | null>(null);

  const isWishlisted = isInWishlist(product.id);
  const isCustom = product.name.toLowerCase().includes('personnalisé');

  // Gallery images including main image
  const galleryImages = [product.image, ...(product.images || [])].filter((img, index, self) => self.indexOf(img) === index);

  useEffect(() => {
    setActiveImage(product.image);
  }, [product.image]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const related = await api.products.getRelated(product.id);
        setRelatedProducts(related.map((p: any) => ({
          ...p,
          id: (p.id || p._id).toString()
        })));
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      }
    };
    fetchRelated();
  }, [product.id]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem(product, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setTimeout(() => setIsAdding(false), 1500);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({
      ...product,
      description: product.description || '',
      alt: product.alt || product.name
    } as any);
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="bg-background min-h-screen">
      <div className="container max-w-7xl mx-auto px-6 py-8 md:py-20" dir={direction}>
        
        {/* Main Product Layout */}
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 md:gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Image & Gallery */}
          <div className="lg:sticky lg:top-32 flex flex-col gap-6">
            <div 
              className="relative w-[calc(100%+3rem)] -mx-6 md:w-full md:mx-0 aspect-[4/5] lg:aspect-square overflow-hidden bg-[#F8F8F8] cursor-zoom-in group transition-all duration-700"
              onClick={() => setIsImageExpanded(true)}
            >
              <AppImage 
                src={activeImage} 
                alt={product.alt || product.name} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                priority
              />
              
              {/* Refined Promo Badge */}
              {product.originalPrice && product.originalPrice > product.price && !isCustom && (
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-foreground text-background px-4 py-1.5 text-[9px] uppercase tracking-[0.3em] font-medium shadow-xl shadow-black/10">
                    {t('product.promo') || 'Privilège'}
                  </span>
                </div>
              )}
              
              {/* Minimalist Enlarge Button */}
              <button 
                className="absolute bottom-6 right-6 w-10 h-10 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-background text-foreground/60 hover:text-foreground z-20 shadow-lg shadow-black/5"
                onClick={(e) => { e.stopPropagation(); setIsImageExpanded(true); }}
                aria-label="Agrandir l'image"
              >
                <Icon name="ArrowsPointingOutIcon" size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Subtle Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-6 -mx-6 md:px-0 md:mx-0 snap-x">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-24 h-24 bg-[#F8F8F8] overflow-hidden transition-all duration-500 flex-shrink-0 snap-start rounded-xl ${
                      activeImage === img 
                      ? 'opacity-100 ring-2 ring-primary ring-offset-2 scale-95' 
                      : 'opacity-40 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <AppImage src={img} alt={`${product.name} vue ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Actions */}
          <div className="flex flex-col animate-fade-in duration-1000 mt-2 lg:mt-8">
            
            {/* Nav & Title & Back Button */}
            <div className="flex flex-col gap-6">
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-colors w-fit mb-2"
              >
                <Icon name="ArrowLeftIcon" size={12} strokeWidth={2.5} />
                <span>{direction === 'rtl' ? 'رجوع' : 'Retour'}</span>
              </button>

              <div className="flex items-center justify-between">
                <nav className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  <span className="text-primary font-medium">{product.category}</span>
                  {product.sku && (
                    <>
                      <span className="w-4 h-px bg-border" />
                      <span>RÉF : {product.sku}</span>
                    </>
                  )}
                </nav>
                <button 
                  onClick={handleToggleWishlist}
                  className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                    isWishlisted ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name="HeartIcon" size={16} variant={isWishlisted ? 'solid' : 'outline'} />
                  <span className="hidden sm:inline">{isWishlisted ? 'Sauvegardé' : 'Favoris'}</span>
                </button>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-foreground font-light tracking-tight">
                {product.name}
              </h1>
            </div>
            
            {/* Price section - Elegant Typography */}
            <div className="mt-8 flex items-baseline gap-4">
              {isCustom ? (
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-light text-primary uppercase tracking-wider">
                    {t('product.customCakePrice') || 'Sur devis'}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-light text-foreground">
                      {formatPrice(Number(product.price) * quantity).replace('DT', '').trim() || '0,00'}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">DT</span>
                    </div>
                  </div>
                  {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                    <span className="text-sm text-muted-foreground line-through decoration-border font-light ml-2">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.priceUnit && (
                    <span className="text-[10px] uppercase text-muted-foreground tracking-[0.2em] ml-auto">/ {product.priceUnit}</span>
                  )}
                </>
              )}
            </div>

            <hr className="w-12 border-t-2 border-primary my-10" />

            {/* Description */}
            <div className="prose prose-sm text-muted-foreground font-light leading-loose text-[14px] tracking-wide mb-12">
              <p>{product.description || "Une création artisanale d'exception, réalisée avec passion et des ingrédients sélectionnés pour leur noblesse."}</p>
            </div>

            {/* Refined Metadata List */}
            {(product.approxPieces || product.onOrderOnly) && (
              <div className="flex flex-col gap-4 mb-12 bg-muted/30 p-6">
                 {product.approxPieces && (
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Format</span>
                     <span className="text-[12px] text-muted-foreground font-light">Environ {product.approxPieces}</span>
                   </div>
                 )}
                 {product.onOrderOnly && (
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Disponibilité</span>
                     <span className="text-[12px] text-muted-foreground font-light flex items-center gap-2">
                       Sur commande
                       {product.leadTime && <span className="italic">({product.leadTime})</span>}
                     </span>
                   </div>
                 )}
              </div>
            )}

            {/* Action Area: Sleek Quantity & Cart */}
            <div className="flex flex-col gap-4 mt-auto">
              {isCustom ? (
                <button
                  onClick={() => router.push('/custom-cake')}
                  className="h-16 w-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-black hover:text-white hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-700 uppercase tracking-[0.2em] text-[12px] font-bold"
                >
                  {direction === 'rtl' ? 'تخصيص كعكتي' : 'Personnaliser ce gâteau'}
                </button>
              ) : product.inStock ? (
                <>
                  {/* Fine Quantity Selector */}
                  <div className="flex items-center justify-between border border-border hover:border-foreground transition-colors h-14 w-full bg-transparent">
                    <button 
                      onClick={decrementQty}
                      className="px-6 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon name="MinusIcon" size={16} strokeWidth={1.5} />
                    </button>
                    <span className="w-12 text-center font-heading text-xl">{quantity}</span>
                    <button 
                      onClick={incrementQty}
                      className="px-6 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon name="PlusIcon" size={16} strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Elegant Add to Cart Button */}
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`h-16 w-full flex items-center justify-center transition-all duration-700 uppercase tracking-[0.2em] text-[12px] font-bold ${
                      isAdding 
                      ? 'bg-success/10 text-success border border-success/20 cursor-default' 
                      : 'bg-foreground text-background hover:bg-foreground/90 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-0.5'
                    }`}
                  >
                    {isAdding ? 'Ajouté à la sélection' : 'Ajouter au Panier'}
                  </button>
                </>
              ) : (
                <div className="h-16 w-full flex items-center justify-center bg-muted/40 text-muted-foreground uppercase tracking-[0.3em] text-[12px] font-bold border border-border">
                  Création Indisponible
                </div>
              )}
            </div>

            {/* Accordion Info (Ingredients & Conservation) */}
            {(product.ingredients || product.conservation) && (
              <div className="mt-16 flex flex-col border-t border-border">
                {product.ingredients && (
                  <div className="border-b border-border">
                    <button 
                      onClick={() => setOpenSection(openSection === 'ingredients' ? null : 'ingredients')}
                      className="w-full flex items-center justify-between py-6 text-left group transition-all"
                    >
                      <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        Ingrédients Singuliers
                      </span>
                      <div className="relative w-4 h-4 flex items-center justify-center">
                        <span className={`absolute w-full h-[1px] bg-foreground transition-transform duration-500 ${openSection === 'ingredients' ? 'rotate-180' : ''}`} />
                        <span className={`absolute w-[1px] h-full bg-foreground transition-transform duration-500 ${openSection === 'ingredients' ? 'rotate-90 scale-0' : ''}`} />
                      </div>
                    </button>
                    <div className={`overflow-hidden transition-all duration-700 ease-in-out ${openSection === 'ingredients' ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-[13px] font-light leading-relaxed text-muted-foreground">{product.ingredients}</p>
                    </div>
                  </div>
                )}
                {product.conservation && (
                  <div className="border-b border-border">
                    <button 
                      onClick={() => setOpenSection(openSection === 'conservation' ? null : 'conservation')}
                      className="w-full flex items-center justify-between py-6 text-left group transition-all"
                    >
                      <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        Art de la Dégustation
                      </span>
                      <div className="relative w-4 h-4 flex items-center justify-center">
                        <span className={`absolute w-full h-[1px] bg-foreground transition-transform duration-500 ${openSection === 'conservation' ? 'rotate-180' : ''}`} />
                        <span className={`absolute w-[1px] h-full bg-foreground transition-transform duration-500 ${openSection === 'conservation' ? 'rotate-90 scale-0' : ''}`} />
                      </div>
                    </button>
                    <div className={`overflow-hidden transition-all duration-700 ease-in-out ${openSection === 'conservation' ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-[13px] font-light leading-relaxed text-muted-foreground">{product.conservation}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Minimal Guarantees */}
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
               <div className="flex items-center gap-3">
                 <Icon name="TruckIcon" size={16} strokeWidth={1} className="text-muted-foreground" />
                 <span className="text-[10px] uppercase tracking-[0.15em] text-foreground font-medium">Livraison Soignée</span>
               </div>
               <div className="flex items-center gap-3">
                 <Icon name="ShieldCheckIcon" size={16} strokeWidth={1} className="text-muted-foreground" />
                 <span className="text-[10px] uppercase tracking-[0.15em] text-foreground font-medium">Paiement Sécurisé</span>
               </div>
            </div>

          </div>
        </div>

        {/* Bottom Discovery Grids */}
        <div className="mt-32 md:mt-48 space-y-24">
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="space-y-12">
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">La même collection</span>
                <h2 className="font-heading text-3xl md:text-4xl text-foreground font-light">
                  {direction === 'rtl' ? 'اكتشف المزيد' : 'Complétez votre sélection'}
                </h2>
                <div className="mt-6 w-px h-12 bg-border mx-auto" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                {relatedProducts.slice(0, 4).map(p => (
                  <ProductCard 
                    key={p.id}
                    product={p} 
                    onAddToCart={(prod) => api.cart.add(prod.id, 1)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Wishlist */}
          {wishlist && wishlist.length > 0 && (
            <div className="space-y-12 border-t border-border pt-24">
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">Vos Favoris</span>
                <h2 className="font-heading text-3xl md:text-4xl text-foreground font-light">
                  {direction === 'rtl' ? 'إبداعات تعشقونها' : 'Créations que vous adorez'}
                </h2>
                <div className="mt-6 w-px h-12 bg-border mx-auto" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                {wishlist.slice(0, 4).map(p => (
                  <ProductCard 
                    key={p.id}
                    product={p} 
                    onAddToCart={(prod) => api.cart.add(prod.id, 1)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Elegant Image Modal */}
      {isImageExpanded && (
        <div 
          className="fixed inset-0 z-[99999] bg-background/98 backdrop-blur-xl flex flex-col p-6 lg:p-12 animate-fade-in"
          onClick={() => setIsImageExpanded(false)}
        >
          <div className="flex justify-between items-center w-full max-w-[90rem] mx-auto mb-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">{product.name}</span>
            <button 
              className="group flex flex-col items-center gap-2"
              onClick={() => setIsImageExpanded(false)}
            >
              <div className="relative w-8 h-8 flex items-center justify-center bg-muted rounded-full group-hover:bg-foreground transition-colors duration-500">
                <Icon name="XMarkIcon" size={14} className="text-foreground group-hover:text-background transition-colors" />
              </div>
            </button>
          </div>
          <div className="flex-grow flex items-center justify-center perspective-[1000px]">
            <div className="relative w-full max-w-5xl h-full max-h-[85vh] animate-in slide-in-from-bottom-5 duration-700 ease-out">
              <AppImage 
                src={activeImage} 
                alt={product.alt || product.name} 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailInteractive;
