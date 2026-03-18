'use client';

import React from 'react';

const StructuredData = () => {
    // LocalBusiness schema (most important for Google Search recognition)
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'Bakery', 'FoodEstablishment'],
        '@id': 'https://jebalisweet.tn/#business',
        'name': 'Jebali Sweet',
        'alternateName': ['جبالي سويت', 'Jebali', 'Sweet Jebali', 'JebaliSweet', 'Jebali Sweet Tunisie', 'Jebalis'],
        'url': 'https://jebalisweet.tn',
        'logo': {
            '@type': 'ImageObject',
            'url': 'https://jebalisweet.tn/android-chrome-512x512.png',
            'width': 512,
            'height': 512
        },
        'image': 'https://jebalisweet.tn/android-chrome-512x512.png',
        'description': 'Jebali Sweet - Pâtisserie & Chocolaterie Fine par Chef Aida Jebali en Tunisie. Chocolats artisanaux, gâteaux anniversaire personnalisés, salés raffinés et livraison à domicile. جبالي سويت - حلويات وشوكولاتة فاخرة بتونس.',
        'founder': {
            '@type': 'Person',
            'name': 'Chef Aida Jebali'
        },
        'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Tunis',
            'addressRegion': 'Tunis',
            'addressCountry': 'TN'
        },
        'geo': {
            '@type': 'GeoCoordinates',
            'latitude': 37.0135264,
            'longitude': 10.9519357,
            'addressCountry': 'TN'
        },
        'hasMap': 'https://www.google.com/maps/place/Aida+Jbeli/@37.0134493,10.9518109,47m/data=!3m1!1e3!4m14!1m7!3m6!1s0x131d4796ea4aeaff:0x295bb8f35d8502a2!2sPatisserie+Diamant!8m2!3d37.013526!4d10.9520177!16s%2Fg%2F11mvj5rgdy!3m5!1s0x131d47677d1fd091:0x35437855bbdf7a11!8m2!3d37.0135264!4d10.9519357!16s%2Fg%2F11qn145yqh?entry=ttu&g_ep=EgoyMDI2MDMwOS4wIKXMDSoASAFQAw%3D%3D',
        'telephone': '+216 46 340 400',
        'servesCuisine': ['Pâtisserie', 'Chocolaterie', 'Confiserie'],
        'hasOfferCatalog': {
            '@type': 'OfferCatalog',
            'name': 'Produits Jebali Sweet',
            'itemListElement': [
                { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Chocolats artisanaux' } },
                { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Gâteaux personnalisés sur mesure' } },
                { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Salés raffinés tunisiens' } },
                { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Gâteaux d\'anniversaire' } }
            ]
        },
        'sameAs': [
            'https://www.facebook.com/profile.php?id=100064274102694',
            'https://www.instagram.com/aida.jebali.940/'
        ],
        'contactPoint': {
            '@type': 'ContactPoint',
            'telephone': '+216 46 340 400',
            'contactType': 'customer service',
            'availableLanguage': ['French', 'Arabic']
        }
    };

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': 'https://jebalisweet.tn/#organization',
        'name': 'Jebali Sweet',
        'alternateName': ['JebaliSweet', 'Jebali', 'Sweet Jebali', 'Jebalis'],
        'url': 'https://jebalisweet.tn',
        'logo': {
            '@type': 'ImageObject',
            'url': 'https://jebalisweet.tn/android-chrome-512x512.png'
        },
        'description': 'Pâtisserie & Chocolaterie Fine par Chef Aida Jebali en Tunisie.',
        'foundingDate': '2020',
        'founder': {
            '@type': 'Person',
            'name': 'Aida Jebali'
        },
        'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Tunis',
            'addressCountry': 'TN'
        },
        'contactPoint': {
            '@type': 'ContactPoint',
            'telephone': '+216 46 340 400',
            'contactType': 'customer service'
        },
        'sameAs': [
            'https://www.facebook.com/profile.php?id=100064274102694',
            'https://www.instagram.com/aida.jebali.940/'
        ]
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://jebalisweet.tn/#website',
        'name': 'Jebali Sweet',
        'alternateName': ['JebaliSweet', 'Jebali Sweet Tunisie', 'jebalisweet.tn'],
        'url': 'https://jebalisweet.tn',
        'publisher': {
            '@id': 'https://jebalisweet.tn/#organization'
        },
        'inLanguage': ['fr', 'ar'],
        'potentialAction': {
            '@type': 'SearchAction',
            'target': {
                '@type': 'EntryPoint',
                'urlTemplate': 'https://jebalisweet.tn/product-catalog?search={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
        }
    };

    // SiteNavigation schema → hints Google to show sitelinks (Accueil, Produits, etc.)
    const siteNavigationSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Navigation principale - Jebali Sweet',
        'itemListElement': [
            {
                '@type': 'SiteLinksSearchBox',
                'target': 'https://jebalisweet.tn/product-catalog?search={search_term_string}'
            },
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Accueil',
                'description': 'Page d\'accueil Jebali Sweet - Pâtisserie & Chocolaterie Fine en Tunisie',
                'url': 'https://jebalisweet.tn'
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Produits & Catalogue',
                'description': 'Découvrez tous nos produits: chocolats artisanaux, gâteaux et salés',
                'url': 'https://jebalisweet.tn/product-catalog'
            },
            {
                '@type': 'ListItem',
                'position': 3,
                'name': 'Gâteau Personnalisé',
                'description': 'Commandez votre gâteau sur mesure avec Chef Aida Jebali',
                'url': 'https://jebalisweet.tn/custom-cake'
            },
            {
                '@type': 'ListItem',
                'position': 4,
                'name': 'Promotions',
                'description': 'Nos offres et promotions du moment',
                'url': 'https://jebalisweet.tn/product-catalog?promo=true'
            },
            {
                '@type': 'ListItem',
                'position': 5,
                'name': 'Mon Compte',
                'description': 'Connectez-vous à votre compte Jebali Sweet',
                'url': 'https://jebalisweet.tn/login'
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
            />
        </>
    );
};

export default StructuredData;
