
import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useDarkMode } from '../hooks/useDarkMode';
import { SunIcon, MoonIcon, SearchIcon, LogoutIcon, AddFriendIcon } from './common/Icons';
import type { User } from '../types';

const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  const { logout } = useAppContext();
  const [theme, toggleTheme] = useDarkMode();

  return (
    <div className="flex items-center justify-between p-4 border-b border-light-bg-tertiary dark:border-dark-bg-tertiary">
      <div className="flex items-center">
        <img className="w-10 h-10 rounded-full" src={user.avatar} alt={user.username} />
        <span className="ml-3 font-semibold text-light-text dark:text-dark-text">{user.username}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary">
          {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
        <button onClick={logout} className="p-2 rounded-full hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary">
          <LogoutIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const FriendItem: React.FC<{ friend: User, isActive: boolean, onClick: () => void, showAddButton?: boolean }> = ({ friend, isActive, onClick, showAddButton = false }) => {
  const { addFriend, friends, isLoading } = useAppContext();
  const isFriend = friends.some(f => f.id === friend.id);

  return (
    <li
      className={`flex items-center justify-between p-3 cursor-pointer rounded-lg mx-2 transition-colors ${
        isActive
          ? 'bg-light-primary/20 dark:bg-dark-primary/30'
          : 'hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'
      }`}
    >
      <div className="flex items-center flex-1" onClick={onClick}>
        <div className="relative">
          <img className="w-10 h-10 rounded-full" src={friend.avatar} alt={friend.username} />
          {friend.isOnline && (
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-dark-bg-tertiary"></span>
          )}
        </div>
        <div className="ml-3">
          <p className="font-semibold text-light-text dark:text-dark-text">{friend.username}</p>
        </div>
      </div>
      {showAddButton && !isFriend && (
        <button
          onClick={() => addFriend(friend.id)}
          className="p-2 text-light-primary dark:text-dark-primary hover:bg-light-primary/10 dark:hover:bg-dark-primary/20 rounded-full"
          title={`Add ${friend.username} as friend`}
          disabled={isLoading}
        >
          <AddFriendIcon className="w-6 h-6" />
        </button>
      )}
    </li>
  );
};

const SearchResultItem: React.FC<{ user: User }> = ({ user }) => {
  const { addFriend, friends, isLoading } = useAppContext();
  const isFriend = friends.some(f => f.id === user.id);

  return (
    <div className="flex items-center justify-between p-3 mx-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary">
      <div className="flex items-center">
        <img className="w-10 h-10 rounded-full" src={user.avatar} alt={user.username} />
        <div className="ml-3">
          <p className="font-semibold text-light-text dark:text-dark-text">{user.username}</p>
        </div>
      </div>
      {!isFriend && (
        <button
          onClick={() => addFriend(user.id)}
          className="p-2 text-light-primary dark:text-dark-primary hover:bg-light-primary/10 dark:hover:bg-dark-primary/20 rounded-full"
          title={`Add ${user.username} as friend`}
          disabled={isLoading}
        >
          <AddFriendIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const { currentUser, friends, users, activeChatFriendId, setActiveChatFriendId, fetchUsers } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarView, setSidebarView] = useState<'my-friends' | 'new-friends'>('my-friends');

  const filteredFriends = useMemo(() => {
    return friends.filter(friend => friend.username.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, friends]);

  const potentialNewFriends = useMemo(() => {
    const friendIds = new Set(friends.map(f => f.id));
    return users.filter(
      user => !friendIds.has(user.id) && user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users, friends]);

  useEffect(() => {
    if (sidebarView === 'new-friends') {
      console.log("Fetching users for New Friends view...");
      fetchUsers();
    }
  }, [sidebarView, fetchUsers]);

  if (!currentUser) return null;

  return (
    <div className="flex flex-col w-full md:w-80 border-r border-light-bg-tertiary dark:border-dark-bg-tertiary bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <UserProfile user={currentUser} />
      
      <div className="p-4">
        <div className="relative">
          <SearchIcon className="absolute w-5 h-5 top-1/2 left-3 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
          <input
            type="text"
            placeholder={sidebarView === 'my-friends' ? "Search friends..." : "Search for new friends..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
          />
        </div>
      </div>

      <div className="flex items-center justify-around px-4 pb-2 border-b border-light-bg-tertiary dark:border-dark-bg-tertiary">
        <button
          onClick={() => setSidebarView('my-friends')}
          className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${
            sidebarView === 'my-friends'
              ? 'bg-light-primary/10 dark:bg-dark-primary/20 text-light-primary dark:text-dark-primary'
              : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary'
          }`}
        >
          My Friends
        </button>
        <button
          onClick={() => setSidebarView('new-friends')}
          className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${
            sidebarView === 'new-friends'
              ? 'bg-light-primary/10 dark:bg-dark-primary/20 text-light-primary dark:text-dark-primary'
              : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary'
          }`}
        >
          New Friends
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pt-2">
        {sidebarView === 'my-friends' ? (
          <div>
            <h3 className="px-4 pb-2 text-xs font-bold uppercase text-light-text-secondary dark:text-dark-text-secondary">
              Friends ({filteredFriends.length})
            </h3>
            <ul className="space-y-1">
              {filteredFriends.map(friend => (
                <FriendItem
                  key={friend.id}
                  friend={friend}
                  isActive={friend.id === activeChatFriendId}
                  onClick={() => setActiveChatFriendId(friend.id)}
                />
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h3 className="px-4 pb-2 text-xs font-bold uppercase text-light-text-secondary dark:text-dark-text-secondary">
              Discover People
            </h3>
            {potentialNewFriends.length > 0 ? (
              <ul className="space-y-1">
                {potentialNewFriends.map(user => (
                  <FriendItem
                    key={user.id}
                    friend={user}
                    isActive={user.id === activeChatFriendId}
                    onClick={() => setActiveChatFriendId(user.id)}
                    showAddButton={true}
                  />
                ))}
              </ul>
            ) : (
              <p className="px-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                No new users found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
