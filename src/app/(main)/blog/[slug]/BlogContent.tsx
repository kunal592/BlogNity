'use client';

import { CardContent } from "@/components/ui/card";
import { Post } from "@/lib/types";
import ReactMarkdown from "react-markdown";

interface BlogContentProps {
    post: Post;
}

export default function BlogContent({ post }: BlogContentProps) {
    return (
        <CardContent className="prose prose-lg max-w-none">
            <img src={post.thumbnailUrl} alt={post.title} className="w-full h-auto rounded-lg" />
            <ReactMarkdown>{post.content}</ReactMarkdown>
        </CardContent>
    );
}