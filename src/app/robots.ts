import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin',
                '/dashboard',
                '/cart',
                '/checkout',
                '/api',
                '/profile',
                '/delivery-dashboard',
                '/admin-category-management',
                '/admin-dashboard',
                '/admin-order-management',
                '/admin-product-management',
                '/admin-promotion-management',
                '/admin-testimonial-management',
                '/admin-user-management',
            ],
        },
        sitemap: 'https://jebalisweet.tn/sitemap.xml',
    };
}
