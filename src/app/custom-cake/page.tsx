import React from 'react';
import Header from '@/components/common/Header';
import CakeConfigurator from '@/components/features/CakeConfigurator';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Personnalisez votre Gâteau - Jebali Sweet',
    description: 'Créez le gâteau de vos rêves avec notre configurateur interactif. Choisissez vos étages, saveurs et couleurs.',
};

const CustomCakePage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto px-6 py-12 relative overflow-hidden">
                {/* Chic light/warm gradient background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-80 pointer-events-none" />
                <div className="max-w-6xl mx-auto relative z-10">
                    <CakeConfigurator />
                </div>
            </main>
        </div>
    );
};

export default CustomCakePage;
