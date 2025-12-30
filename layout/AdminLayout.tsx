import React from 'react';
import { useNavigate, Outlet, Navigate, useLocation } from 'react-router-dom';
import { User } from '../types/index';
import { SettingsIcon, LockIcon, HomeIcon } from '../components/Icons';

interface AdminLayoutProps {
  user: User | null;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
     return <Navigate to="/" replace />;
  }

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const navItemClass = (path: string) => 
    `w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive(path) 
        ? 'bg-blue-50 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <div className="min-h-screen bg-[#020617] text-gray-200 flex relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e293b_0%,_#020617_100%)] z-0"></div>
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
      }}></div>

      {/* Sidebar */}
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 relative z-10 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
           <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-cyan-500/20">
               <SettingsIcon className="text-white w-5 h-5" />
           </div>
           <span className="font-bold text-white text-lg tracking-tight">SSO Manager</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
           <button 
             onClick={() => navigate('/admin')}
             className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
               isActive('/admin') 
                 ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                 : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
             }`}
           >
              <HomeIcon className="w-5 h-5 mr-3" />
              Dashboard
           </button>
           <button 
             onClick={() => navigate('/admin/providers')}
             className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
               isActive('/admin/providers') 
                 ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                 : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
             }`}
           >
              <LockIcon className="w-5 h-5 mr-3" />
              Identity Providers
           </button>
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
           <div className="flex items-center gap-3 mb-4 px-2">
               <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10 flex items-center justify-center text-xs font-bold text-cyan-400 uppercase">
                   {user.username.substring(0, 2)}
               </div>
               <div className="text-sm">
                   <p className="font-medium text-white">{user.username}</p>
                   <p className="text-xs text-gray-500 truncate w-32">{user.email}</p>
               </div>
           </div>
           <button onClick={onLogout} className="w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl text-left transition-colors flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
               Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
         <header className="h-16 bg-black/20 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 md:hidden">
             <span className="font-bold text-white">SSO Manager</span>
             <button onClick={onLogout} className="text-sm text-red-400">Logout</button>
         </header>

         <div className="flex-1 overflow-auto p-6 md:p-10">
            <Outlet />
         </div>
      </main>
    </div>
  );
};

export default AdminLayout;