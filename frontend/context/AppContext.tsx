
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { User, Message } from '../types';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = "http://localhost:8000/api";

interface AppContextType {
  currentUser: User | null;
  users: User[];
  friends: User[];
  messages: Message[];
  activeChatFriendId: string | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (username: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  addFriend: (userId: string) => Promise<void>;
  setActiveChatFriendId: (friendId: string | null) => void;
  sendMessage: (text: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchFriends: () => Promise<void>;
  fetchMessages: (friendId: string) => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatFriendId, setActiveChatFriendId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, pass: string) => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${API_URL}/auth/login`, { email, password: pass });
      const { token, username, userId } = res.data;
      localStorage.setItem("token", token);

      const user: User = {
        id: userId,
        username,
        email,
        avatar: `https://i.pravatar.cc/150?u=${username}`,
        isOnline: true,
      };

      setCurrentUser(user);
      setFriends([]);
      await fetchFriends();
      toast.success(`Welcome back, ${username}!`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, pass: string) => {
    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/auth/signup`, { username, email, password: pass });
      toast.success("Signup successful!");
      await login(email, pass);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (err) {
      // Silent fail
    } finally {
      localStorage.removeItem("token");
      setCurrentUser(null);
      setFriends([]);
      setMessages([]);
      setUsers([]);
      setActiveChatFriendId(null);
      toast("You have been logged out.");
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }

      setIsLoading(true);
      const res = await axios.get(`${API_URL}/users/allusers`, {
        headers: { authorization: token },
      });

      console.log("Raw backend response:", res.data);

      if (!Array.isArray(res.data) || res.data.length === 0) {
        console.warn("No users returned from backend");
        setUsers([]);
        toast.error("No users found in the system.");
        return;
      }

      const fetchedUsers: User[] = res.data.map((user: any) => ({
        id: user._id,
        username: user.username || user.email.split('@')[0],
        email: user.email,
        avatar: `https://i.pravatar.cc/150?u=${user.username || user.email}`,
        isOnline: user.isOnline || false,
      }));

      console.log("Mapped users:", fetchedUsers);
      setUsers(fetchedUsers);
      toast.success("Users fetched successfully");
    } catch (err: any) {
      console.error("Error fetching users:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Unauthorized: Invalid or expired token. Please log in again.");
        localStorage.removeItem("token");
        setCurrentUser(null);
        window.location.href = "/login";
      } else {
        toast.error("Failed to fetch users: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFriends = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }

      setIsLoading(true);
      const res = await axios.get(`${API_URL}/users/friends`, {
        headers: { authorization: token },
      });

      const fetchedFriends: User[] = res.data.map((user: any) => ({
        id: user._id,
        username: user.username || user.email.split('@')[0],
        email: user.email,
        avatar: `https://i.pravatar.cc/150?u=${user.username || user.email}`,
        isOnline: user.isOnline || false,
      }));

      console.log("Fetched friends:", fetchedFriends);
      setFriends(fetchedFriends);
      toast.success("Friends fetched successfully");
    } catch (err: any) {
      console.error("Error fetching friends:", err);
      if (err.response?.status === 401) {
        toast.error("Unauthorized: Invalid or expired token. Please log in again.");
        localStorage.removeItem("token");
        setCurrentUser(null);
        window.location.href = "/login";
      } else {
        toast.error("Failed to fetch friends: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (friendId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }

      setIsLoading(true);
      const res = await axios.get(`${API_URL}/chat/${friendId}`, {
        headers: { authorization: token },
      });

      console.log("Raw messages response:", res.data);

      if (!Array.isArray(res.data)) {
        console.warn("No messages returned from backend");
        setMessages([]);
        return;
      }

      const fetchedMessages: Message[] = res.data
        .map((msg: any) => ({
          id: msg._id,
          senderId: msg.sender,
          receiverId: msg.receiver,
          text: msg.text,
          timestamp: new Date(msg.createdAt),
        }))
        .sort((a: Message, b: Message) => a.timestamp.getTime() - b.timestamp.getTime()); // Sort oldest to newest

      console.log("Mapped and sorted messages:", fetchedMessages);
      setMessages(fetchedMessages);
      toast.success("Messages loaded successfully");
    } catch (err: any) {
      console.error("Error fetching messages:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Unauthorized: Invalid or expired token. Please log in again.");
        localStorage.removeItem("token");
        setCurrentUser(null);
        window.location.href = "/login";
      } else {
        toast.error("Failed to fetch messages: " + (err.response?.data?.message || err.message));
      }
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFriend = useCallback(async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }

      const userToAdd = users.find(u => u.id === userId);
      if (!userToAdd) {
        throw new Error("User not found");
      }
      if (friends.some(f => f.id === userId)) {
        toast.error(`${userToAdd.username} is already a friend`);
        return;
      }

      setIsLoading(true);

      const res = await axios.post(
        `${API_URL}/users/add/${userId}`,
        {},
        {
          headers: { authorization: token },
        }
      );

      const addedFriend: User = {
        id: res.data.friend?._id || userId,
        username: res.data.friend?.username || userToAdd.username,
        email: res.data.friend?.email || userToAdd.email,
        avatar: res.data.friend?.avatar || `https://i.pravatar.cc/150?u=${res.data.friend?.username || userToAdd.username}`,
        isOnline: res.data.friend?.isOnline || false,
      };

      setFriends(prev => [...prev, addedFriend]);
      toast.success(`${addedFriend.username} added as a friend`);
    } catch (err: any) {
      console.error("Error adding friend:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Unauthorized: Invalid or expired token. Please log in again.");
        localStorage.removeItem("token");
        setCurrentUser(null);
        window.location.href = "/login";
      } else {
        toast.error(err?.response?.data?.message || "Failed to add friend");
      }
    } finally {
      setIsLoading(false);
    }
  }, [users, friends]);

  const sendMessage = useCallback(async (text: string) => {
    if (!currentUser || !activeChatFriendId) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }

      const newMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: currentUser.id,
        receiverId: activeChatFriendId,
        text,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newMessage].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));

      const res = await axios.post(
        `${API_URL}/chat/`,
        {
          receiverId: activeChatFriendId,
          text,
        },
        {
          headers: { authorization: token },
        }
      );

      const savedMessage: Message = {
        id: res.data._id,
        senderId: res.data.sender,
        receiverId: res.data.receiver,
        text: res.data.text,
        timestamp: new Date(res.data.createdAt),
      };

      setMessages(prev => prev.map(msg => msg.id === newMessage.id ? savedMessage : msg).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
      toast.success("Message sent successfully");
    } catch (err: any) {
      console.error("Error sending message:", err);
      if (err.response?.status === 401) {
        toast.error("Unauthorized: Invalid or expired token. Please log in again.");
        localStorage.removeItem("token");
        setCurrentUser(null);
        window.location.href = "/login";
      } else {
        toast.error("Failed to send message: " + err.message);
        setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, activeChatFriendId]);

  const value = {
    currentUser,
    users,
    friends,
    messages,
    activeChatFriendId,
    login,
    signup,
    logout,
    addFriend,
    setActiveChatFriendId,
    sendMessage,
    fetchUsers,
    fetchFriends,
    fetchMessages,
    isLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
