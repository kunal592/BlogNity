'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function NewCommentForm() {
    const { toast } = useToast();
    const [comment, setComment] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would submit the comment to the server.
        toast({
            title: "Comment submitted!",
            description: "Your comment has been submitted for review.",
        });
        setComment("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                rows={4}
            />
            <Button type="submit" className="self-end">Submit</Button>
        </form>
    );
}