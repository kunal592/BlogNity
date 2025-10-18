'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Comment, User } from "@/lib/types";
import { Heart, MessageSquare, Flag } from "lucide-react";
import NewCommentForm from "./NewCommentForm";

interface BlogCommentsProps {
    comments: (Comment & { author?: User })[];
}

export default function BlogComments({ comments }: BlogCommentsProps) {
    const { toast } = useToast();

    const handleLike = (commentId: string) => {
        // In a real app, this would trigger the like comment flow.
        toast({
            title: 'Comment liked!',
        });
    };

    const handleReply = (commentId: string) => {
        // In a real app, this would trigger the reply to comment flow.
        toast({
            title: 'Reply to comment',
            description: 'This feature is not yet implemented.',
        });
    };

    const handleReport = (commentId: string) => {
        // In a real app, this would trigger the report comment flow.
        toast({
            title: 'Comment reported!',
            description: 'This comment has been reported for review.',
        });
    };

    return (
        <CardFooter>
            <div className='flex flex-col gap-4 w-full'>
                <h3 className='text-lg font-semibold'>Comments</h3>
                <Separator />
                <NewCommentForm />
                <Separator />
                {comments.length > 0 ? (
                    <div className='space-y-4'>
                        {comments.map(comment => (
                            <div key={comment.id} className='flex items-start space-x-4'>
                                <Avatar>
                                    <AvatarImage src={comment.author?.avatarUrl} alt={comment.author?.name} />
                                    <AvatarFallback>{comment.author?.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="w-full">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="font-semibold">{comment.author?.name}</p>
                                            <p className="text-sm text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleLike(comment.id)}>
                                                <Heart className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleReply(comment.id)}>
                                                <MessageSquare className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleReport(comment.id)}>
                                                <Flag className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-muted-foreground'>No comments yet.</p>
                )}
            </div>
        </CardFooter>
    );
}