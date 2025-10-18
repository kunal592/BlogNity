'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Post, User } from "@/lib/types";

interface BlogHeaderProps {
    post: Post & { author?: User };
}

export default function BlogHeader({ post }: BlogHeaderProps) {
    const { toast } = useToast();

    const handleFollow = () => {
        // In a real app, this would trigger the follow author flow.
        toast({
            title: 'Author followed!',
            description: `You are now following ${post.author?.name}.`,
        });
    };

    return (
        <CardHeader>
            <div className="flex items-center space-x-4">
                <Avatar>
                    <AvatarImage src={post.author?.avatarUrl} alt={post.author?.name} />
                    <AvatarFallback>{post.author?.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex justify-between w-full items-center">
                    <div>
                        <p className="font-semibold">{post.author?.name}</p>
                        <p className="text-sm text-muted-foreground">{new Date(post.publishedAt).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" onClick={handleFollow}>Follow</Button>
                </div>
            </div>
            <CardTitle className="mt-4 text-4xl font-bold">{post.title}</CardTitle>
            <div className="mt-2 flex space-x-2">
                {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
            </div>
        </CardHeader>
    );
}