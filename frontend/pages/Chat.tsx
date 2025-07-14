import React, { useState, useEffect, useCallback } from 'react';
import { User, Message } from '../types';
import UserList from '../components/UserList';
import ChatBox from '../components/ChatBox';
import { api } from '../services/api';

interface ChatProps {
  currentUser: User;
  onLogout: () => void;
}

const Chat: React.FC<ChatProps> = ({ currentUser, onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Note: For real-time updates (e.g., new messages or user online status),
  // a WebSocket connection (like Socket.IO) would be needed on both client and server.
  // The current implementation fetches data on load.

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const fetchedUsers = await api.getAllUsers();
      setUsers(fetchedUsers);
      
      if (!selectedUser && fetchedUsers.length > 0) {
        setSelectedUser(fetchedUsers[0]);
      }
      
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoadingUsers(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchMessages = useCallback(async () => {
      if (!selectedUser) {
        setMessages([]);
        return;
      };
      try {
          setLoadingMessages(true);
          const fetchedMessages = await api.getMessages(selectedUser.id);
          setMessages(fetchedMessages);
      } catch (error) {
          console.error("Failed to fetch messages:", error);
      } finally {
          setLoadingMessages(false);
      }
  }, [selectedUser]);
  
  useEffect(() => {
      fetchMessages();
  }, [fetchMessages]);

  const handleSendMessage = async (text: string) => {
    if (!selectedUser) return;

    try {
        const newMessage = await api.sendMessage(text, selectedUser.id);
        setMessages(prevMessages => [...prevMessages, newMessage]);
    } catch (error) {
        console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex antialiased text-gray-200 bg-gray-900 overflow-hidden">
      <div className="flex-shrink-0 w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        {loadingUsers ? (
            <div className="p-4 text-center text-gray-400">Loading users...</div>
        ) : (
            <UserList 
              users={users} 
              currentUser={currentUser} 
              onSelectUser={setSelectedUser} 
              selectedUser={selectedUser}
              onLogout={onLogout}
            />
        )}
      </div>
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <ChatBox
            selectedUser={selectedUser}
            messages={messages}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            isLoading={loadingMessages}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            {loadingUsers ? (
                 <div className="text-center">Loading...</div>
            ) : users.length > 0 ? (
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium">Select a chat</h3>
                  <p className="mt-1 text-sm">Start a conversation with someone from your list.</p>
                </div>
            ) : (
                <div className="text-center">
                    <h3 className="mt-2 text-sm font-medium">No other users found</h3>
                    <p className="mt-1 text-sm">Register another user in a different browser tab to start chatting.</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;