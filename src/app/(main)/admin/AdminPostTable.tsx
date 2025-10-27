'use client';

import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/lib/types';
import { Archive, Star, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useUpdatePost } from '@/lib/api';
import { Switch } from '@/components/ui/switch';

export default function AdminPostTable({ posts, onUpdate }: { posts: Post[], onUpdate: () => void }) {
    const { toast } = useToast();
    const { trigger: updatePost } = useUpdatePost();

    const handleAction = (action: string, postTitle: string) => {
        toast({ title: `${action} post: ${postTitle}`, description: 'This is a mock action.' });
    };

    const handleToggleExclusive = async (post: Post) => {
        const newVisibility = post.visibility === 'premium' ? 'public' : 'premium';
        try {
            await updatePost(post.id, { visibility: newVisibility });
            toast({ title: `Post is now ${newVisibility}` });
            onUpdate();
        } catch (error) {
            toast({ title: 'Failed to update post.', variant: 'destructive' });
        }
    };

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Exclusive</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts.map(post => (
                        <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>
                                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>{post.status}</Badge>
                            </TableCell>
                             <TableCell>
                                <Switch
                                    checked={post.visibility === 'premium'}
                                    onCheckedChange={() => handleToggleExclusive(post)}
                                    aria-label="Toggle exclusive status"
                                />
                            </TableCell>
                            <TableCell>{post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : '-'}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleAction('Feature', post.title)}><Star className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleAction('Archive', post.title)}><Archive className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleAction('Remove', post.title)}><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
