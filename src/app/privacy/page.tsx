'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import BreadcrumbTrail from '@/components/common/BreadcrumbTrail';
import Footer from '@/components/common/Footer';
import Icon from '@/components/ui/AppIcon';

export default function PrivacyPage() {
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
                                Politique de Confidentialité
                            </h1>
                            <p className="text-muted-foreground italic">Votre confiance est notre priorité. Voici comment nous traitons vos données.</p>
                        </div>

                        <div className="space-y-12">
                            <section>
                                <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-3">
                                    <Icon name="ShieldCheckIcon" size={24} className="text-success" />
                                    Utilisation de vos données
                                </h2>
                                <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-muted/50">
                                                <th className="px-6 py-4 font-semibold text-primary">Donnée collectée</th>
                                                <th className="px-6 py-4 font-semibold text-primary">Finalité / Pourquoi ?</th>
                                                <th className="px-6 py-4 font-semibold text-primary">Conservation</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            <tr>
                                                <td className="px-6 py-4 font-medium">Nom & Prénom</td>
                                                <td className="px-6 py-4 text-muted-foreground">Identification de votre commande et facturation.</td>
                                                <td className="px-6 py-4 text-muted-foreground text-sm">Durée de vie du compte</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 font-medium">Adresse Email</td>
                                                <td className="px-6 py-4 text-muted-foreground">Confirmation de commande et suivi client.</td>
                                                <td className="px-6 py-4 text-muted-foreground text-sm">Durée de vie du compte</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 font-medium">Numéro de Téléphone</td>
                                                <td className="px-6 py-4 text-muted-foreground">Coordination de la livraison par le livreur.</td>
                                                <td className="px-6 py-4 text-muted-foreground text-sm">Jusqu'à livraison</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 font-medium">Adresse Postale</td>
                                                <td className="px-6 py-4 text-muted-foreground">Lieu de livraison physique de vos pâtisseries.</td>
                                                <td className="px-6 py-4 text-muted-foreground text-sm">Durée de vie du compte</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                                <h2 className="text-xl font-semibold mb-4 text-primary">Sécurité et Protection</h2>
                                <p className="text-foreground/80 leading-relaxed">
                                    Jebali Sweet s'engage à protéger vos informations personnelles contre tout accès non autorisé. Nous utilisons des protocoles de sécurité avancés et limitons l'accès à vos données uniquement au personnel strictement nécessaire pour le traitement de vos commandes (Service client, Administration et Livreurs).
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-foreground">Vos Droits</h2>
                                <p className="text-foreground/80 leading-relaxed">
                                    Conformément à la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Vous pouvez exercer ces droits à tout moment depuis votre profil utilisateur ou en nous contactant directement par email à <strong>AidaJebali.Sweet@gmail.com</strong>.
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
