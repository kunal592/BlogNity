'use client';

import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Flag } from "lucide-react";

interface CommentActionsProps {
    commentId: string;
}

export default function CommentActions({ commentId }: CommentActionsProps) {
    const handleLike = async () => {
        await fetch(`/api/comments/${commentId}/like`, { method: 'POST' });
    };

    const handleReply = () => {
        // Reply functionality to be implemented
    };

    const handleReport = async () => {
        await fetch(`/api/comments/${commentId}/report`, { method: 'POST' });
    };

    return (
        <div className="flex items-center space-x-4 mt-2">
            <Button variant="ghost" size="sm" onClick={handleLike}><ThumbsUp className="w-4 h-4 mr-1" />Like</Button>
            <Button variant="ghost" size="sm" onClick={handleReply}><MessageSquare className="w-4 h-4 mr-1" />Reply</Button>
            <Button variant="ghost" size="sm" onClick={handleReport}><Flag className="w-4 h-4 mr-1" />Report</Button>
        </div>
    );
}