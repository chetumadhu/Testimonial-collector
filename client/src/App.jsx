import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { SpaceDetail } from './pages/SpaceDetail';
import { PublicCollect } from './pages/PublicCollect';
import { WallOfLove } from './pages/WallOfLove';
import { EmbedWidget } from './pages/EmbedWidget';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout wrapper to hide Navbar on Embeds
const AppLayout = () => {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith('/embed/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {!isEmbed && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public Home & Auth */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Owner Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/space/:id"
            element={
              <ProtectedRoute>
                <SpaceDetail />
              </ProtectedRoute>
            }
          />

          {/* Frictionless Public Submissions & Showcase */}
          <Route path="/collect/:spaceSlug" element={<PublicCollect />} />
          <Route path="/wall/:spaceSlug" element={<WallOfLove />} />

          {/* Standalone Embed Route */}
          <Route path="/embed/:spaceSlug" element={<EmbedWidget />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
