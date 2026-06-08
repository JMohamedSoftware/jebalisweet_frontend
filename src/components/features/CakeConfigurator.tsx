'use client';

import React, { useState, useRef } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

const CakeConfigurator = () => {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleAddToCart = async () => {
        if (!localStorage.getItem('user')) {
            router.push('/login');
            return;
        }

        if (!selectedImage) {
            alert('Veuillez ajouter une image de votre gâteau.');
            return;
        }

        setIsAdding(true);
        try {
            // 1. Find the "Custom Cake" product
            const productsData = await api.products.getAll(1, 100);
            let customProduct = productsData.products.find((p: any) => p.name.includes('Personnalisé'));

            if (!customProduct) {
                alert("Produit 'Gâteau Personnalisé' non trouvé en base. Veuillez contacter l'administrateur.");
                setIsAdding(false);
                return;
            }

            const productId = customProduct._id || customProduct.id;
            if (!productId) {
                alert("Erreur: ID du produit non trouvé.");
                setIsAdding(false);
                return;
            }

            // 2. Upload the image first
            const uploadData = await api.files.upload(selectedImage);
            const imageUrl = uploadData.url;

            // 3. Add to cart with the image URL and description as comment
            await api.cart.add(productId, 1, { isCustom: true }, description, imageUrl);

            window.dispatchEvent(new Event('cartUpdated'));
            router.push('/shopping-cart');
        } catch (error: any) {
            console.error('Error adding custom cake to cart', error);
            if (error.message.includes('Token') || error.message.includes('Accès refusé')) {
                alert("Votre session a expiré. Veuillez vous reconnecter.");
                router.push('/login');
            } else {
                alert(`Erreur lors de l'ajout au panier: ${error.message || 'Veuillez vérifier votre connexion.'}`);
            }
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">Commandez Votre Gâteau Sur Mesure</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
                    Téléchargez une photo d'inspiration ou un croquis, et nous vous donnerons un devis personnalisé.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-card/90 backdrop-blur-md p-8 rounded-3xl shadow-warm-lg border border-primary/10">
                {/* Image Upload Area */}
                <div
                    className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${previewUrl ? 'border-primary shadow-warm-md' : 'border-primary/30 hover:border-primary bg-muted/50'
                        }`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {previewUrl ? (
                        <div className="relative w-full h-full group">
                            <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                <span className="text-primary-foreground font-bold flex items-center gap-2 bg-primary/90 px-4 py-2 rounded-full shadow-warm">
                                    <Icon name="PencilIcon" size={20} /> Modifier la photo
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 shadow-warm-sm transition-transform group-hover:scale-110">
                                <Icon name="CameraIcon" size={32} />
                            </div>
                            <p className="font-heading font-bold text-xl text-primary mb-1">Ajoutez votre photo</p>
                            <p className="text-sm text-muted-foreground font-body">Cliquez ou glissez-déposez ici</p>
                            <p className="text-[10px] text-muted-foreground/70 mt-2">JPG, PNG (Max 5MB)</p>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                {/* Details Area */}
                <div className="flex flex-col">
                    <div className="mb-6">
                        <label className="block text-sm font-heading font-bold text-primary mb-3 flex items-center gap-2">
                            <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-primary" />
                            Expliquez-nous votre projet
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Décrivez les saveurs, le nombre de parts, le texte à inscrire..."
                            className="w-full h-48 bg-background border border-primary/20 text-foreground rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none resize-none transition-all placeholder:text-muted-foreground shadow-inner"
                        />
                    </div>

                    <div className="mt-auto space-y-4">
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                            <p className="text-xs text-primary font-medium flex items-center gap-2">
                                <Icon name="InformationCircleIcon" size={18} className="flex-shrink-0" />
                                Une fois la commande passée, nous vous contacterons avec le prix final de votre création.
                            </p>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || !selectedImage}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-bold py-4 rounded-xl shadow-warm transition-all active:scale-[0.98] disabled:opacity-60 disabled:grayscale flex items-center justify-center gap-2 text-lg"
                        >
                            {isAdding ? (
                                <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Icon name="ShoppingBagIcon" size={22} />
                                    Demander un devis
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div className="p-8 bg-card rounded-2xl shadow-warm border border-primary/5 transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-5 shadow-warm-sm">
                        <Icon name="ArrowUpTrayIcon" size={26} />
                    </div>
                    <h4 className="font-heading font-bold text-primary mb-2 text-xl">1. Partagez</h4>
                    <p className="text-sm text-muted-foreground font-body">Téléchargez votre inspiration ou photo.</p>
                </div>
                <div className="p-8 bg-card rounded-2xl shadow-warm border border-primary/5 transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-5 shadow-warm-sm">
                        <Icon name="TicketIcon" size={26} />
                    </div>
                    <h4 className="font-heading font-bold text-primary mb-2 text-xl">2. Devis</h4>
                    <p className="text-sm text-muted-foreground font-body">Nous estimons le prix en 24h.</p>
                </div>
                <div className="p-8 bg-card rounded-2xl shadow-warm border border-primary/5 transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-5 shadow-warm-sm">
                        <Icon name="CheckCircleIcon" size={26} />
                    </div>
                    <h4 className="font-heading font-bold text-primary mb-2 text-xl">3. Magie</h4>
                    <p className="text-sm text-muted-foreground font-body">Une fois validé, nous créons la magie.</p>
                </div>
            </div>
        </div>
    );
};

export default CakeConfigurator;
