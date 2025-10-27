import { getFeed } from '@/lib/data';
import FeedPageClient from './FeedPageClient';

export default async function FeedPage() {
  // In a real app, this would come from a server-side session.
  const userId = '1';
  const feedPosts = await getFeed(userId);

  return (
    <FeedPageClient initialPosts={feedPosts} />
  );
}
