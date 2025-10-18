'use client';

import type { Post, User, Comment } from '@/lib/types';
import { Card } from '@/components/ui/card';
import BlogHeader from './BlogHeader';
import BlogContent from './BlogContent';
import BlogComments from './BlogComments';
import BlogActions from './BlogActions';

interface BlogPageClientProps {
    post: Post & { author?: User; comments: (Comment & { author?: User })[] };
}

export default function BlogPageClient({ post }: BlogPageClientProps) {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <BlogHeader post={post} />
        <BlogContent post={post} />
        <BlogActions post={post} />
        <BlogComments comments={post.comments} />
      </Card>
    </div>
  );
}
