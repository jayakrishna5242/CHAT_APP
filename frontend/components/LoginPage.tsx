import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { SunIcon, MoonIcon } from './common/Icons';
import { useDarkMode } from '../hooks/useDarkMode';

interface LoginPageProps {
  onSwitch: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAppContext();
  const [theme, toggleTheme] = useDarkMode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password) {
      login(email.trim(), password);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <div className="absolute top-4 right-4">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary">
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
          </button>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-light-bg dark:bg-dark-bg rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-light-primary dark:text-dark-primary">Welcome Back!</h1>
          <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">Sign in to continue to Gemini Chat</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 bg-transparent text-light-text dark:text-dark-text focus:outline-none focus:ring-light-primary focus:border-light-primary dark:focus:ring-dark-primary dark:focus:border-dark-primary sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
             <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 bg-transparent text-light-text dark:text-dark-text focus:outline-none focus:ring-light-primary focus:border-light-primary dark:focus:ring-dark-primary dark:focus:border-dark-primary sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
            <div className="text-center text-xs text-light-text-secondary dark:text-dark-text-secondary">
                <p>Use <code className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-1 rounded">user@test.com</code> / <code className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-1 rounded">password</code></p>
            </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-light-primary hover:bg-light-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
         <p className="text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Don't have an account?{' '}
          <button onClick={onSwitch} className="font-medium text-light-primary hover:text-light-primary-hover dark:text-dark-primary dark:hover:text-dark-primary-hover focus:outline-none">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};
