'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'patisserie' | 'support';
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, type }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const title = type === 'support'
        ? t('contact.modal.titleSupport')
        : t('contact.modal.titleGeneral');
    const subtitle = type === 'support'
        ? t('contact.modal.subtitleSupport')
        : t('contact.modal.subtitleGeneral');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    type,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                // Reset form after success
                setTimeout(() => {
                    onClose();
                    setFormData({ name: '', email: '', message: '' });
                    setSubmitStatus('idle');
                }, 3000);
            } else {
                setSubmitStatus('error');
                setErrorMessage(data.message || t('common.error'));
            }
        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage(t('common.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-card border border-border/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-500">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/10 bg-muted/30">
                    <div>
                        <h2 className="text-xl font-bold text-foreground font-heading">{title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-background border border-border hover:bg-muted hover:text-primary transition-colors flex-shrink-0"
                        aria-label={t('quickView.close')}
                    >
                        <Icon name="XMarkIcon" size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {submitStatus === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-500">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <Icon name="CheckIcon" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">{t('contact.modal.successTitle')}</h3>
                            <p className="text-muted-foreground">{t('contact.modal.successMessage')}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="name" className="text-sm font-medium text-foreground">{t('contact.modal.form.name')}</label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                            placeholder={t('contact.modal.form.namePlaceholder')}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label htmlFor="email" className="text-sm font-medium text-foreground">{t('contact.modal.form.email')}</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                            placeholder={t('contact.modal.form.emailPlaceholder')}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="message" className="text-sm font-medium text-foreground">{t('contact.modal.form.message')}</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
                                        placeholder={t('contact.modal.form.messagePlaceholder')}
                                    />
                                </div>

                                {submitStatus === 'error' && (
                                    <div className="p-3 rounded-xl bg-error/10 text-error text-sm text-center border border-error/20 flex items-center justify-center gap-2">
                                        <Icon name="ExclamationTriangleIcon" size={16} />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="pt-4 border-t border-border/10 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl border border-input bg-background hover:bg-muted text-foreground font-medium transition-colors text-sm disabled:opacity-50"
                                >
                                    {t('contact.modal.form.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                                            <span>{t('contact.modal.form.submitting')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="PaperAirplaneIcon" size={16} />
                                            <span>{t('contact.modal.form.submit')}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
