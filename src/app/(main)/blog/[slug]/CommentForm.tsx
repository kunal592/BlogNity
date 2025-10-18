'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface CommentFormProps {
    postId: string;
    onCommentAdded: (comment: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
    const [content, setContent] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(`/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });
        if (response.ok) {
            const newComment = await response.json();
            onCommentAdded(newComment);
            setContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a comment..."
            />
            <Button type="submit">Post Comment</Button>
        </form>
    );
}