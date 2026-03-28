'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import PageLoader from '@/components/ui/PageLoader';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

interface Promotion {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage: string;
    discount: string;
    active: boolean;
}

const AdminPromotionManagementInteractive = () => {
    const router = useRouter();
    const { t } = useLanguage();
    const [isHydrated, setIsHydrated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [promo, setPromo] = useState<Promotion>({
        title: 'Offre Spéciale Noël',
        subtitle: 'Découvrez notre collection exclusive de chocolats de fête.',
        ctaText: 'Commander maintenant',
        ctaLink: '/product-catalog',
        backgroundImage: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg',
        discount: '-20%',
        active: false,
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        setIsHydrated(true);
        const userData = localStorage.getItem('user');
        if (!userData || JSON.parse(userData).role !== 'admin') {
            router.push('/login');
            return;
        }

        loadPromo();
    }, [router]);

    const loadPromo = async () => {
        try {
            const data = await api.promotions.getLatest();
            if (data && data.title) {
                setPromo(data);
            }
        } catch (error) {
            console.error("Failed to load promo", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setPromo(prev => ({ ...prev, [name]: val }));
    };

    const handleToggleActive = () => {
        setPromo(prev => ({ ...prev, active: !prev.active }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);
        try {
            await api.promotions.update(promo);
            setMessage({ type: 'success', text: 'Promotion mise à jour avec succès !' });
            // Invalidate frontend cache/state if needed
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erreur lors de la sauvegarde' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const response = await api.files.upload(file);
            setPromo(prev => ({ ...prev, backgroundImage: response.url }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Erreur lors de l'upload de l'image");
        }
    };

    if (!isHydrated || isLoading) return <PageLoader />;

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground">Gérer la Promotion Accueil</h1>
                    <p className="text-muted-foreground">Contrôlez la bannière promotionnelle qui s'affiche sur la page d'accueil.</p>
                </div>
                <Link href="/admin-dashboard" className="text-primary hover:underline flex items-center gap-2">
                    <Icon name="ArrowLeftIcon" size={18} />
                    Retour Dashboard
                </Link>
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-10">
                <form onSubmit={handleSave} className="bg-card rounded-xl border border-border p-8 shadow-warm space-y-6">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div>
                            <p className="font-semibold">{promo.active ? 'Promotion Activée' : 'Promotion Désactivée'}</p>
                            <p className="text-xs text-muted-foreground">La bannière sera visible sur l'accueil</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleToggleActive}
                            className={`w-12 h-6 rounded-full transition-colors relative ${promo.active ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${promo.active ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Titre de l'Offre</label>
                            <input
                                type="text"
                                name="title"
                                value={promo.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-border rounded-lg"
                                placeholder="Ex: Offre Spéciale Noël"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Sous-titre / Description</label>
                            <textarea
                                name="subtitle"
                                value={promo.subtitle}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-border rounded-lg"
                                placeholder="Description courte de l'offre"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Remise (Badge)</label>
                                <input
                                    type="text"
                                    name="discount"
                                    value={promo.discount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-border rounded-lg"
                                    placeholder="-20%"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Lien du Bouton</label>
                                <input
                                    type="text"
                                    name="ctaLink"
                                    value={promo.ctaLink}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-border rounded-lg"
                                    placeholder="/product-catalog"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Texte du Bouton</label>
                            <input
                                type="text"
                                name="ctaText"
                                value={promo.ctaText}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-border rounded-lg"
                                placeholder="Commander maintenant"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Image de fond</label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    name="backgroundImage"
                                    value={promo.backgroundImage}
                                    onChange={handleChange}
                                    className="flex-1 px-4 py-2 border border-border rounded-lg text-xs"
                                />
                                <label className="cursor-pointer bg-muted px-4 py-2 rounded-lg hover:bg-muted-foreground/10 transition-smooth shrink-0">
                                    <Icon name="CloudArrowUpIcon" size={20} />
                                    <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
                    >
                        {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                </form>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Aperçu en temps réel</h2>
                    <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-warm-lg border border-border opacity-90">
                        {!promo.active && (
                            <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                                <span className="bg-white px-4 py-2 rounded-full font-bold text-sm shadow-xl">Invisible pour les clients</span>
                            </div>
                        )}
                        <div className="absolute inset-0">
                            <img
                                src={promo.backgroundImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-brown-900/95 to-brown-700/70" />
                        </div>

                        <div className="relative h-full flex items-center">
                            <div className="px-8">
                                <div className="max-w-xs">
                                    {promo.discount && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-full font-bold mb-3 text-xs">
                                            <Icon name="TagIcon" size={14} />
                                            <span>{promo.discount}</span>
                                        </div>
                                    )}

                                    <h2 className="text-2xl font-heading font-bold text-white mb-2 leading-tight">
                                        {promo.title}
                                    </h2>

                                    <p className="text-sm text-white/90 mb-4 line-clamp-2">
                                        {promo.subtitle}
                                    </p>

                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-brown-900 rounded-lg font-bold text-xs">
                                        {promo.ctaText}
                                        <Icon name="ArrowRightIcon" size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm">
                        <h3 className="font-bold flex items-center gap-2 mb-2">
                            <Icon name="InformationCircleIcon" size={18} />
                            Note à l'administrateur
                        </h3>
                        <p>Les bannières promotionnelles sont idéales pour booster vos ventes flash ou célébrer des événements saisonniers (Noël, Aïd, etc.).</p>
                        <p className="mt-2">Vous n'avez besoin que d'une seule image de haute qualité pour le fond.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPromotionManagementInteractive;
