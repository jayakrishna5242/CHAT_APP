
import React, { useState, useRef, useEffect } from 'react';
import { User, Message, MessageStatus } from '../types';

interface ChatBoxProps {
  selectedUser: User;
  currentUser: User;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const CheckIcon: React.FC<{ status: MessageStatus }> = ({ status }) => {
  const isSeen = status === MessageStatus.SEEN;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isSeen ? 'text-blue-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      {status !== MessageStatus.SENT && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13l4 4L23 7" />}
    </svg>
  );
};


const ChatBox: React.FC<ChatBoxProps> = ({ selectedUser, currentUser, messages, onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center">
            <img className="w-10 h-10 rounded-full object-cover" src={selectedUser.avatarUrl} alt={selectedUser.name} />
            <div className="ml-3">
                <p className="font-semibold">{selectedUser.name}</p>
                <p className={`text-xs ${selectedUser.isOnline ? 'text-green-400' : 'text-gray-500'}`}>{selectedUser.isOnline ? 'Online' : 'Offline'}</p>
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
       {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-400">Loading messages...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isSender = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isSender ? 'bg-teal-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                    <p className="text-sm">{msg.text}</p>
                     <div className="flex items-center justify-end mt-1">
                        <span className="text-xs text-gray-400 mr-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isSender && <CheckIcon status={msg.status} />}
                      </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="p-4 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button type="submit" className="ml-3 p-3 bg-teal-600 rounded-full text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatBox;
