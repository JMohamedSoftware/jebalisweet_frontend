import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://jebalisweet.tn';
    const apiBaseUrl = 'https://jebalisweet-backend.onrender.com/api';

    try {
        const response = await fetch(`${apiBaseUrl}/products?limit=100`, {
            next: { revalidate: 3600 },
        });
        const data = await response.json();
        const products = data.products || [];

        const productUrls = products.map((product: any) => ({
            url: `${baseUrl}/product/${product._id || product.id}`,
            lastModified: new Date(product.updatedAt || new Date()),
        }));

        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: `${baseUrl}/product-catalog`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/login`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
            },
            {
                url: `${baseUrl}/register`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
            },
            {
                url: `${baseUrl}/custom-cake`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            },
            ...productUrls,
        ];
    } catch (error) {
        console.error('Sitemap generation error:', error);
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
            },
            {
                url: `${baseUrl}/product-catalog`,
                lastModified: new Date(),
            },
        ];
    }
}
