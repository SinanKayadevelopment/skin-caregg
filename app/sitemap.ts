import { MetadataRoute } from 'next';
import { getAllProducts, getPopularComparePairs, getAllConflictRoutes } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skin-caregg.vercel.app';
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // 1. All Dupe pages (/dupes/[slug])
  const dupeRoutes: MetadataRoute.Sitemap = getAllProducts().map((p) => ({
    url: `${baseUrl}/dupes/${p.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: p.isLuxuryTarget ? 0.9 : 0.7,
  }));

  // 2. All Compare pages (/compare/[slug])
  const compareRoutes: MetadataRoute.Sitemap = getPopularComparePairs().map((pair) => ({
    url: `${baseUrl}/compare/${pair.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. All Conflict guides (/conflicts/[slug])
  const conflictRoutes: MetadataRoute.Sitemap = getAllConflictRoutes().map((route) => ({
    url: `${baseUrl}/conflicts/${route.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...dupeRoutes, ...compareRoutes, ...conflictRoutes];
}
