'use client';

import { useState, useEffect, useRef } from 'react';
import { usePostsInfinite } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Loader2 } from 'lucide-react';
import BlogCard from './BlogCard';
import BlogCardList from './BlogCardList';
import type { Post } from '@/lib/types';

interface BlogListProps {
  initialData?: { posts: Post[]; total: number };
  listTitle?: string;
}

export default function BlogList({ initialData, listTitle = 'Public Feed' }: BlogListProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // ✅ Make sure usePostsInfinite returns proper fields
  const { posts = [], error, isLoadingMore, isReachingEnd, size, setSize } = usePostsInfinite(10);

  // ✅ Fallback to initialData if posts array is empty
  const initialPosts = initialData?.posts ?? [];
  const allPosts = posts.length > 0 ? posts : initialPosts;

  // ✅ Infinite scroll effect (prevent memory leaks + stale closure)
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting && !isLoadingMore && !isReachingEnd) {
          setSize(prev => prev + 1); // ✅ Use functional update to avoid stale size
        }
      },
      { threshold: 1.0 }
    );

    const loader = loaderRef.current;
    observer.observe(loader);

    return () => {
      observer.unobserve(loader);
    };
  }, [isLoadingMore, isReachingEnd, setSize]);

  // ✅ Handle no posts gracefully
  if (!allPosts.length && !isLoadingMore) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <h1 className="text-2xl font-bold mb-4">No Posts Found</h1>
        <p>It seems there are no posts to display at the moment.</p>
        <p className="mt-2 text-sm">This might be because the backend server is not running.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{listTitle}</h1>
        <div className="flex gap-1">
          <Button
            variant={view === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setView('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button
            variant={view === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setView('list')}
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map(post => (
            <BlogCard key={post.id || post._id} post={post} author={post.author} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {allPosts.map(post => (
            <BlogCardList key={post.id || post._id} post={post} author={post.author} />
          ))}
        </div>
      )}

      <div ref={loaderRef} className="flex justify-center items-center py-8">
        {isLoadingMore && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        {isReachingEnd && allPosts.length > 0 && (
          <p className="text-muted-foreground">No more posts to load.</p>
        )}
      </div>

      {error && <p className="text-destructive text-center mt-4">Failed to load more posts.</p>}
    </>
  );
}
