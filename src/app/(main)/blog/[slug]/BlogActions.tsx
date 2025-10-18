'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/lib/types";
import { Heart, Bookmark, Share2, Bot } from "lucide-react";

interface BlogActionsProps {
    post: Post;
}

export default function BlogActions({ post }: BlogActionsProps) {
    const { toast } = useToast();

    const handleLike = () => {
        // In a real app, this would trigger the like post flow.
        toast({
            title: 'Post liked!',
            description: `You liked "${post.title}".`,
        });
    };

    const handleBookmark = () => {
        // In a real app, this would trigger the bookmark post flow.
        toast({
            title: 'Post bookmarked!',
            description: `You bookmarked "${post.title}".`,
        });
    };

    const handleShare = () => {
        // In a real app, this would trigger the share post flow.
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: 'Link copied!',
            description: 'The link to the post has been copied to your clipboard.',
        });
    };

    const handleAiSummarize = () => {
        // In a real app, this would trigger the AI summarizer flow.
        toast({
            title: 'AI Summarizer',
            description: 'This feature is not yet implemented.',
        });
    }

    return (
        <div className="flex items-center justify-between p-4 border-t border-b">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={handleLike}>
                    <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleBookmark}>
                    <Bookmark className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleAiSummarize}>
                    <Bot className="h-5 w-5" />
                </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
            </Button>
        </div>
    );
}