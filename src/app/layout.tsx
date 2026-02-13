import React from 'react';
import '../styles/index.css';
import { LanguageProvider } from '@/context/LanguageContext';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Jebali Sweet - Pâtisserie & Chocolaterie Fine par Chef Aida Jebali',
  description: 'Découvrez les délices de Jebali Sweet : chocolats artisanaux, gâteaux personnalisés et salés raffinés par Chef Aida Jebali en Tunisie. Qualité premium pour tous vos événements.',
  keywords: 'chef aida jebali, aida jebali, jebali sweet, jebali sweet tunisie, pâtisserie tunisie, chocolat artisanal, gâteau sur mesure, gâteau anniversaire, salés tunisiens, pâtisserie fine, jebalisweet.tn, commande gâteau en ligne',
  authors: [{ name: 'Chef Aida Jebali' }],
  openGraph: {
    title: 'Jebali Sweet - Pâtisserie & Chocolaterie Fine par Chef Aida Jebali',
    description: 'Chocolats artisanaux, gâteaux personnalisés et salés raffinés en Tunisie.',
    url: 'https://jebalisweet.tn',
    siteName: 'Jebali Sweet',
    locale: 'fr_FR',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fjebaliswe9208back.builtwithrocket.new&_be=https%3A%2F%2Fapplication.rocket.new&_v=0.1.12" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></body>
    </html>
  );
}
