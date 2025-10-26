'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MDEditor from '@uiw/react-md-editor';
import { format } from 'date-fns';
import CommentSection from './CommentSection';
import { Post, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useToggleBookmark, useToggleLike, useFollowUser, useUnfollowUser, getPostSummary } from '@/lib/api';

interface BlogPostPageClientProps {
    post: Post & { author: User };
}

export default function BlogPostPageClient({ post }: BlogPostPageClientProps) {
    const { user, refetchUser, token } = useAuth();
    const { toast } = useToast();
    const [isLiked, setIsLiked] = useState(user ? post.likedBy.includes(user.id) : false);
    const [likes, setLikes] = useState(post.likes);
    const [isBookmarked, setIsBookmarked] = useState(user ? user.bookmarkedPosts.includes(post.id) : false);
    const [isFollowing, setIsFollowing] = useState(user ? user.following.includes(post.author.id) : false);

    const { trigger: toggleLike } = useToggleLike();
    const { trigger: toggleBookmark } = useToggleBookmark();
    const { trigger: followUser } = useFollowUser();
    const { trigger: unfollowUser } = useUnfollowUser();

    const handleLike = async () => {
        if (!user) return toast({ title: 'Please log in to like posts.', variant: 'destructive' });
        
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
        
        await toggleLike({ postId: post.id, userId: user.id });
        toast({ title: isLiked ? 'Post unliked' : 'Post liked!' });
    };

    const handleBookmark = async () => {
        if (!user) return toast({ title: 'Please log in to bookmark posts.', variant: 'destructive' });

        setIsBookmarked(!isBookmarked);
        await toggleBookmark({ postId: post.id, userId: user.id });
        refetchUser(); // update user context
        toast({ title: isBookmarked ? 'Bookmark removed' : 'Post bookmarked!' });
    };

    const handleFollow = async () => {
        if (!user) return toast({ title: 'Please log in to follow users.', variant: 'destructive' });

        setIsFollowing(!isFollowing);
        if (isFollowing) {
            await unfollowUser({ followerId: user.id, followingId: post.author.id });
            toast({ title: `Unfollowed ${post.author.name}` });
        } else {
            await followUser({ followerId: user.id, followingId: post.author.id });
            toast({ title: `Followed ${post.author.name}` });
        }
        refetchUser();
    };

    const handleSummarize = async () => {
        if (!token) return toast({ title: 'Please log in to summarize posts.', variant: 'destructive' });

        try {
            const { summary } = await getPostSummary(post.id, token);
            toast({
                title: 'AI Summary',
                description: summary,
            });
        } catch (error) {
            console.error('Error summarizing post', error);
            toast({
                title: 'Error',
                description: 'Could not summarize the post at this time.',
                variant: 'destructive',
            });
        }
    };

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
                    <Button size="sm" variant="outline" onClick={handleFollow}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                </div>
                
                <div data-color-mode="light">
                    <MDEditor.Markdown 
                        source={post.content} 
                        className="prose prose-lg max-w-none" 
                    />
                </div>

                <div className="flex items-center justify-between w-full text-muted-foreground mt-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLike}>
                        <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span className="ml-1 text-xs">{likes}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageCircle className="h-4 w-4" />
                        <span className="ml-1 text-xs">{post.comments.length}</span>
                        </Button>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSummarize}>
                        <BookOpen className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBookmark}>
                        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                        </Button>
                    </div>
                </div>

                <hr className="my-12" />

                <CommentSection postId={post.id} />

            </article>
        </div>
    );
}
