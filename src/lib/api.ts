// This file contains mock API functions to simulate backend interactions.
// In a real application, these would be replaced with actual API calls.

import { mockUsers, mockPosts, mockNotifications, deleteMockPost } from './mockData';
import { simulateLatency } from './backendSetup';
import type { User, Post, Notification } from './types';
import { v4 as uuidv4 } from 'uuid';

// --- USER API ---
export const getUser = async (userId: string): Promise<User | undefined> => {
  await simulateLatency();
  return mockUsers.find(u => u.id === userId);
};

export const getUsers = async (): Promise<User[]> => {
  await simulateLatency();
  return mockUsers;
}

// --- POST API ---
export const getPosts = async (): Promise<Post[]> => {
  await simulateLatency();
  return mockPosts.filter(p => p.status === 'published');
};

export const getPost = async (postId: string): Promise<Post | undefined> => {
  await simulateLatency();
  return mockPosts.find(p => p.id === postId);
};

export const getPostsByAuthor = async (authorId: string): Promise<Post[]> => {
  await simulateLatency();
  return mockPosts.filter(p => p.authorId === authorId);
};

export const createPost = async (postData: Omit<Post, 'id' | 'likes' | 'likedBy' | 'comments' | 'publishedAt' | 'views'>): Promise<Post> => {
  await simulateLatency();
  const newPost: Post = {
    ...postData,
    id: uuidv4(),
    likes: 0,
    likedBy: [],
    comments: [],
    publishedAt: postData.status === 'published' ? new Date().toISOString() : '',
    views: 0,
  };
  mockPosts.unshift(newPost);
  return newPost;
}

export const updatePost = async (postId: string, updateData: Partial<Post>): Promise<Post | undefined> => {
  await simulateLatency();
  const postIndex = mockPosts.findIndex(p => p.id === postId);
  if (postIndex === -1) return undefined;

  const originalPost = mockPosts[postIndex];
  const updatedPost = { ...originalPost, ...updateData };
  
  // If status changes from draft to published, set publish date
  if (originalPost.status === 'draft' && updatedPost.status === 'published') {
    updatedPost.publishedAt = new Date().toISOString();
  }

  mockPosts[postIndex] = updatedPost;
  return updatedPost;
};

export const deletePost = async (postId: string): Promise<{ success: boolean }> => {
  await simulateLatency();
  const initialLength = mockPosts.length;
  deleteMockPost(postId);
  return { success: mockPosts.length < initialLength };
};


// --- NOTIFICATION API ---
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  await simulateLatency();
  return mockNotifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// --- CONTACT API ---
export const sendContactMessage = async (formData: { name: string; email: string; message: string }): Promise<{ success: boolean }> => {
  await simulateLatency();
  console.log('Mock sending message:', formData);
  return { success: true };
};

// --- INTERACTIONS ---

export const toggleLike = async (postId: string, userId: string): Promise<Post | undefined> => {
  await simulateLatency(100);
  const post = mockPosts.find(p => p.id === postId);
  if (!post) return undefined;

  const userIndex = post.likedBy.indexOf(userId);
  if (userIndex > -1) {
    post.likedBy.splice(userIndex, 1);
    post.likes--;
  } else {
    post.likedBy.push(userId);
    post.likes++;
  }
  return post;
};

export const toggleBookmark = async (postId: string, userId: string): Promise<User | undefined> => {
  await simulateLatency(100);
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return undefined;

  const postIndex = user.bookmarkedPosts.indexOf(postId);
  if (postIndex > -1) {
    user.bookmarkedPosts.splice(postIndex, 1);
  } else {
    user.bookmarkedPosts.push(postId);
  }
  return user;
};
