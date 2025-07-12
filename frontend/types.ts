
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string; // URL
  isOnline: boolean;
  password?: string; // For mock auth
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}
