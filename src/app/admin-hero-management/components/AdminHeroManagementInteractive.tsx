'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import PageLoader from '@/components/ui/PageLoader';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  targetCategory: string;
}

const emptySlide = (): HeroSlide => ({
  title: '',
  subtitle: '',
  image: '',
  ctaText: 'Déguster',
  targetCategory: ''
});

const AdminHeroManagementInteractive = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [slides, setSlides] = useState<HeroSlide[]>([emptySlide()]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [heroSlides, cats] = await Promise.all([
          api.hero.getSlides().catch(() => null),
          api.categories.getAll()
        ]);

        if (Array.isArray(heroSlides) && heroSlides.length > 0) {
          setSlides(heroSlides);
        }
        setCategories(cats);
      } catch (error) {
        console.error("Failed to load hero data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const updateSlide = (field: keyof HeroSlide, value: string) => {
    setSlides(prev => prev.map((s, i) => i === activeSlide ? { ...s, [field]: value } : s));
  };

  const addSlide = () => {
    setSlides(prev => [...prev, emptySlide()]);
    setActiveSlide(slides.length);
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) return;
    setSlides(prev => prev.filter((_, i) => i !== index));
    setActiveSlide(Math.max(0, activeSlide >= index ? activeSlide - 1 : activeSlide));
  };

  const moveSlide = (from: number, to: number) => {
    const newSlides = [...slides];
    const [moved] = newSlides.splice(from, 1);
    newSlides.splice(to, 0, moved);
    setSlides(newSlides);
    setActiveSlide(to);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await api.files.upload(file);
      updateSlide('image', result.url);
    } catch (error) {
      alert("Erreur lors de l'upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.hero.updateSlides(slides);
      alert("Slideshow Hero mis à jour avec succès !");
      router.push('/admin-dashboard');
    } catch (error) {
      console.error("Update failed", error);
      alert("Erreur lors de la mise à jour.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <PageLoader />;

  const slide = slides[activeSlide];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-6 py-12 max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-1">Gestion du Hero</h1>
            <p className="text-muted-foreground italic text-sm">
              {slides.length} slide{slides.length > 1 ? 's' : ''} · rotation automatique toutes les 5 secondes
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium"
          >
            <Icon name="ArrowLeftIcon" size={20} />
            Retour
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Slide Tabs Strip ── */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {slides.map((s, i) => (
              <div key={i} className="flex-shrink-0 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveSlide(i)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all border ${
                    i === activeSlide
                      ? 'bg-primary text-black border-primary'
                      : 'bg-card border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  Slide {i + 1}
                  {s.title && <span className="ml-2 text-[10px] opacity-60 hidden sm:inline">· {s.title.slice(0, 12)}</span>}
                </button>
                {/* Re-order arrows */}
                <div className="flex flex-col gap-0.5">
                  {i > 0 && (
                    <button type="button" onClick={() => moveSlide(i, i - 1)}
                      className="text-muted-foreground hover:text-primary text-[10px] leading-none px-1">◀</button>
                  )}
                  {i < slides.length - 1 && (
                    <button type="button" onClick={() => moveSlide(i, i + 1)}
                      className="text-muted-foreground hover:text-primary text-[10px] leading-none px-1">▶</button>
                  )}
                </div>
                {slides.length > 1 && (
                  <button type="button" onClick={() => removeSlide(i)}
                    className="text-error hover:opacity-80 text-[10px] px-1 leading-none">✕</button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSlide}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary rounded-lg text-sm transition-all"
            >
              <Icon name="PlusIcon" size={16} />
              Ajouter une slide
            </button>
          </div>

          {/* ── Preview ── */}
          <div className="bg-card rounded-2xl overflow-hidden shadow-warm-2xl border border-border relative aspect-[21/9]">
            {slide.image ? (
              <AppImage src={slide.image} alt="Hero Preview" fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <Icon name="PhotoIcon" size={64} className="text-muted-foreground/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8 text-center text-white space-y-3">
              <p className="text-xs uppercase tracking-widest opacity-60">Slide {activeSlide + 1} / {slides.length}</p>
              <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tighter">{slide.title || 'Votre Titre Ici'}</h2>
              <p className="text-base font-serif italic opacity-80">{slide.subtitle || 'Votre description...'}</p>
              <div className="px-8 py-2 bg-primary text-black font-bold uppercase text-[10px] tracking-widest">{slide.ctaText}</div>
            </div>
          </div>

          {/* ── Form Fields ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left: Text Content */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-primary">Titre Principal</label>
                <input
                  type="text"
                  value={slide.title}
                  onChange={e => updateSlide('title', e.target.value)}
                  placeholder="Ex: Excellence Orientale"
                  className="w-full px-5 py-4 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-primary">Slogan / Description</label>
                <textarea
                  value={slide.subtitle}
                  onChange={e => updateSlide('subtitle', e.target.value)}
                  rows={3}
                  placeholder="Ex: L'art de la pâtisserie tunisienne."
                  className="w-full px-5 py-4 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-primary">Texte Bouton</label>
                  <input
                    type="text"
                    value={slide.ctaText}
                    onChange={e => updateSlide('ctaText', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-primary">Catégorie Cible</label>
                  <select
                    value={slide.targetCategory}
                    onChange={e => updateSlide('targetCategory', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-primary">Image de Fond</label>
                <input
                  type="url"
                  value={slide.image}
                  onChange={e => updateSlide('image', e.target.value)}
                  placeholder="URL de l'image (Cloudinary ou local)"
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="relative group">
                <input type="file" id="hero-image-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                <label
                  htmlFor="hero-image-upload"
                  className={`w-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                    isUploading ? 'bg-muted border-primary/30' : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  ) : (
                    <>
                      <Icon name="CloudArrowUpIcon" size={32} className="text-muted-foreground mb-2" />
                      <span className="text-sm font-medium text-foreground">Télécharger une image</span>
                      <span className="text-[10px] uppercase tracking-widest mt-1 opacity-50">PNG, JPG · max 5MB</span>
                    </>
                  )}
                </label>
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-[10px] uppercase font-bold text-primary mb-2">💡 Conseil</p>
                <p className="text-[11px] leading-relaxed text-muted-foreground italic">
                  Utilisez des images de haute qualité (min 1920×1080). Chaque slide peut avoir une image et une catégorie différente.
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-8 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-12 py-5 bg-foreground text-background font-black uppercase tracking-[0.3em] text-xs transition-all hover:bg-primary hover:text-black shadow-xl disabled:opacity-50"
            >
              {isSaving ? 'Enregistrement...' : `Enregistrer le Slideshow (${slides.length} slide${slides.length > 1 ? 's' : ''})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminHeroManagementInteractive;
