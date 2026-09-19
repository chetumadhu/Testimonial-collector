import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { MessageSquareQuote, Sun, Moon, LogOut, LayoutDashboard, CheckCircle2, ShieldAlert } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [verifying, setVerifying] = useState(false);
  const [simulatedNotice, setSimulatedNotice] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSimulateVerify = async () => {
    if (!user) return;
    setVerifying(true);
    try {
      // In simulated mode, we verify directly with demo token
      await verifyEmail('demo_verified_token', user.email);
      setSimulatedNotice('Email verified successfully!');
      setTimeout(() => setSimulatedNotice(''), 3000);
    } catch (err) {
      setSimulatedNotice('Email verified!');
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {user && !user.isVerified && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Simulated Email Verification:</strong> Please verify your account to unlock all features.
            </span>
          </div>
          <button
            onClick={handleSimulateVerify}
            disabled={verifying}
            className="underline font-semibold hover:text-amber-900 dark:hover:text-amber-100 cursor-pointer ml-4"
          >
            {verifying ? 'Verifying...' : 'Click to Simulate 1-Click Verification'}
          </button>
        </div>
      )}

      {simulatedNotice && (
        <div className="bg-emerald-500 text-white text-xs font-semibold px-4 py-1.5 text-center flex items-center justify-center space-x-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>{simulatedNotice}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Trust<span className="text-emerald-600 dark:text-emerald-400">Pulse</span>
            </span>
          </Link>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex items-center space-x-1.5">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 hidden md:block">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
