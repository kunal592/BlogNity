'use client';

import useSWR, { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';
import type { User, Post, Notification, ContactMessage } from './types';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// --- GENERIC FETCHER & REQUEST FUNCTIONS ---

async function fetcher(url: string, token?: string | null) {
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const error: any = new Error('An error occurred while fetching the data.');
    try {
      error.info = await res.json();
    } catch {
      error.info = { message: res.statusText };
    }
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export const postRequest = async (url: string, data: any) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error: any = new Error('An error occurred while making the request.');
    try {
      error.info = await res.json();
    } catch {
      error.info = { message: res.statusText };
    }
    error.status = res.status;
    throw error;
  }
  return res.json();
};

async function authenticatedRequest(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE',
  token: string,
  data?: any
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) {
    const error: any = new Error(`An error occurred during the ${method} request.`);
    try {
      error.info = await res.json();
    } catch {
      error.info = { message: res.statusText };
    }
    error.status = res.status;
    throw error;
  }
  return res.json();
}

// --- SWR HOOKS FOR CLIENT-SIDE DATA FETCHING ---

function useAuthenticatedSWR<T>(key: string | null, options?: SWRConfiguration) {
  const { token } = useAuth();
  return useSWR<T>(key ? [key, token] : null, fetcher, options);
}

function useAuthenticatedSWRInfinite<PageType>(
  getKey: (pageIndex: number, previousPageData: PageType | null) => string | null
) {
  const { token } = useAuth();
  const { data, error, size, setSize, mutate, isLoading } =
    useSWRInfinite<PageType>(
      (pageIndex, previousPageData) => {
        const key = getKey(pageIndex, previousPageData);
        return key ? [key, token] : null;
      },
      fetcher
    );
  return { data, error, size, setSize, mutate, isLoading };
}

// --- SPECIFIC DATA HOOKS ---

export const useUsers = (options?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useAuthenticatedSWR<User[]>(
    `${API_URL}/users`,
    options
  );
  return { data, error, isLoading, mutate };
};

export const useUser = (id?: string, options?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useAuthenticatedSWR<User>(
    id ? `${API_URL}/users/${id}` : null,
    options
  );
  return { data, error, isLoading, mutate };
};

// ✅ FIXED usePostsInfinite (safe null guards)
export const usePostsInfinite = (limit = 5) => {
  const { data, error, size, setSize, mutate, isLoading } =
    useAuthenticatedSWRInfinite<{ posts?: Post[]; total?: number }>(
      (pageIndex, previousPageData) => {
        if (pageIndex === 0 || !previousPageData) {
          return `${API_URL}/post?page=1&limit=${limit}`;
        }

        const posts = previousPageData.posts ?? [];
        const total = previousPageData.total ?? 0;

        if (posts.length === 0 || (pageIndex + 1) * limit >= total) {
          return null;
        }

        return `${API_URL}/post?page=${pageIndex + 1}&limit=${limit}`;
      }
    );

  const posts: Post[] = data ? data.flatMap((page) => page.posts ?? []) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isReachingEnd =
    data && data.length > 0
      ? (data[data.length - 1]?.posts?.length ?? 0) < limit
      : false;

  return { posts, error, isLoading, isLoadingMore, isReachingEnd, size, setSize, mutate };
};

export const usePostsByAuthor = (authorId?: string, options?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useAuthenticatedSWR<Post[]>(
    authorId ? `${API_URL}/post/author/${authorId}` : null,
    options
  );
  return { data, error, isLoading, mutate };
};

export const useSearchPosts = (query?: string, options?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useAuthenticatedSWR<Post[]>(
    query ? `${API_URL}/post/search?q=${encodeURIComponent(query)}` : null,
    options
  );
  return { data, error, isLoading, mutate };
};

export const useBookmarkedPosts = (userId?: string, options?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useAuthenticatedSWR<Post[]>(
    userId ? `${API_URL}/users/${userId}/bookmarks` : null,
    options
  );
  return { data, error, isLoading, mutate };
};

// ✅ FIXED: pluralized endpoint for notifications
export const useNotifications = (userId?: string, options?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useAuthenticatedSWR<Notification[]>(
    userId ? `${API_URL}/notifications` : null,
    options
  );
  return { data, error, isLoading, mutate };
};

export const useContactMessages = (options?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useAuthenticatedSWR<ContactMessage[]>(
    `${API_URL}/contact`,
    options
  );
  return { data, error, isLoading, mutate };
};

// --- MUTATION HOOKS (CREATE, UPDATE, DELETE) ---

export function useCreatePost() {
  const { token } = useAuth();
  const trigger = async (
    postData: Partial<Post> & { authorId: string; title: string; content: string },
    id?: string
  ): Promise<Post> => {
    if (!token) throw new Error('User is not authenticated.');
    const url = id ? `${API_URL}/post/${id}` : `${API_URL}/post`;
    const method = id ? 'PUT' : 'POST';
    return authenticatedRequest(url, method, token, postData);
  };
  return { trigger };
}

export function useUpdatePost() {
  const { token } = useAuth();
  const trigger = async (id: string, updateData: Partial<Post>): Promise<Post> => {
    if (!token) throw new Error('User is not authenticated.');
    return authenticatedRequest(`${API_URL}/post/${id}`, 'PUT', token, updateData);
  };
  return { trigger };
}

export function useDeletePost() {
  const { token } = useAuth();
  const trigger = async (id: string): Promise<{ success: boolean }> => {
    if (!token) throw new Error('User is not authenticated.');
    return authenticatedRequest(`${API_URL}/post/${id}`, 'DELETE', token);
  };
  return { trigger };
}

export function useUpdateContactMessage() {
  const { token } = useAuth();
  const trigger = async (
    id: string,
    updateData: Partial<ContactMessage>
  ): Promise<ContactMessage> => {
    if (!token) throw new Error('User is not authenticated.');
    return authenticatedRequest(`${API_URL}/contact/${id}`, 'PUT', token, updateData);
  };
  return { trigger };
}

// ✅ FIXED: pluralized endpoint for updating notifications
export function useUpdateNotification() {
  const { token } = useAuth();
  const trigger = async (data: { id: string; isRead: boolean }): Promise<Notification> => {
    if (!token) throw new Error('User is not authenticated.');
    return authenticatedRequest(`${API_URL}/notifications/${data.id}`, 'PUT', token, {
      isRead: data.isRead,
    });
  };
  return { trigger };
}

export const sendContactMessage = async (formData: {
  name: string;
  email: string;
  message: string;
}): Promise<{ success: boolean }> => {
  return fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  }).then((res) => {
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  });
};

export const getPostSummary = async (postId: string): Promise<{ summary: string }> => {
  const { token } = useAuth();
  if (!token) throw new Error('User is not authenticated.');
  return authenticatedRequest(`${API_URL}/post/${postId}/summarize`, 'POST', token);
};

export function useToggleLike() {
  const { token } = useAuth();
  const trigger = async (postId: string, userId: string): Promise<Post> => {
    if (!token) throw new Error('User is not authenticated.');
    return authenticatedRequest(`${API_URL}/likes`, 'POST', token, { postId, userId });
  };
  return { trigger };
}

export function useToggleBookmark() {
  const { token } = useAuth();
  const trigger = async (postId: string, userId: string): Promise<User> => {
    if (!token) throw new Error('User is not authenticated.');
    return authenticatedRequest(`${API_URL}/bookmarks`, 'POST', token, { postId, userId });
  };
  return { trigger };
}

export function useFollowUser() {
  const { token } = useAuth();
  const trigger = async (followerId: string, followingId: string): Promise<User> => {
    if (!token) throw new Error('User is not authenticated.');
    return authenticatedRequest(`${API_URL}/interaction/follow`, 'POST', token, {
      followerId,
      followingId,
    });
  };
  return { trigger };
}

export function useUnfollowUser() {
  const { token } = useAuth();
  const trigger = async (followerId: string, followingId: string): Promise<User> => {
    if (!token) throw new Error('User is not authenticated.');
    return authenticatedRequest(`${API_URL}/interaction/unfollow`, 'POST', token, {
      followerId,
      followingId,
    });
  };
  return { trigger };
}
