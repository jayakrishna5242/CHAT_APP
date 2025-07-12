
import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import ChatPage from './components/ChatPage';
import { useAppContext } from './context/AppContext';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  const { currentUser } = useAppContext();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  const renderAuth = () => {
    if (authView === 'login') {
      return <LoginPage onSwitch={() => setAuthView('signup')} />;
    }
    return <SignupPage onSwitch={() => setAuthView('login')} />;
  };

  return (
    <>
      {currentUser ? <ChatPage /> : renderAuth()}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: 'dark:bg-dark-bg-tertiary dark:text-dark-text',
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
};

export default App;