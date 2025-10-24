import { Post, User } from './types';

const API_URL = 'http://localhost:3000';

// --- USER API ---
export const getUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
}

// --- POST API ---
export const getPosts = async (): Promise<Post[]> => {
  const res = await fetch(`${API_URL}/post`);
  return res.json();
};
