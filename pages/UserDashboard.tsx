import React, { useState } from 'react';
import { User } from '../types';
import { Button, Card, Badge } from '../components/UI';
import { UserIcon, LogOutIcon, KeyIcon, ShieldIcon, CheckCircleIcon } from '../components/Icons';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
  const [showToken, setShowToken] = useState(false);

  // Attempt to pretty print the payload if it's a JWT-like string
  const getDecodedPayload = () => {
    try {
      const parts = user.token.split('.');
      if (parts.length === 3) {
        return JSON.stringify(JSON.parse(atob(parts[1])), null, 2);
      }
    } catch (e) {
      // ignore error
    }
    return null;
  };

  const decodedPayload = getDecodedPayload();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <ShieldIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg">SSO User Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-medium text-gray-900">{user.username}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
              <Button variant="ghost" onClick={onLogout} className="text-gray-600 hover:text-red-600 hover:bg-red-50">
                <LogOutIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.username}!</h1>
          <p className="text-gray-600 mt-1">You have successfully authenticated via Single Sign-On.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: User Profile */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <div className="flex flex-col items-center pb-6 border-b border-gray-100">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                  <UserIcon className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
                <p className="text-gray-500 text-sm mb-3">{user.email}</p>
                <div className="flex gap-2">
                   <Badge active={true} />
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase">
                     {user.role}
                   </span>
                </div>
              </div>
              <div className="pt-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Account Details</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs text-gray-500">User ID</dt>
                    <dd className="text-sm font-medium text-gray-900">{user.id}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Login Method</dt>
                    <dd className="text-sm font-medium text-gray-900 flex items-center gap-2">
                       <ShieldIcon className="w-3 h-3 text-green-500" />
                       Standard SSO
                    </dd>
                  </div>
                </dl>
              </div>
            </Card>
          </div>

          {/* Right Column: Session & Security */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-full shrink-0">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-green-900">Session Active</h3>
                    <p className="text-green-800 mt-1">
                        Your identity has been verified. You have full access to {user.role === 'admin' ? 'administrative' : 'standard'} resources.
                    </p>
                </div>
            </div>

            {/* Token Card */}
            <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                        <KeyIcon className="w-5 h-5 text-gray-400" />
                        <div>
                            <h3 className="font-semibold text-gray-900">Security Token (JWT)</h3>
                            <p className="text-xs text-gray-500">Used for API authorization</p>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={() => setShowToken(!showToken)} className="text-sm h-9">
                        {showToken ? 'Hide Token' : 'Show Token'}
                    </Button>
                </div>
                
                {showToken && (
                    <div className="p-6 bg-slate-900">
                        {decodedPayload && (
                            <div className="mb-6">
                                <span className="text-xs font-mono text-gray-400 uppercase mb-2 block tracking-wider">Decoded Payload</span>
                                <pre className="font-mono text-sm text-green-400 overflow-x-auto p-4 bg-slate-800 rounded-lg">
                                    {decodedPayload}
                                </pre>
                            </div>
                        )}
                        <div>
                            <span className="text-xs font-mono text-gray-400 uppercase mb-2 block tracking-wider">Raw Token String</span>
                            <div className="font-mono text-xs text-gray-300 break-all bg-slate-800 p-4 rounded-lg leading-relaxed">
                                {user.token}
                            </div>
                        </div>
                    </div>
                )}
                {!showToken && (
                     <div className="p-8 text-center bg-white">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <KeyIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500">Token details are hidden for security.</p>
                     </div>
                )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;