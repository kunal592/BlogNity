'use client';

import { useEffect, useState } from 'react';
import { getPosts, getUsers } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, BarChart2 } from 'lucide-react';
import AdminUserTable from './AdminUserTable';
import AdminPostTable from './AdminPostTable';
import type { User, Post } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const totalReports = 12; // Mock data

  const fetchData = async () => {
    const [userResponse, postResponse] = await Promise.all([getUsers(), getPosts()]);
    setUsers(userResponse);
    setPosts(postResponse);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
            <Skeleton className="h-64" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Manage Posts</h2>
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
          <div>
              <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
              <AdminUserTable users={users} />
          </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Manage Posts</h2>
              <AdminPostTable posts={posts} onUpdate={fetchData} />
          </div>
      </div>

    </div>
  );
}
