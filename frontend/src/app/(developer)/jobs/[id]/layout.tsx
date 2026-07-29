import type { Metadata } from 'next';

type JobMetadata = {
  title?: string;
  company?: string;
  location?: string;
  type?: string;
  companyId?: {
    companyName?: string;
  };
};

async function getJob(id: string): Promise<JobMetadata | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  try {
    const response = await fetch(`${apiUrl}/jobs/${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return {
      title: 'Job Not Found',
      description: 'This job could not be found on HIRE/.',
      robots: { index: false, follow: false },
    };
  }

  const companyName = job.companyId?.companyName || job.company || 'Hiring company';
  const title = `${job.title} at ${companyName}`;
  const description = `${companyName} is hiring ${job.title}${job.location ? ` in ${job.location}` : ''}${job.type ? ` (${job.type})` : ''}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default function JobDetailsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
