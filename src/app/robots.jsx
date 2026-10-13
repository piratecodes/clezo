export default function robots() {
  return {
    rules: [
        {
        userAgent: '*',
        allow: '/',
        },
        {
        userAgent: ['Applebot', 'Bingbot', 'Googlebot', 'GPTBot', 'Google-Extended', 'Claude-Web', 'PerplexityBot', 'CCBot', 'Mediapartners-Google', 'AdsBot-Google', 'Googlebot-Image', 'Googlebot-News', 'Googlebot-Video'],
        allow: ['/'],
        }
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.clezo.in'}/sitemap.xml`,
  }
}