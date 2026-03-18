import { NextResponse } from 'next/server';

function escapeXml(unsafe: string) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

export async function GET() {
    const baseUrl = 'https://jebalisweet.tn';
    const apiBaseUrl = 'https://jebalisweet-backend.onrender.com/api';

    try {
        const response = await fetch(`${apiBaseUrl}/categories`, {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(15000), // 15s timeout
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const categories = await response.json();

        const urlset = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${categories
                .map((category: any) => {
                    const name = category.name || category;
                    const encodedName = encodeURIComponent(name);
                    const url = `${baseUrl}/product-catalog?category=${encodedName}`;
                    return `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
                })
                .join('')}
</urlset>`;

        return new NextResponse(urlset, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error) {
        console.error('Category sitemap error:', error);
        // Fallback to minimal valid sitemap instead of 500
        const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/product-catalog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
</urlset>`;
        return new NextResponse(fallback, {
            headers: { 'Content-Type': 'application/xml' },
        });
    }
}
