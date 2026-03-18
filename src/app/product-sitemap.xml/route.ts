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
        const response = await fetch(`${apiBaseUrl}/products?limit=1000`, {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(20000), // 20s timeout
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        const products = data.products || [];

        const urlset = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${products
                .map((product: any) => {
                    const id = product._id || product.id;
                    const url = `${baseUrl}/product/${id}`;
                    return `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${new Date(product.updatedAt || new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
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
        console.error('Product sitemap error:', error);
        // Fallback to avoid 500
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
