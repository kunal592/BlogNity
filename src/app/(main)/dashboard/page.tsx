'use client';

import { useAuth } from '@/context/AuthContext';
import { useDeletePost, usePostsByAuthor } from '@/lib/api';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const { data: posts, isLoading, mutate } = usePostsByAuthor(user?.id);
  const { trigger: deletePostTrigger } = useDeletePost();

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deletePostTrigger(postId);
      mutate(); // Re-fetch the posts list
      toast({ title: 'Post deleted successfully.' });
    } catch (error) {
      toast({ title: 'Failed to delete post.', variant: 'destructive' });
    }
  };

  if (isLoading || !posts) {
    return (
        <div className="container mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const publishedPosts = posts.filter(p => p.status === 'published');
  const draftPosts = posts.filter(p => p.status === 'draft');
  
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.comments.length, 0);

  return (
    <div className="container mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Your Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="published">
        <TabsList>
          <TabsTrigger value="published">Published ({publishedPosts.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftPosts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="published">
          <PostTable posts={publishedPosts} onDelete={handleDelete} router={router} />
        </TabsContent>
        <TabsContent value="drafts">
          <PostTable posts={draftPosts} onDelete={handleDelete} router={router} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PostTable({ posts, onDelete, router }: { posts: Post[], onDelete: (id: string) => void, router: any }) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map(post => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell><Badge variant={post.status === 'published' ? 'default' : 'secondary'}>{post.status}</Badge></TableCell>
              <TableCell>{post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : '-'}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => router.push(`/postblog?id=${post.id}`)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(post.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
