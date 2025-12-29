import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { APP_CONFIG } from '../config';
import { getProviders as storageGetProviders, getSSOLoginUrl } from '../services/storageService';
import { login as apiLogin, getProviders as apiGetProviders } from '../services/apiService';
import { ProviderConfig, User } from '../types/index';
import { Card, Button, Input } from '../components/UI';
import { ShieldIcon, LockIcon } from '../components/Icons';

import { useNotification } from '../contexts/NotificationContext';


interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [localUsername, setLocalUsername] = useState('admin');
  const [localPassword, setLocalPassword] = useState('admin');
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useNotification();

  useEffect(() => {
    const loadProviders = async () => {
      let allProviders: ProviderConfig[] = [];
      if (APP_CONFIG.API_MODE) {
        const fetchedProviders = await apiGetProviders();
        if (fetchedProviders) {
          allProviders = fetchedProviders;
        }
      } else {
        allProviders = storageGetProviders();
      }
      // Only load enabled providers
      setProviders(allProviders.filter(p => p.isEnabled));
    };

    loadProviders();

    // Check if we returned from a backend SSO redirect with a token
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
        // Decode token minimally to get user info (in real app, verify signature or call /me)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const user: User = {
                id: payload.id || 'api-user',
                username: payload.username || payload.name || 'SSO User',
                email: payload.email || 'user@example.com',
                role: payload.role || 'user',
                token: token
            };
            onLogin(user);
            navigate('/dashboard');
        } catch (e) {
            console.error("Invalid token param");
        }
    }
  }, [location, onLogin, navigate]);


  const handleSSOLogin = (provider: ProviderConfig) => {
    setLoading(true);
    
    const loginUrl = getSSOLoginUrl(provider.id);
    
    if (loginUrl !== '#') {
        // Real Backend Flow
        window.location.href = loginUrl;
        return;
    }

    // --- Mock Local Flow (Default) ---
    setTimeout(() => {
      // Simulate successful callback with a dummy JWT
      const mockUser: User = {
        id: 'user-123',
        username: `user_${provider.type.toLowerCase()}`,
        email: `user@${provider.name.toLowerCase().replace(/\s/g, '')}.com`,
        role: 'user',
        token: `header.${btoa(JSON.stringify({ sub: '123', name: 'SSO User', email: 'demo@example.com', role: 'user' }))}.signature`
      };
      
      onLogin(mockUser);
      setLoading(false);
      navigate('/dashboard'); 
    }, 1500);
  };

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (APP_CONFIG.API_MODE) {
      try {
        const result = await apiLogin(localUsername, localPassword);
        if (result) {
          onLogin(result.user);
          navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
        } else {
          // Handles server-side errors like 401 Unauthorized
          addToast('error', 'Login Failed', 'Invalid credentials or server error.');
        }
      } catch (error) {
        // Handles network errors (e.g., server is down)
        console.error("Login API call failed:", error);
        addToast('error', 'Connection Error', 'Failed to connect to the server. Please check if the backend is running.');
      } finally {
        // This ensures the loading spinner is turned off regardless of success or failure
        setLoading(false);
      }
    } else {
      // --- Mock Login ---
      setTimeout(() => {
        if (localUsername === 'admin' && localPassword === 'admin') {
          const adminUser: User = {
            id: 'admin-1',
            username: 'admin',
            email: 'admin@company.com',
            role: 'admin',
            token: 'admin-jwt-token' // This is a mock token
          };
          onLogin(adminUser);
          navigate('/admin');
        } else {
          addToast('error', 'Login Failed', 'Invalid credentials. Try admin/admin');
          setLoading(false);
        }
      }, 800);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
        <p className="text-gray-300 font-medium tracking-wide">Authenticating with provider...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#020617]">
       {/* Enhanced Tech Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e293b_0%,_#020617_100%)] z-0"></div>
      
      {/* Dynamic Grid */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.2) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
      }}></div>
      
      {/* Floating Orbs with custom animations */}
      <div className="absolute top-[10%] left-[15%] w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[15%] right-[20%] w-80 h-80 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
      <div className="absolute top-[40%] right-[10%] w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] animate-bounce duration-[10s]"></div>

      <Card className="w-full max-w-md p-10 relative z-10 !bg-slate-900/60 backdrop-blur-2xl !border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-10 relative">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.4)] transform hover:scale-110 transition-transform duration-500 cursor-default">
            <ShieldIcon className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">
              SSO Manager
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2">
              <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-cyan-500/50"></span>
              <p className="text-gray-400 text-xs uppercase tracking-[0.3em] font-medium">Unified Intelligence</p>
              <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-cyan-500/50"></span>
          </div>
        </div>

        {/* Local Login Form */}
        <form onSubmit={handleLocalLogin} className="space-y-6 mb-10">
          <div className="group">
              <label className="block text-[10px] font-bold text-cyan-500/70 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-cyan-400 transition-colors">Username</label>
              <div className="relative">
                  <input 
                    value={localUsername} 
                    onChange={(e) => setLocalUsername(e.target.value)} 
                    placeholder="Username"
                    className="w-full px-5 py-4 bg-black/50 border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-gray-600 transition-all hover:bg-black/70 focus:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  />
              </div>
          </div>
          <div className="group">
              <label className="block text-[10px] font-bold text-cyan-500/70 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-cyan-400 transition-colors">Password</label>
              <div className="relative">
                  <input 
                    type="password"
                    value={localPassword} 
                    onChange={(e) => setLocalPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-black/50 border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-gray-600 transition-all hover:bg-black/70 focus:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  />
              </div>
          </div>

          <Button type="submit" className="w-full group relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:translate-y-[-2px] active:translate-y-[1px] border-0">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translateX-full group-hover:animate-[shimmer_2s_infinite]"></div>
            <div className="flex items-center justify-center gap-2">
                <LockIcon className="w-4 h-4" />
                <span>Sign In</span>
            </div>
          </Button>
        </form>

        <div className="relative mb-8 text-center">
          <span className="relative z-10 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] before:content-[''] before:absolute before:top-1/2 before:right-full before:w-16 before:h-[1px] before:bg-white/5 after:content-[''] after:absolute after:top-1/2 after:left-full after:w-16 after:h-[1px] after:bg-white/5">
            Or Use Sign-on
          </span>
        </div>

        {/* SSO Providers List */}
        <div className="space-y-3">
          {providers.length === 0 ? (
            <div className="text-center p-6 border border-white/5 rounded-2xl bg-black/20">
                <p className="text-xs text-gray-500 italic">No SSO providers configured.</p>
            </div>
          ) : (
            providers.map(provider => (
              <button
                key={provider.id}
                onClick={() => handleSSOLogin(provider)}
                className="w-full group flex items-center justify-between px-5 py-4 border border-white/5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-sm text-gray-300 transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/30 focus:outline-none"
              >
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center mr-4 group-hover:border-cyan-500/50 transition-colors">
                        {provider.logo ? (
                        <img src={provider.logo} alt="" className="h-5 w-5 rounded-sm" />
                        ) : (
                        <ShieldIcon className="h-4 w-4 text-cyan-400" />
                        )}
                    </div>
                    <span className="group-hover:text-white transition-colors">Continue with <span className="font-bold text-white">{provider.name}</span></span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-cyan-400/60 uppercase tracking-tighter bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/10 group-hover:text-cyan-300 group-hover:border-cyan-500/30">
                        {provider.type}
                    </span>
                </div>
              </button>
            ))
          )}
        </div>
      </Card>
      
      {/* Footer System Info */}
      <div className="absolute bottom-6 text-[10px] text-gray-600 uppercase tracking-[0.5em] font-medium z-10">
          Core System Active • Encrypted Path
      </div>
    </div>
  );
};

export default LoginPage;