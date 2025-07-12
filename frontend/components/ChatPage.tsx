
import React from 'react';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { useAppContext } from '../context/AppContext';
import { GemIcon } from './common/Icons';

const ChatPage: React.FC = () => {
    const { activeChatFriendId } = useAppContext();
    return (
        <div className="flex h-screen antialiased text-light-text dark:text-dark-text bg-light-bg dark:bg-dark-bg">
            <Sidebar />
            {activeChatFriendId ? (
                <ChatArea />
            ) : (
                <div className="flex flex-col items-center justify-center w-full text-center p-4">
                    <GemIcon className="w-24 h-24 text-light-bg-tertiary dark:text-dark-bg-tertiary mb-4" />
                    <h2 className="text-xl font-semibold text-light-text-secondary dark:text-dark-text-secondary">Select a friend to start chatting</h2>
                    <p className="mt-1 text-light-text-secondary dark:text-dark-text-secondary">Your conversations will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
