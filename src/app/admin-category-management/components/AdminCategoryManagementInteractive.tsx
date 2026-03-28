'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import PageLoader from '@/components/ui/PageLoader';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

interface Category {
    id: string;
    name: string;
    image?: string;
}

const AdminCategoryManagementInteractive = () => {
    const router = useRouter();
    const { t } = useLanguage();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryImage, setNewCategoryImage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const fetchCategories = async () => {
        try {
            const data = await api.categories.getAll();
            if (Array.isArray(data)) {
                setCategories(data);
            }
        } catch (error) {
            console.error("Failed to load categories", error);
        }
    };

    useEffect(() => {
        setIsHydrated(true);
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchCategories();
    }, [router]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsUploading(true);
            try {
                const response = await api.files.upload(file);
                setNewCategoryImage(response.url);
            } catch (error) {
                console.error("Upload failed", error);
                alert("Erreur lors de l'upload de l'image.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            await api.categories.create({
                name: newCategoryName,
                image: newCategoryImage
            });
            setNewCategoryName('');
            setNewCategoryImage('');
            fetchCategories();
        } catch (error: any) {
            console.error("Failed to create category", error);
            alert(error.message || "Erreur lors de la création de la catégorie.");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
            try {
                await api.categories.delete(id);
                fetchCategories();
            } catch (error) {
                console.error("Failed to delete category", error);
            }
        }
    };

    if (!isHydrated) return <PageLoader />;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
                            Gestion des Catégories
                        </h1>
                        <p className="text-muted-foreground">
                            Gérez les catégories de produits
                        </p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium"
                    >
                        <Icon name="ArrowLeftIcon" size={20} />
                        {t('common.return') || 'Retour'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Create */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-lg shadow-warm-md p-6 border border-border sticky top-8">
                            <h2 className="font-heading text-xl font-semibold mb-6">Ajouter une catégorie</h2>
                            <form onSubmit={handleAddCategory} className="space-y-4">
                                <div>
                                    <label className="block caption font-medium text-foreground mb-2">Nom</label>
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
                                        placeholder="Ex: Pâtisserie"
                                    />
                                </div>

                                <div>
                                    <label className="block caption font-medium text-foreground mb-2">Image</label>
                                    <div className="space-y-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
                                        />
                                        {isUploading && <p className="text-sm text-primary">Upload en cours...</p>}
                                        {newCategoryImage && (
                                            <div className="relative h-32 rounded-lg overflow-hidden border border-border">
                                                <AppImage src={newCategoryImage} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth font-medium shadow-warm-md disabled:opacity-50"
                                >
                                    Ajouter
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List */}
                    <div className="lg:col-span-2">
                        <div className="bg-card rounded-lg shadow-warm-md border border-border overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nom</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                                                Aucune catégorie trouvée
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((category) => (
                                            <tr key={category.id} className="hover:bg-muted/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted border border-border">
                                                        {category.image ? (
                                                            <AppImage src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                                <Icon name="PhotoIcon" size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-foreground">
                                                    {category.name}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-smooth"
                                                        title="Supprimer"
                                                    >
                                                        <Icon name="TrashIcon" size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCategoryManagementInteractive;
