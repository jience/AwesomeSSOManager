import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layout/AdminLayout';
import ProviderList from './pages/Admin/ProviderList';
import ProviderConfigForm from './pages/Admin/ProviderConfigForm';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Restore session from localStorage for demo purposes
  useEffect(() => {
    const storedUser = localStorage.getItem('sso_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout user={user} onLogout={handleLogout} />}>
            <Route index element={<ProviderList />} />
            <Route path="provider/new" element={<ProviderConfigForm />} />
            <Route path="provider/:id" element={<ProviderConfigForm />} />
        </Route>

        {/* Dummy Dashboard for non-admin users */}
        <Route path="/dashboard" element={
            user ? (
                <div className="min-h-screen bg-gray-50 p-8">
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
                        <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
                        <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6">
                            Successfully authenticated via JWT!
                        </div>
                        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                            {JSON.stringify(user, null, 2)}
                        </pre>
                        <button onClick={handleLogout} className="mt-6 px-4 py-2 bg-red-600 text-white rounded">Logout</button>
                    </div>
                </div>
            ) : <Navigate to="/" />
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
