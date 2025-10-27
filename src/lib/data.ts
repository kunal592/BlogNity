import type { Post, User } from './types';

const API_URL = 'http://localhost:3000';

// This fetcher is for server-side use
async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const error: any = new Error('An error occurred while fetching the data.');
    try {
        error.info = await res.json();
    } catch (e) {
        error.info = { message: res.statusText };
    }
    error.status = res.status;
    throw error;
  }
  return res.json();
}

// --- SERVER-SIDE DATA FETCHING ---

export const getPosts = async (page = 1, limit = 10): Promise<{ posts: Post[], total: number }> => {
  return fetcher(`${API_URL}/post?page=${page}&limit=${limit}`);
};

export const getPost = async (slugOrId: string): Promise<Post | null> => {
  try {
    return await fetcher(`${API_URL}/post/${slugOrId}`);
  } catch (error: any) {
    if (error.status === 404) return null;
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  return fetcher(`${API_URL}/users`);
};

export const getFeed = async (userId: string): Promise<Post[]> => {
  return fetcher(`${API_URL}/post/feed?userId=${userId}`);
};
