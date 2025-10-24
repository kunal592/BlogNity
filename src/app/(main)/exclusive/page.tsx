import { getPosts, getUsers } from '@/lib/api';
import ExclusivePageClient from './ExclusivePageClient';
import { Post, User } from '@/lib/types';

export default async function ExclusivePage() {
  const allPosts = await getPosts();
  const allUsers = await getUsers();

  const exclusivePosts = allPosts.filter(post => post.visibility === 'premium');

  const exclusivePostsWithAuthors: (Post & { author?: User })[] = exclusivePosts.map(post => {
    const author = allUsers.find(u => u.id === post.authorId);
    return { ...post, author };
  });

  return (
    <ExclusivePageClient initialPosts={exclusivePostsWithAuthors} />
  );
}
