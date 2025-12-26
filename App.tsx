import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layout/AdminLayout';
import ProviderList from './pages/Admin/ProviderList';
import ProviderConfigForm from './pages/Admin/ProviderConfigForm';
import Dashboard from './pages/Admin/Dashboard';
import UserDashboard from './pages/UserDashboard';
import { User } from './types/index';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingSession, setLoadingSession] = useState<boolean>(true);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('sso_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      // Clear corrupted data
      localStorage.removeItem('sso_user');
    } finally {
      setLoadingSession(false);
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('sso_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sso_user');
  };
  
  if (loadingSession) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout user={user} onLogout={handleLogout} />}>
            <Route index element={<Dashboard />} />
            <Route path="providers" element={<ProviderList />} />
            <Route path="provider/new" element={<ProviderConfigForm />} />
            <Route path="provider/:id" element={<ProviderConfigForm />} />
        </Route>

        {/* User Dashboard */}
        <Route path="/dashboard" element={
            user ? (
                <UserDashboard user={user} onLogout={handleLogout} />
            ) : <Navigate to="/" />
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;