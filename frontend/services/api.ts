import axios from 'axios';
import { User, Message } from '../types';

const API_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is crucial for sending/receiving cookies for auth
});

export const api = {
  register: async (name: string, email: string, password: string): Promise<User> => {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<User> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getLoggedInUser: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.log('No logged in user found');
      return null;
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users/all');
    return response.data;
  },

  getFriends: async (): Promise<User[]> => {
    const response = await apiClient.get('/users/friends');
    return response.data;
  },

  addFriend: async (friendId: string): Promise<User> => {
    const response = await apiClient.post('/users/add', { friendId });
    return response.data;
  },

  getMessages: async (otherUserId: string): Promise<Message[]> => {
    const response = await apiClient.get(`/messages/${otherUserId}`);
    return response.data;
  },

  sendMessage: async (text: string, receiverId: string): Promise<Message> => {
    const response = await apiClient.post('/messages/send', { text, receiverId });
    return response.data;
  },
};
