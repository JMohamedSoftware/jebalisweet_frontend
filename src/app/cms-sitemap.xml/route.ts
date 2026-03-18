import { NextResponse } from 'next/server';

export async function GET() {
    const baseUrl = 'https://jebalisweet.tn';

    const staticPages = [
        { url: '', priority: 1.0, changefreq: 'daily' },
        { url: '/product-catalog', priority: 0.9, changefreq: 'daily' },
        { url: '/custom-cake', priority: 0.8, changefreq: 'monthly' },
        { url: '/login', priority: 0.5, changefreq: 'monthly' },
        { url: '/register', priority: 0.5, changefreq: 'monthly' },
        { url: '/terms', priority: 0.3, changefreq: 'yearly' },
        { url: '/privacy', priority: 0.3, changefreq: 'yearly' },
    ];

    const urlset = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
            .map((page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
            .join('')}
</urlset>`;

    return new NextResponse(urlset, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
        },
    });
}
