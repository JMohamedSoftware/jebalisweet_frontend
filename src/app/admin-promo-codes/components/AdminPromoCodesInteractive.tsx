'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import PageLoader from '@/components/ui/PageLoader';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

interface PromoCode {
    _id?: string;
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
    isActive: boolean;
    expiryDate?: string;
    usageLimit?: number | null;
    usageCount?: number;
}

const AdminPromoCodesInteractive = () => {
    const router = useRouter();
    const { t } = useLanguage();
    const [isHydrated, setIsHydrated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [codes, setCodes] = useState<PromoCode[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
    const [formData, setFormData] = useState<PromoCode>({
        code: '',
        discount: 0,
        type: 'percentage',
        isActive: true,
        usageLimit: null
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        setIsHydrated(true);
        const userData = localStorage.getItem('user');
        if (!userData || JSON.parse(userData).role !== 'admin') {
            router.push('/login');
            return;
        }
        loadCodes();
    }, [router]);

    const loadCodes = async () => {
        try {
            const data = await api.promoCodes.getAll();
            setCodes(data);
        } catch (error) {
            console.error("Failed to load promo codes", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (code: PromoCode | null = null) => {
        if (code) {
            setEditingCode(code);
            setFormData({ ...code });
        } else {
            setEditingCode(null);
            setFormData({
                code: '',
                discount: 0,
                type: 'percentage',
                isActive: true,
                usageLimit: null
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCode(null);
        setMessage(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        try {
            if (editingCode && editingCode._id) {
                await api.promoCodes.update(editingCode._id, formData);
                setMessage({ type: 'success', text: 'Code promo mis à jour !' });
            } else {
                await api.promoCodes.create(formData);
                setMessage({ type: 'success', text: 'Code promo créé !' });
            }
            loadCodes();
            setTimeout(handleCloseModal, 1500);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erreur lors de la sauvegarde' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer ce code promo ?')) return;
        try {
            await api.promoCodes.delete(id);
            loadCodes();
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    if (!isHydrated || isLoading) return <PageLoader />;

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground">Gestion des Codes Promo</h1>
                    <p className="text-muted-foreground">Créez et gérez les coupons de réduction pour vos clients.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin-dashboard" className="text-primary hover:underline flex items-center gap-2">
                        <Icon name="ArrowLeftIcon" size={18} />
                        Retour Dashboard
                    </Link>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Icon name="PlusIcon" size={18} />
                        Nouveau Code
                    </button>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-warm">
                <table className="w-full text-left">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-6 py-4 font-bold border-b border-border">Code</th>
                            <th className="px-6 py-4 font-bold border-b border-border">Remise</th>
                            <th className="px-6 py-4 font-bold border-b border-border">Statut</th>
                            <th className="px-6 py-4 font-bold border-b border-border">Utilisations</th>
                            <th className="px-6 py-4 font-bold border-b border-border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {codes.map((item) => (
                            <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-primary">{item.code}</td>
                                <td className="px-6 py-4">
                                    {item.type === 'percentage' ? `${item.discount}%` : `${item.discount} DT`}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                        {item.isActive ? 'Actif' : 'Inactif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {item.usageCount} / {item.usageLimit || '∞'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-3">
                                        <button onClick={() => handleOpenModal(item)} className="text-accent hover:scale-110 transition-transform">
                                            <Icon name="PencilSquareIcon" size={20} />
                                        </button>
                                        <button onClick={() => item._id && handleDelete(item._id)} className="text-error hover:scale-110 transition-transform">
                                            <Icon name="TrashIcon" size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {codes.length === 0 && <div className="p-10 text-center text-muted-foreground">Aucun code promo trouvé.</div>}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border p-8 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold mb-6">{editingCode ? 'Modifier le Code' : 'Nouveau Code Promo'}</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Code (ex: SAVE20)</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-border rounded-lg uppercase"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select 
                                        name="type" 
                                        value={formData.type} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-border rounded-lg"
                                    >
                                        <option value="percentage">Pourcentage (%)</option>
                                        <option value="fixed">Montant Fixe (DT)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Valeur</label>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-border rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Limite d'utilisation (Optionnel)</label>
                                <input
                                    type="number"
                                    name="usageLimit"
                                    value={formData.usageLimit || ''}
                                    onChange={handleChange}
                                    placeholder="Illimité si vide"
                                    className="w-full px-4 py-2 border border-border rounded-lg"
                                />
                            </div>

                            <div className="flex items-center gap-2 py-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-foreground">Code Actif</label>
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={handleCloseModal} className="flex-1 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg font-bold shadow-lg hover:opacity-90 transition-opacity">
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPromoCodesInteractive;
