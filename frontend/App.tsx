import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import { User } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await api.getLoggedInUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Not authenticated", error);
        setCurrentUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
  };

  if (!authChecked) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-semibold">Authenticating...</div>;
  }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/chat" /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/register" 
          element={currentUser ? <Navigate to="/chat" /> : <Register onRegisterSuccess={handleLogin} />} 
        />
        <Route 
          path="/chat" 
          element={currentUser ? <Chat currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;