import React, { useState, useMemo, useEffect } from 'react';
import { User } from '../types';

interface UserListProps {
  users: User[];
  currentUser: User;
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  onLogout: () => void;
}

// Dark mode hook
function useDarkMode(): [string, () => void] {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return [theme, toggleTheme];
}



const SearchIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.52-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserList: React.FC<UserListProps> = ({
  users,
  currentUser,
  onSelectUser,
  selectedUser,
  onLogout,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, toggleTheme] = useDarkMode();

  // Filter users by search term
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  return (
    <>
      {/* Header: Avatar, name, logout & theme toggle */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="ml-3 font-semibold">{currentUser.name}</span>
        </div>
        <div className="flex items-center space-x-2">
     

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none"
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative">
          <SearchIcon className="absolute w-5 h-5 top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>






      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider p-2">
            Direct Messages
          </h2>
        </div>
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <button
                onClick={() => onSelectUser(user)}
                className={`flex items-center w-full px-4 py-2 text-left rounded-md transition-colors duration-200 ${
                  selectedUser?.id === user.id
                    ? 'bg-teal-600/50'
                    : 'hover:bg-gray-700/50'
                }`}
              >
                <div className="relative">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={user.avatarUrl}
                    alt={user.name}
                  />
                  {user.isOnline && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-gray-800"></span>
                  )}
                </div>
                <span className="ml-3 flex-1">{user.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>





    </>
  );
};

export default UserList;
