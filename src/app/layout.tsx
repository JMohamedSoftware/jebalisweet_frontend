import React from 'react';
import '../styles/index.css';
import { LanguageProvider } from '@/context/LanguageContext';

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
  description: 'Découvrez les délices de Jebali Sweet : chocolats artisanaux, gâteaux personnalisés et salés raffinés par Chef Aida Jebali en Tunisie. Qualité premium pour tous vos événements.',
  keywords: 'chef aida jebali, aida jebali, jebali sweet, jebali sweet tunisie, pâtisserie tunisie, chocolat artisanal, gâteau sur mesure, gâteau anniversaire, salés tunisiens, pâtisserie fine, jebalisweet.tn, commande gâteau en ligne',
  authors: [{ name: 'Chef Aida Jebali' }],
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
        url: '/og-image.jpg', // Ensure this exists or fallback to a default
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
    images: ['/og-image.jpg'],
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
    <html lang="fr">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
