import { getPosts, getUsers } from '@/lib/api';
import FeedPageClient from './FeedPageClient';
import { Post, User } from '@/lib/types';

export default async function FeedPage() {
  const allPosts = await getPosts();
  const allUsers = await getUsers();

  // For this demo, we'll manually find the "logged in" user to determine their feed.
  // In a real app, this would come from a server-side session.
  const currentUser = allUsers.find(u => u.id === '1');

  let feedPostsWithAuthors: (Post & { author?: User })[] = [];

  if (currentUser) {
    const followedUserIds = currentUser?.followingUsers || [];
    const feedPosts = allPosts.filter(post => followedUserIds.includes(post.authorId));

    feedPostsWithAuthors = feedPosts.map(post => {
      const author = allUsers.find(u => u.id === post.authorId);
      return { ...post, author };
    });
  }

  return (
    <FeedPageClient initialPosts={feedPostsWithAuthors} />
  );
}
