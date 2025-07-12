
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { SendIcon } from './common/Icons';
import type { Message } from '../types';
import Spinner from './common/Spinner';

const ChatHeader: React.FC = () => {
    const { friends, activeChatFriendId } = useAppContext();
    const friend = friends.find(f => f.id === activeChatFriendId);

    if (!friend) return null;

    return (
        <div className="flex items-center p-4 border-b border-light-bg-tertiary dark:border-dark-bg-tertiary">
            <img className="w-10 h-10 rounded-full" src={friend.avatar} alt={friend.username} />
            <div className="ml-3">
                <p className="font-semibold text-light-text dark:text-dark-text">{friend.username}</p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{friend.isOnline ? 'Online' : 'Offline'}</p>
            </div>
        </div>
    );
};

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const { currentUser } = useAppContext();
    const isSentByMe = message.senderId === currentUser?.id;

    return (
        <div className={`flex flex-col ${isSentByMe ? 'items-end' : 'items-start'}`}>
            <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                    isSentByMe
                        ? 'bg-light-primary dark:bg-dark-primary text-white rounded-br-lg'
                        : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text rounded-bl-lg'
                }`}
            >
                <p>{message.text}</p>
            </div>
            <span className="text-xs mt-1 text-light-text-secondary dark:text-dark-text-secondary">
                {new Date(message.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })}
            </span>
        </div>
    );
};

const MessageInput: React.FC = () => {
    const [text, setText] = useState('');
    const { sendMessage, isLoading } = useAppContext();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() && !isLoading) {
            sendMessage(text.trim());
            setText('');
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="p-4 border-t border-light-bg-tertiary dark:border-dark-bg-tertiary">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                <input
                    ref={inputRef}
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary text-light-text dark:text-dark-text"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-light-primary dark:bg-dark-primary text-white hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !text.trim()}
                >
                    {isLoading ? <Spinner /> : <SendIcon className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
};

export const ChatArea: React.FC = () => {
    const { messages, activeChatFriendId } = useAppContext();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col flex-1 w-full">
            <ChatHeader />
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length > 0 ? (
                    messages.map(msg => <MessageBubble key={msg.id} message={msg} />)
                ) : (
                    <p className="text-center text-light-text-secondary dark:text-dark-text-secondary">
                        No messages yet.
                    </p>
                )}
                <div ref={messagesEndRef} />
            </div>
            <MessageInput />
        </div>
    );
};