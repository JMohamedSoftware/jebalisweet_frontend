'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

interface Testimonial {
    id: string;
    name: string;
    location: string;
    rating: number;
    comment: string;
    date: string;
}

const AdminTestimonialManagementInteractive = () => {
    const router = useRouter();
    const { t } = useLanguage();
    const [isHydrated, setIsHydrated] = useState(false);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newTestimonial, setNewTestimonial] = useState({
        name: '',
        location: '',
        rating: 5,
        comment: '',
        date: new Date().toLocaleDateString('fr-FR')
    });

    const fetchTestimonials = async () => {
        setIsLoading(true);
        try {
            const data = await api.testimonials.getAll();
            setTestimonials(data);
        } catch (error) {
            console.error('Failed to fetch testimonials', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsHydrated(true);
        const userData = localStorage.getItem('user');
        if (!userData || JSON.parse(userData).role !== 'admin') {
            router.push('/login');
            return;
        }
        fetchTestimonials();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.testimonials.create(newTestimonial);
            setNewTestimonial({
                name: '',
                location: '',
                rating: 5,
                comment: '',
                date: new Date().toLocaleDateString('fr-FR')
            });
            await fetchTestimonials();
            alert(t('admin.testimonials.successAdd'));
        } catch (error) {
            console.error('Failed to create testimonial', error);
            alert(t('admin.testimonials.errorAdd'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('common.confirmDelete'))) return;
        try {
            await api.testimonials.delete(id);
            await fetchTestimonials();
        } catch (error) {
            console.error('Failed to delete testimonial', error);
            alert(t('admin.testimonials.errorDelete'));
        }
    };

    if (!isHydrated) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
                            {t('admin.testimonials.title')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('admin.testimonials.subtitle')}
                        </p>
                    </div>
                    <Link
                        href="/admin-dashboard"
                        className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium w-fit"
                    >
                        <Icon name="ArrowLeftIcon" size={20} />
                        {t('admin.testimonials.backToDashboard')}
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* New Testimonial Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-xl border border-border p-6 shadow-warm-md sticky top-24">
                            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <Icon name="PlusCircleIcon" size={24} className="text-primary" />
                                {t('admin.testimonials.newTitle')}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">{t('admin.testimonials.clientName')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={newTestimonial.name}
                                        onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 ring-primary transition-smooth"
                                        placeholder={t('admin.testimonials.placeholderName')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">{t('admin.testimonials.location')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={newTestimonial.location}
                                        onChange={(e) => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
                                        className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 ring-primary transition-smooth"
                                        placeholder={t('admin.testimonials.placeholderLocation')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">{t('admin.testimonials.rating')}</label>
                                    <select
                                        value={newTestimonial.rating}
                                        onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 ring-primary transition-smooth"
                                    >
                                        {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} {t('admin.testimonials.stars')}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">{t('admin.testimonials.comment')}</label>
                                    <textarea
                                        required
                                        value={newTestimonial.comment}
                                        onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 ring-primary transition-smooth resize-none"
                                        placeholder={t('admin.testimonials.placeholderComment')}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-smooth shadow-warm-md flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Icon name="CheckIcon" size={20} /> {t('admin.testimonials.add')}</>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Testimonials List */}
                    <div className="lg:col-span-2">
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />)}
                            </div>
                        ) : testimonials.length === 0 ? (
                            <div className="bg-card rounded-xl border border-dashed border-border p-12 text-center">
                                <Icon name="ChatBubbleLeftRightIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">{t('admin.testimonials.empty')}</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {testimonials.map((t_item) => (
                                    <div key={t_item.id} className="bg-card rounded-xl border border-border p-6 shadow-warm-md hover:shadow-warm-lg transition-smooth flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-foreground">{t_item.name}</h3>
                                                <span className="text-xs text-muted-foreground">• {t_item.location}</span>
                                            </div>
                                            <div className="flex gap-0.5 mb-2">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Icon key={i} name="StarIcon" size={14} className={i < t_item.rating ? 'text-warning' : 'text-muted'} />
                                                ))}
                                            </div>
                                            <p className="text-muted-foreground text-sm italic">"{t_item.comment}"</p>
                                            <p className="text-[10px] text-muted-foreground mt-4 font-bold uppercase tracking-wider">{t_item.date}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(t_item.id)}
                                            className="p-2 text-error hover:bg-error/10 rounded-lg transition-smooth"
                                            title="Supprimer"
                                        >
                                            <Icon name="TrashIcon" size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTestimonialManagementInteractive;
