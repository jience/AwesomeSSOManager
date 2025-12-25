import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProviders } from '../services/storageService';
import { ProviderConfig, User } from '../types';
import { Card, Button, Input } from '../components/UI';
import { ShieldIcon, LockIcon } from '../components/Icons';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [localUsername, setLocalUsername] = useState('');
  const [localPassword, setLocalPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Only load enabled providers
    const allProviders = getProviders();
    setProviders(allProviders.filter(p => p.isEnabled));
  }, []);

  const handleSSOLogin = (provider: ProviderConfig) => {
    setLoading(true);
    // Simulate redirection delay
    setTimeout(() => {
      // Simulate successful callback with a dummy JWT
      const mockUser: User = {
        id: 'user-123',
        username: `user_${provider.type.toLowerCase()}`,
        email: `user@${provider.name.toLowerCase().replace(/\s/g, '')}.com`,
        role: 'user',
        token: `header.${btoa(JSON.stringify({ sub: '123', name: 'SSO User' }))}.signature`
      };
      
      onLogin(mockUser);
      setLoading(false);
      navigate('/dashboard'); // Redirect to user dashboard (or admin if role was admin)
    }, 1500);
  };

  const handleLocalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Hardcoded admin for demo
    setTimeout(() => {
      if (localUsername === 'admin' && localPassword === 'admin') {
        const adminUser: User = {
          id: 'admin-1',
          username: 'admin',
          email: 'admin@company.com',
          role: 'admin',
          token: 'admin-jwt-token'
        };
        onLogin(adminUser);
        navigate('/admin');
      } else {
        alert('Invalid credentials. Try admin/admin');
        setLoading(false);
      }
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Authenticating with provider...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <ShieldIcon className="text-blue-600 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign in to Management System</h1>
          <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
        </div>

        {/* Local Login Form */}
        <form onSubmit={handleLocalLogin} className="space-y-4 mb-6">
          <Input 
            label="Username" 
            value={localUsername} 
            onChange={(e) => setLocalUsername(e.target.value)} 
            placeholder="admin"
          />
          <Input 
            label="Password" 
            type="password" 
            value={localPassword} 
            onChange={(e) => setLocalPassword(e.target.value)} 
            placeholder="admin"
          />
          <Button type="submit" className="w-full">
            <LockIcon className="w-4 h-4" /> Sign In
          </Button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* SSO Providers List */}
        <div className="space-y-3">
          {providers.length === 0 ? (
            <p className="text-center text-sm text-gray-400 italic">No SSO providers configured.</p>
          ) : (
            providers.map(provider => (
              <button
                key={provider.id}
                onClick={() => handleSSOLogin(provider)}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {provider.logo ? (
                  <img src={provider.logo} alt="" className="h-5 w-5 mr-3" />
                ) : (
                  <ShieldIcon className="h-5 w-5 mr-3 text-gray-400" />
                )}
                <span>Sign in with {provider.name}</span>
                <span className="ml-auto text-xs text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded">
                  {provider.type}
                </span>
              </button>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
