
import { mockPosts, mockUsers } from '@/lib/mockData';
import BlogPageClient from './BlogPageClient';

export default function BlogPage({ params }: { params: { slug: string } }) {
  const post = mockPosts.find(p => p.slug === params.slug);

  if (!post) {
    return <div>Blog post not found</div>;
  }

  const author = mockUsers.find(u => u.id === post.authorId);

  const commentsWithAuthors = post.comments.map(comment => {
    const author = mockUsers.find(u => u.id === comment.authorId);
    return { ...comment, author };
  });

  return <BlogPageClient post={{...post, author, comments: commentsWithAuthors}} />;
}
