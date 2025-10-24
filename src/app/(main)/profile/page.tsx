'use client';

import { useAuth } from '@/context/AuthContext';
import { useUser, usePostsByAuthor, useBookmarkedPosts } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Edit } from 'lucide-react';
import BlogCard from '../home/BlogCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user: currentUser } = useAuth();

  const { data: user, isLoading: userLoading } = useUser(currentUser?.id);
  const { data: userPosts, isLoading: postsLoading } = usePostsByAuthor(currentUser?.id);
  const { data: bookmarkedPosts, isLoading: bookmarksLoading } = useBookmarkedPosts(currentUser?.id);

  if (!currentUser) {
      return <div className="container mx-auto text-center py-12">Please log in to view your profile.</div>;
  }
  
  const isLoading = userLoading || postsLoading || bookmarksLoading;

  if (isLoading || !user) {
    return (
        <div className="container mx-auto">
            <Card className="mb-8">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
                        <div className="flex-1 space-y-4">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-16 w-full" />
                            <div className="flex gap-6 mt-4 text-sm">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-20" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full mt-6" />
        </div>
    );
  }

  const followingUsers = user.following;

  return (
    <div className="container mx-auto">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-md">
              <AvatarImage src={user.profileImage || ''} alt={user.name || ''} />
              <AvatarFallback className="text-4xl">{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
              </div>
              <p className="text-muted-foreground">@{user.username}</p>
              <p className="mt-4">{user.bio}</p>
              <div className="flex gap-6 mt-4 text-sm">
                <div><span className="font-semibold">{userPosts?.length || 0}</span> Posts</div>
                <div><span className="font-semibold">{user.followersCount}</span> Followers</div>
                <div><span className="font-semibold">{user.followingCount}</span> Following</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="blogs">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="blogs">My Blogs</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="blogs" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userPosts?.map(post => (
              <BlogCard key={post.id} post={post} author={user} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bookmarked" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarkedPosts?.map(bookmark => (
              <BlogCard key={bookmark.post.id} post={bookmark.post} author={bookmark.post.author} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="following" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {followingUsers?.map(followedUser => (
                    <Card key={followedUser.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={followedUser.profileImage || ''} alt={followedUser.name || ''} />
                                    <AvatarFallback>{followedUser.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{followedUser.name}</p>
                                    <p className="text-sm text-muted-foreground">@{followedUser.username}</p>
                                </div>
                            </div>
                            <Button variant="secondary" size="sm">Unfollow</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
