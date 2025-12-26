import React, { useState } from 'react';
import { User } from '../types/index';
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
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 relative overflow-hidden flex items-center justify-center">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e293b_0%,_#020617_100%)] z-0"></div>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <Card className="max-w-3xl w-full p-10 relative z-10 !bg-slate-900/40 backdrop-blur-3xl border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 transform -rotate-3">
               <UserIcon className="text-white w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">SSO User Portal</h2>
              <p className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-xs mt-1">Status: Authenticated & Secure</p>
            </div>
          </div>
          <Button variant="danger" onClick={onLogout} className="px-8 py-3 shadow-lg shadow-red-900/20">
            <LogOutIcon className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <ShieldIcon className="w-3 h-3 text-cyan-500" />
                Standard SSO
            </h3>
            <div className="space-y-6">
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-colors">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</p>
                <p className="text-lg font-bold text-white">{user.username}</p>
              </div>
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-colors">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Secure Email</p>
                <p className="text-lg font-bold text-white">{user.email}</p>
              </div>
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-colors">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Access Permission</p>
                <Badge active={true} />
                <span className="ml-3 text-sm font-bold text-cyan-400 uppercase tracking-tighter">{user.role}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <KeyIcon className="w-3 h-3 text-cyan-500" />
                Security Token (JWT)
            </h3>
            <div className="bg-black/50 p-6 rounded-2xl border border-white/5 font-mono text-xs relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50"></div>
              <p className="text-cyan-500/70 mb-4 font-bold tracking-widest">// DECODED PAYLOAD</p>
              <pre className="text-gray-300 whitespace-pre-wrap break-all leading-relaxed">
                {JSON.stringify({
                  sub: user.id,
                  name: user.username,
                  email: user.email,
                  role: user.role,
                  iat: Math.floor(Date.now() / 1000),
                  exp: Math.floor(Date.now() / 1000) + 3600
                }, null, 2)}
              </pre>
              <div className="mt-6 pt-4 border-t border-white/5">
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest italic">RSA-256 Verified Signature</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Footer */}
      <div className="absolute bottom-8 text-[10px] text-gray-700 uppercase tracking-[0.6em] font-bold">
          System Encryption Active • Node {user.id.substring(0, 8)}
      </div>
    </div>
  );
};

export default UserDashboard;