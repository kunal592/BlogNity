import { getPosts, getUsers } from '@/lib/data';
import ExclusivePageClient from './ExclusivePageClient';
import { Post, User } from '@/lib/types';

// Optional: revalidate every hour for ISR
export const revalidate = 3600;

export default async function ExclusivePage() {
  try {
    // ✅ Safely fetch posts and users
    const { posts: allPosts = [] } = await getPosts(1, 1000).catch(() => ({ posts: [] }));
    const allUsers = await getUsers().catch(() => []);

    // ✅ Prevent .filter on undefined
    const exclusivePosts = (allPosts ?? []).filter(post => post.isExclusive);

    // ✅ Attach author objects safely
    const exclusivePostsWithAuthors: (Post & { author?: User })[] = exclusivePosts.map(post => {
      const author = allUsers.find(u => u.id === post.authorId);
      return { ...post, author };
    });

    return (
      <ExclusivePageClient initialPosts={exclusivePostsWithAuthors} />
    );
  } catch (error) {
    console.error('Failed to load exclusive posts:', error);

    return (
      <div className="container mx-auto py-10 text-center text-muted-foreground">
        <h1 className="text-2xl font-bold mb-4">Failed to Load Exclusive Content</h1>
        <p>Please try again later.</p>
      </div>
    );
  }
}
