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
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Commandez Votre Gâteau Sur Mesure</h1>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Téléchargez une photo d'inspiration ou un croquis, et nous vous donnerons un devis personnalisé.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#111]/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10">
                {/* Image Upload Area */}
                <div
                    className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${previewUrl ? 'border-primary' : 'border-white/20 hover:border-primary/50 bg-white/5'
                        }`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {previewUrl ? (
                        <div className="relative w-full h-full group">
                            <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white font-bold flex items-center gap-2">
                                    <Icon name="PencilIcon" size={20} /> Modifier la photo
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                <Icon name="CameraIcon" size={32} />
                            </div>
                            <p className="font-bold text-lg text-white mb-1">Ajoutez votre photo</p>
                            <p className="text-xs text-gray-400">Cliquez ou glissez-déposez ici</p>
                            <p className="text-[10px] text-gray-500 mt-2">JPG, PNG (Max 5MB)</p>
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
                        <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <Icon name="ChatBubbleLeftRightIcon" size={18} className="text-primary" />
                            Expliquez-nous votre projet
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Décrivez les saveurs, le nombre de parts, le texte à inscrire..."
                            className="w-full h-48 bg-white/5 border border-white/10 text-white rounded-xl p-4 text-sm focus:ring-2 ring-primary/30 outline-none resize-none transition-all placeholder:text-gray-500"
                        />
                    </div>

                    <div className="mt-auto space-y-4">
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                            <p className="text-xs text-primary font-medium flex items-center gap-2">
                                <Icon name="InformationCircleIcon" size={16} />
                                Une fois la commande passée, nous vous contacterons avec le prix final.
                            </p>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || !selectedImage}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                        >
                            {isAdding ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Icon name="ShoppingBagIcon" size={20} />
                                    Ajouter au panier (Prix à confirmer)
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div className="p-6 bg-[#111]/50 backdrop-blur-sm rounded-2xl border border-white/5">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <Icon name="ArrowUpTrayIcon" size={24} />
                    </div>
                    <h4 className="font-bold text-white mb-2 text-lg">1. Partagez</h4>
                    <p className="text-sm text-gray-400">Téléchargez votre inspiration ou photo.</p>
                </div>
                <div className="p-6 bg-[#111]/50 backdrop-blur-sm rounded-2xl border border-white/5">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <Icon name="TicketIcon" size={24} />
                    </div>
                    <h4 className="font-bold text-white mb-2 text-lg">2. Devis</h4>
                    <p className="text-sm text-gray-400">Nous estimons le prix en 24h.</p>
                </div>
                <div className="p-6 bg-[#111]/50 backdrop-blur-sm rounded-2xl border border-white/5">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <Icon name="CheckCircleIcon" size={24} />
                    </div>
                    <h4 className="font-bold text-white mb-2 text-lg">3. Réalisation</h4>
                    <p className="text-sm text-gray-400">Une fois validé, nous créons la magie.</p>
                </div>
            </div>
        </div>
    );
};

export default CakeConfigurator;
