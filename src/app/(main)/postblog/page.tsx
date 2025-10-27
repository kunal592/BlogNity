import { Suspense } from 'react';
import Editor from './Editor';
import { getPost } from '@/lib/data';
import { Loader2 } from 'lucide-react';

async function PostEditor({ postId }: { postId: string | null }) {
  let post = null;
  if (postId) {
    post = await getPost(postId);
  }

  return <Editor post={post} />;
}

export default async function PostBlogPage({ searchParams }: { searchParams: { id?: string } }) {
  const postId = searchParams.id || null;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {postId ? 'Edit Post' : 'Create New Post'}
      </h1>
      <Suspense fallback={<Loader2 className="mx-auto my-12 h-8 w-8 animate-spin" />}>
        <PostEditor postId={postId} />
      </Suspense>
    </div>
  );
}
