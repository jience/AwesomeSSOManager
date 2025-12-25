import React from 'react';
import { useNavigate, Outlet, Navigate } from 'react-router-dom';
import { User } from '../types';
import { SettingsIcon, LockIcon } from '../components/Icons';

interface AdminLayoutProps {
  user: User | null;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
     return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
               <SettingsIcon className="text-white w-5 h-5" />
           </div>
           <span className="font-bold text-gray-800 text-lg">SSO Manager</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
           <button 
             onClick={() => navigate('/admin')}
             className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-blue-50 text-blue-700"
           >
              <LockIcon className="w-5 h-5 mr-3" />
              Identity Providers
           </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
           <div className="flex items-center gap-3 mb-4 px-2">
               <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                   AD
               </div>
               <div className="text-sm">
                   <p className="font-medium text-gray-900">Administrator</p>
                   <p className="text-xs text-gray-500">{user.email}</p>
               </div>
           </div>
           <button onClick={onLogout} className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg text-left">
               Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
         <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden">
             <span className="font-bold">SSO Manager</span>
             <button onClick={onLogout} className="text-sm text-red-600">Logout</button>
         </header>

         <div className="flex-1 overflow-auto p-6 md:p-8">
            <Outlet />
         </div>
      </main>
    </div>
  );
};

export default AdminLayout;