import { getPost } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MDEditor from '@uiw/react-md-editor';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import CommentSection from './CommentSection';
import type { Metadata } from 'next';

// Revalidate the page every hour
export const revalidate = 3600;

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.thumbnailUrl],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 mb-8 text-muted-foreground">
          <Avatar>
            <AvatarImage src={post.author.profileImage || ''} alt={post.author.name || ''} />
            <AvatarFallback>{post.author.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <span>{post.author.name}</span>
            <span className="mx-2">·</span>
            <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        <div data-color-mode="light">
            <MDEditor.Markdown 
                source={post.content} 
                className="prose prose-lg max-w-none" 
            />
        </div>

        <hr className="my-12" />

        <CommentSection postId={post.id} />

      </article>
    </div>
  );
}
