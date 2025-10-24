import useSWR, { SWRConfiguration } from 'swr';
import type { User, Post, Notification, ContactMessage } from './types';

const API_URL = 'http://localhost:3001'; // Assuming the backend is running on port 3001

// --- UTILITY FUNCTIONS ---

const fetcher = async (url: string, token?: string) => {
    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, { headers });
    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }
    return res.json();
};

export const postRequest = async (url: string, data: any, token?: string) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = new Error('An error occurred while sending the data.');
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }
    return res.json();
};

const putRequest = async (url: string, data: any, token?: string) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = new Error('An error occurred while updating the data.');
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }
    return res.json();
};

const deleteRequest = async (url: string, token?: string) => {
    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, {
        method: 'DELETE',
        headers,
    });
    if (!res.ok) {
        const error = new Error('An error occurred while deleting the data.');
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }
    return res.json();
};

// --- USER API ---

export const useUser = (userId: string, token: string, options?: SWRConfiguration) => {
    const { data, error, isLoading } = useSWR<User>([`${API_URL}/users/${userId}`, token], ([url, token]) => fetcher(url, token), options);
    return { user: data, error, isLoading };
};

export const useUsers = (token: string, options?: SWRConfiguration) => {
    const { data, error, isLoading } = useSWR<User[]>([`${API_URL}/users`, token], ([url, token]) => fetcher(url, token), options);
    return { users: data, error, isLoading };
}

// --- POST API ---

export const usePosts = (token: string, options?: SWRConfiguration) => {
    const { data, error, isLoading } = useSWR<Post[]>([`${API_URL}/post`, token], ([url, token]) => fetcher(url, token), options);
    return { posts: data, error, isLoading };
};

export const usePost = (postId: string, token: string, options?: SWRConfiguration) => {
    const { data, error, isLoading } = useSWR<Post>([`${API_URL}/post/${postId}`, token], ([url, token]) => fetcher(url, token), options);
    return { post: data, error, isLoading };
};

export const usePostsByAuthor = (authorId: string, token: string, options?: SWRConfiguration) => {
    const { data, error, isLoading } = useSWR<Post[]>([`${API_URL}/post/author/${authorId}`, token], ([url, token]) => fetcher(url, token), options);
    return { posts: data, error, isLoading };
};

export const createPost = async (postData: Omit<Post, 'id' | 'likes' | 'likedBy' | 'comments' | 'publishedAt' | 'views' | 'isExclusive'>, token: string): Promise<Post> => {
    return await postRequest(`${API_URL}/post`, postData, token);
}

export const updatePost = async (postId: string, updateData: Partial<Post>, token: string): Promise<Post> => {
    return await putRequest(`${API_URL}/post/${postId}`, updateData, token);
};

export const deletePost = async (postId: string, token: string): Promise<{ success: boolean }> => {
    return await deleteRequest(`${API_URL}/post/${postId}`, token);
};

export const getPostSummary = async (postId: string, token: string): Promise<{ summary: string }> => {
  return await postRequest(`${API_URL}/post/${postId}/summarize`, {}, token);
};


// --- NOTIFICATION API ---

export const useNotifications = (userId: string, token: string, options?: SWRConfiguration) => {
    const { data, error, isLoading } = useSWR<Notification[]>([`${API_URL}/notification`, token], ([url, token]) => fetcher(url, token), options);
    return { notifications: data, error, isLoading };
};

// --- CONTACT API ---

export const sendContactMessage = async (formData: { name: string; email: string; message: string }): Promise<{ success: boolean }> => {
  return await postRequest(`${API_URL}/contact`, formData);
};

export const useContactMessages = (token: string, options?: SWRConfiguration) => {
    const { data, error, isLoading } = useSWR<ContactMessage[]>([`${API_URL}/contact`, token], ([url, token]) => fetcher(url, token), options);
    return { messages: data, error, isLoading };
}

export const resolveContactMessage = async (id: string, token: string): Promise<{ success: boolean }> => {
    return await putRequest(`${API_URL}/contact/${id}/resolve`, {}, token);
}

// --- INTERACTIONS ---

export const toggleLike = async (postId: string, userId: string, token: string): Promise<Post> => {
    return await postRequest(`${API_URL}/post/${postId}/like`, { userId }, token);
};

export const toggleBookmark = async (postId: string, userId: string, token: string): Promise<User> => {
    return await postRequest(`${API_URL}/users/${userId}/bookmark`, { postId }, token);
};

export const togglePostExclusivity = async (postId: string, token: string): Promise<{ success: boolean }> => {
    return await postRequest(`${API_URL}/post/${postId}/exclusive`, {}, token);
}