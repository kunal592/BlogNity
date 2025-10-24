'use client';

import { useState } from 'react';
import { useSearchPosts } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import BlogCardList from '../home/BlogCardList';
import useDebounce from '@/hooks/use-debounce';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data: posts, error, isLoading } = useSearchPosts(debouncedQuery);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search Posts</h1>
        <div className="relative">
          <Input 
            type="text"
            placeholder="Search by title, content, or tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-lg p-4"
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="mt-8">
          {error && <p className="text-destructive text-center">Error loading results.</p>}
          
          {debouncedQuery && !isLoading && !posts?.length && (
            <p className="text-muted-foreground text-center">No results found for "{debouncedQuery}"</p>
          )}

          {posts && posts.length > 0 && (
            <div className="flex flex-col gap-4">
              {posts.map(post => (
                <BlogCardList key={post.id} post={post} author={post.author} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
