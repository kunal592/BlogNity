import { getPosts, getUsers } from '@/lib/api';
import BlogCard from '../home/BlogCard';
import { Card, CardContent } from '@/components/ui/card';
import { Rss } from 'lucide-react';

export default async function FeedPage() {
  const allPosts = await getPosts();
  const users = await getUsers();
  
  // Mocking a logged-in user and their followed authors
  const currentUser = users.find(u => u.id === '1');
  const followedUserIds = currentUser?.followingUsers || [];

  const feedPosts = allPosts.filter(post => followedUserIds.includes(post.authorId));

  const postsWithAuthors = feedPosts.map(post => {
    const author = users.find(user => user.id === post.authorId);
    return { ...post, author };
  });

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Feed</h1>
      {postsWithAuthors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {postsWithAuthors.map(post => (
            <BlogCard key={post.id} post={post} author={post.author} />
          ))}
        </div>
      ) : (
        <Card className="mt-8">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <Rss className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your Feed is Empty</h2>
            <p className="text-muted-foreground">
              Follow authors to see personalized content here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
