export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  SEEN = 'seen',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // optional, used during login or registration
  avatarUrl: string;
  isOnline: boolean;
  friends: string[]; // Array of User IDs (ObjectIds)
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
}
