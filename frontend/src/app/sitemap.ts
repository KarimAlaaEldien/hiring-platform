import type { MetadataRoute } from 'next';

type SitemapJob = {
  _id: string;
  createdAt?: string;
};

async function getJobs(): Promise<SitemapJob[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  try {
    const response = await fetch(`${apiUrl}/jobs`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const jobs = await getJobs();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...jobs.map((job) => ({
      url: `${siteUrl}/jobs/${job._id}`,
      lastModified: job.createdAt ? new Date(job.createdAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
