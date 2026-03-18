'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import BreadcrumbTrail from '@/components/common/BreadcrumbTrail';
import Footer from '@/components/common/Footer';
import Icon from '@/components/ui/AppIcon';

export default function TermsPage() {
    const router = useRouter();
    return (
        <>
            <Header />
            <BreadcrumbTrail />
            <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="mb-6 flex items-center gap-2 text-primary hover:text-primary/80 transition-smooth font-medium group"
                    >
                        <Icon name="ArrowLeftIcon" size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Retour
                    </button>
                    <div className="bg-card rounded-2xl shadow-warm-xl p-8 md:p-12 border border-border/50">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-4">
                                Conditions Générales d'Utilisation
                            </h1>
                            <p className="text-muted-foreground italic">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
                        </div>

                        <div className="space-y-10 text-foreground/90 leading-relaxed">
                            <section>
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">01</span>
                                    Objet
                                </h2>
                                <p>
                                    Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités de mise à disposition du site <strong>Jebali Sweet</strong> et les conditions d'utilisation par l'utilisateur. Toute navigation sur le site implique l'acceptation pleine et entière des présentes CGU.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">02</span>
                                    Commandes et Produits
                                </h2>
                                <p>
                                    Jebali Sweet s'efforce de présenter le plus fidèlement possible les caractéristiques de ses produits (chocolats, gâteaux, pâtisseries). Toutefois, s'agissant de produits artisanaux, de légères variations peuvent exister. Les commandes sont fermes à réception du paiement ou de la confirmation de devis pour les produits personnalisés.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">03</span>
                                    Prix et Paiement
                                </h2>
                                <p>
                                    Les prix sont indiqués en Dinars Tunisiens (DT). Jebali Sweet se réserve le droit de modifier ses prix à tout moment. Le paiement s'effectue selon les modalités proposées au moment de la validation de la commande (paiement à la livraison ou virement).
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">04</span>
                                    Propriété Intellectuelle
                                </h2>
                                <p>
                                    L'ensemble du contenu du site (logos, textes, photographies, designs des gâteaux) est la propriété exclusive de <strong>Chef Aida Jebali</strong> et de la marque <strong>Jebali Sweet</strong>. Toute reproduction même partielle est strictement interdite sans autorisation préalable.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">05</span>
                                    Responsabilité
                                </h2>
                                <p>
                                    Jebali Sweet ne saurait être tenu responsable des dommages indirects qui pourraient survenir du fait de l'achat des produits. La responsabilité de l'entreprise est limitée au montant de la commande.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
