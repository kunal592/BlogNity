import { getPosts, getUsers } from '@/lib/api';
import BlogCard from './BlogCard';
import ViewToggle from './ViewToggle';

export default async function HomePage() {
  const posts = await getPosts();
  const users = await getUsers();

  const postsWithAuthors = posts.map(post => {
    const author = users.find(user => user.id === post.authorId);
    return { ...post, author };
  });

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Public Feed</h1>
        <ViewToggle />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {postsWithAuthors.map(post => (
          <BlogCard key={post.id} post={post} author={post.author} />
        ))}
      </div>
    </div>
  );
}
