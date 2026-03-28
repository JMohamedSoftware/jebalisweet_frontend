'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import ContactModal from './ContactModal';
import { useLanguage } from '@/context/LanguageContext';
import AppImage from '@/components/ui/AppImage';

const Footer = () => {
    const { t } = useLanguage();
    const [showEmails, setShowEmails] = useState(false);
    const [modalType, setModalType] = useState<'patisserie' | 'support' | null>(null);

    // Falling back to hardcoded strings if t('footer.about.title') etc. are missing
    const getT = (path: string, fallback: string) => {
        const val = t(path);
        return val === path ? fallback : val;
    };

    return (
        <footer className="bg-card border-t border-border/10 mt-12 py-16 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />

            {/* Premium Botanical Watermark (3oref) */}
            <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] opacity-[0.03] pointer-events-none z-0">
                <AppImage
                    src="/images/botanical_branch.png"
                    alt="Botanical Decoration"
                    fill
                    className="object-contain"
                />
            </div>
            <div className="container mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* About Section */}
                    <div className="space-y-6">
                        <h3 className="font-heading text-xl font-black text-primary tracking-tight uppercase">
                            {getT('footer.about.title', 'À Propos')}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            {getT('footer.about.description', 'Jebali Sweet est votre destination privilégiée pour des créations Jebali Sweet de haute qualité, alliant tradition et innovation sucrée.')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="font-heading text-xl font-black text-primary tracking-tight uppercase">
                            {getT('footer.links.title', 'Liens Rapides')}
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/product-catalog" className="text-sm text-muted-foreground hover:text-primary transition-colors font-bold">
                                    {getT('footer.links.catalog', 'Catalogue')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/user-profile" className="text-sm text-muted-foreground hover:text-primary transition-colors font-bold">
                                    {getT('footer.links.account', 'Mon Compte')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary transition-colors font-bold">
                                    {getT('footer.links.orders', 'Mes Commandes')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-6">
                        <h3 className="font-heading text-xl font-black text-primary tracking-tight uppercase">
                            {getT('footer.contact.title', 'Contact')}
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-muted-foreground pb-2">
                                <Icon name="PhoneIcon" size={20} className="text-primary flex-shrink-0" />
                                <span className="font-black text-foreground text-xl tracking-tight" dir="ltr">+216 46 340 400</span>
                            </li>
                            <li className="flex items-start gap-4 text-muted-foreground group">
                                <Icon name="MapPinIcon" size={20} className="text-primary mt-1 flex-shrink-0" />
                                <a
                                    href="https://www.google.com/maps/place/Patisserie+Jebali+Sweet/@37.013526,10.9507302,348m/data=!3m2!1e3!4b1!4m6!3m5!1s0x131d4796ea4aeaff:0x295bb8f35d8502a2!8m2!3d37.013526!4d10.9520177!16s%2Fg%2F11mvj5rgdy?entry=ttu&g_ep=EgoyMDI2MDMxMC4wIKXMDSoASAFQAw%3D%3D"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors leading-relaxed"
                                >
                                    <span className="block text-foreground font-black text-base mb-0.5 tracking-tight uppercase">Patisserie Jebali Sweet</span>
                                    <span className="text-xs font-bold text-muted-foreground/60 group-hover:text-primary/70 transition-colors uppercase tracking-[0.1em]">Saheb Jebal</span>
                                </a>
                            </li>

                            <li className="pt-4 border-t border-border/10">
                                <button
                                    onClick={() => setShowEmails(!showEmails)}
                                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-black text-xs uppercase tracking-widest group"
                                >
                                    <Icon name="EnvelopeIcon" size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                                    <span>{getT('footer.contact.emailButton', 'Nous contacter par e-mail')}</span>
                                    <Icon name={showEmails ? "ChevronUpIcon" : "ChevronDownIcon"} size={16} className={`transition-transform duration-300 ${showEmails ? 'rotate-180' : ''}`} />
                                </button>
                                {/* ... rest of email logic stays same ... */}

                                {showEmails && (
                                    <div className="mt-4 pl-7 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex flex-col gap-0.5 relative group/mail">
                                            <button
                                                onClick={() => setModalType('patisserie')}
                                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                                            >
                                                <span>AidaJebali@jebalisweet.tn</span>
                                            </button>
                                            <span className="text-[11px] text-muted-foreground/60 italic">
                                                {getT('footer.contact.phoneFallback', '(Si injoignable par téléphone)')}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-0.5 relative group/support">
                                            <button
                                                onClick={() => setModalType('support')}
                                                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors font-medium text-left"
                                            >
                                                <Icon name="WrenchIcon" size={14} className="text-primary/80" />
                                                <span>{getT('footer.contact.techSupport', 'Support Technique')}</span>
                                            </button>
                                            <span className="text-[11px] text-muted-foreground/60 italic border-l-2 border-primary/20 pl-2 ml-1 mt-1">
                                                MohamedJbeli@jebalisweet.tn
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>

                    {/* Social Section */}
                    <div className="space-y-4">
                        <h3 className="font-heading text-xl font-bold text-foreground">
                            {getT('footer.social.title', 'Suivez-nous')}
                        </h3>
                        <div className="flex gap-4">
                            <a
                                href="https://www.facebook.com/profile.php?id=100064274102694"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10 hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
                                aria-label="Facebook"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.instagram.com/aida.jebali.940/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10 hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
                                aria-label="Instagram"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start space-y-2">
                        <p className="text-sm font-medium text-foreground tracking-wide">
                            © {new Date().getFullYear()} Jebali Sweet
                        </p>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">
                            {getT('footer.copy', 'Tous droits réservés')}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-px w-12 bg-primary/30 hidden md:block"></div>
                        <p className="text-sm text-muted-foreground font-light italic">
                            Elevating the art of <span className="text-primary font-medium not-italic">Sweetness</span>
                        </p>
                    </div>
                </div>
            </div>

            <ContactModal
                isOpen={modalType !== null}
                onClose={() => setModalType(null)}
                type={modalType || 'patisserie'}
            />
        </footer>
    );
};

export default Footer;
