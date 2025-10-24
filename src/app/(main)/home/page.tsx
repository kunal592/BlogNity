import { getPosts } from '@/lib/api';
import BlogList from './BlogList';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Revalidate the page every hour
export const revalidate = 3600;

function BlogListFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function HomePage() {
  // Fetch initial data on the server
  const initialPostsData = await getPosts(1, 10);

  return (
    <div className="container mx-auto">
       <Suspense fallback={<BlogListFallback />}>
        <BlogList initialData={initialPostsData} />
      </Suspense>
    </div>
  );
}
