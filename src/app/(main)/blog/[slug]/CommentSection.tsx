'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePost, useCreatePost } from '@/lib/api'; // We will add comment hooks later
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  // In a real implementation, we'd have a useComments hook
  // const { data: comments, mutate } = useComments(postId);
  const { data: post, mutate: mutatePost } = usePost(postId);

  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async () => {
    if (!user) {
        toast({ title: "Please log in to comment.", variant: "destructive" });
        return;
    }
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
        // This is a placeholder. We'd have a proper createComment API call
        // await createComment({ postId, content: commentText, authorId: user.id });
        console.log("Submitting comment:", { postId, content: commentText, authorId: user.id });
        
        // Simulate API call and optimistic update
        await new Promise(res => setTimeout(res, 1000));
        mutatePost(); // Re-fetch post data to show new comment
        setCommentText('');
        toast({ title: "Comment posted!" });
    } catch (error) {
        toast({ title: "Failed to post comment.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Comments ({post?.comments?.length || 0})</h2>
      
      {user && (
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={user.profileImage || ''} alt={user.name || ''} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea 
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
            />
            <Button onClick={handleCommentSubmit} disabled={isSubmitting} className="mt-2">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Comment
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {post?.comments?.map(comment => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
                <AvatarImage src={comment.author.profileImage || ''} alt={comment.author.name || ''} />
                <AvatarFallback>{comment.author.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                  <p className="font-semibold">{comment.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
              </div>
              <p>{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
