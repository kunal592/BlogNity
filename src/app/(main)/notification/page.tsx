'use client';

import { useNotifications, useUsers, useUpdateNotification } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { Notification, User } from '@/lib/types';
import { useEffect } from 'react';

function NotificationIcon({ type }: { type: Notification['type'] }) {
  switch (type) {
    case 'NEW_FOLLOWER':
      return <UserPlus className="h-5 w-5 text-blue-500" />;
    case 'NEW_LIKE':
      return <Heart className="h-5 w-5 text-red-500" />;
    case 'NEW_COMMENT':
      return <MessageCircle className="h-5 w-5 text-green-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
}

function getNotificationText(notification: Notification, users: User[] | undefined) {
    const fromUser = users?.find(u => u.id === notification.actorId);
    if (!fromUser) return 'An action occurred.';
    switch (notification.type) {
      case 'NEW_FOLLOWER':
        return <><span className="font-semibold">{fromUser.name}</span> started following you.</>;
      case 'NEW_LIKE':
        return <><span className="font-semibold">{fromUser.name}</span> liked your post.</>;
      case 'NEW_COMMENT':
        return <><span className="font-semibold">{fromUser.name}</span> commented on your post.</>;
      case 'NEW_MENTION':
        return <><span className="font-semibold">{fromUser.name}</span> mentioned you in a post.</>;
      default:
        return 'New notification.';
    }
  };

export default function NotificationPage() {
  const { user } = useAuth();
  const { data: notifications, isLoading, mutate } = useNotifications(user?.id);
  const { data: users } = useUsers();
  const { trigger: updateNotification } = useUpdateNotification();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
        updateNotification({ id: notification.id, isRead: true });
        mutate(); // Re-fetch notifications to update the UI
    }
  }

  if (isLoading || !notifications) {
    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Notifications</h1>
             <Card>
                <CardContent className="p-0">
                    <ul className="divide-y">
                        {[...Array(5)].map((_, i) => (
                            <li key={i} className="flex items-start gap-4 p-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                                <Skeleton className="h-2.5 w-2.5 rounded-full" />
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
  }

  const getNotificationLink = (notification: Notification) => {
      if (notification.post?.slug) {
          return `/blog/${notification.post.slug}`;
      }
      if (notification.entityType === 'USER') {
          return `/profile/${notification.actorId}`;
      }
      return '#';
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <Card>
        <CardContent className="p-0">
          {notifications.length > 0 ? (
            <ul className="divide-y">
              {notifications.map(notification => {
                 const fromUser = users?.find(u => u.id === notification.actorId);
                 const notificationLink = getNotificationLink(notification);

                return (
                  <li key={notification.id} 
                      className={cn('hover:bg-muted/50 transition-colors', !notification.isRead && 'bg-primary/5')}
                      onClick={() => handleNotificationClick(notification)}>
                     <Link href={notificationLink} className="flex items-start gap-4 p-4">
                      <div className="relative">
                        {fromUser && (
                          <Avatar>
                            <AvatarImage src={fromUser.profileImage || ''} alt={fromUser.name || 'User'} />
                            <AvatarFallback>{fromUser.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-card p-0.5 rounded-full">
                           <NotificationIcon type={notification.type} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{getNotificationText(notification, users)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.isRead && <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1"></div>}
                     </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="mx-auto h-12 w-12 mb-4" />
              <p>No new notifications.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
