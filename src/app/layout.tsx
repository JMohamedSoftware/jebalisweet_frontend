import React from 'react';
import '../styles/index.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import CartDrawer from '@/components/common/CartDrawer';
import StructuredData from '@/components/common/StructuredData';
import type { Metadata } from 'next';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL('https://jebalisweet.tn'),
  title: {
    default: 'Jebali Sweet - Pâtisserie & Chocolaterie Fine par Chef Aida Jebali',
    template: '%s | Jebali Sweet'
  },
  description: 'Jebali Sweet - Pâtisserie & Chocolaterie Fine par Chef Aida Jebali en Tunisie. Découvrez nos chocolats artisanaux, gâteaux personnalisés sur mesure et salés raffinés. Qualité premium et livraison à domicile. جبالي سويت - حلويات راقية بتونس.',
  keywords: [
    // Brand name variations
    'jebalisweet', 'jebali sweet', 'jebali', 'sweet jebali', 'jebalis', 'jebali sweet tunisie',
    'jebalisweet.tn', 'chef aida jebali', 'aida jebali',
    // Arabic
    'جبالي سويت', 'جبالي', 'حلويات جبالي',
    // Products
    'pâtisserie tunisie', 'chocolat artisanal tunis', 'gâteau sur mesure tunis',
    'gâteau anniversaire personnalisé', 'salés tunisiens raffinés', 'pâtisserie fine tunisie',
    'commande gâteau en ligne tunisie', 'meilleur pâtissier tunisie', 'box chocolat tunisie',
    'gâteau livraison tunis', 'chocolaterie tunisie', 'confiserie tunisie',
    'حلويات تونسية', 'كعك تونس', 'شوكولاطة تونس'
  ],
  authors: [{ name: 'Chef Aida Jebali' }],
  category: 'Pâtisserie & Chocolaterie',
  classification: 'Business',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Jebali Sweet - Pâtisserie & Chocolaterie Fine par Chef Aida Jebali',
    description: 'Chocolats artisanaux, gâteaux personnalisés et salés raffinés en Tunisie.',
    url: 'https://jebalisweet.tn',
    siteName: 'Jebali Sweet',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jebali Sweet - Pâtisserie Fine',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jebali Sweet - Pâtisserie Fine',
    description: 'Chocolats artisanaux et gâteaux personnalisés en Tunisie.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="smooth-scroll">
      <head>
        {/* Google Fonts preconnect and link for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+3:wght@400;500&family=Nunito+Sans:wght@400;500&display=swap"
        />
        {/* Preload hero background for optimal LCP */}
        <link
          rel="preload"
          as="image"
          href="/images/17189029461596829888opals_3200x1200.jpg"
          type="image/jpeg"
        />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <WishlistProvider>
            <CartProvider>
              <StructuredData />
              {children}
              <CartDrawer />
            </CartProvider>
          </WishlistProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
