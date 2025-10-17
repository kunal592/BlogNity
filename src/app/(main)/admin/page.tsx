import { AdminGuard } from './AdminGuard';
import { mockUsers, mockPosts } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, BarChart2 } from 'lucide-react';
import AdminUserTable from './AdminUserTable';
import AdminPostTable from './AdminPostTable';

export default function AdminPage() {
  const totalUsers = mockUsers.length;
  const totalPosts = mockPosts.length;
  const totalReports = 12; // Mock data

  return (
    <AdminGuard>
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPosts}</div>
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
                <AdminUserTable users={mockUsers} />
            </div>
             <div>
                <h2 className="text-2xl font-semibold mb-4">Manage Posts</h2>
                <AdminPostTable posts={mockPosts} />
            </div>
        </div>

      </div>
    </AdminGuard>
  );
}
