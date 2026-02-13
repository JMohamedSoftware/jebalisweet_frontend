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
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="container mx-auto px-6 py-12">
                <div className="max-w-6xl mx-auto">
                    <CakeConfigurator />
                </div>
            </main>
        </div>
    );
};

export default CustomCakePage;
