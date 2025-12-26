import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../../config';
import { getProviders as getProvidersFromStorage } from '../../services/storageService';
import { getDashboardStats } from '../../services/apiService';
import { Card, Button } from '../../components/UI';
import { ShieldIcon, CheckCircleIcon, PlusIcon, BarChartIcon, ActivityIcon, LockIcon } from '../../components/Icons';

interface DashboardStats {
  totalProviders: number;
  activeProviders: number;
  protocolStats: Record<string, number>;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProviders: 0,
    activeProviders: 0,
    protocolStats: {},
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (APP_CONFIG.API_MODE) {
          const apiStats = await getDashboardStats();
          if (apiStats) {
            setStats(apiStats);
          }
        } else {
          // Calculate stats manually in mock mode
          const providers = getProvidersFromStorage() || [];
          const total = providers.length;
          const active = providers.filter(p => p.isEnabled).length;
          const protocolCounts = providers.reduce((acc, curr) => {
            acc[curr.type] = (acc[curr.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          setStats({
            totalProviders: total,
            activeProviders: active,
            protocolStats: protocolCounts
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h2>
          <p className="text-gray-400 mt-1">Overview of your Single Sign-On ecosystem.</p>
        </div>
        <Button onClick={() => navigate('/admin/provider/new')}>
          <PlusIcon className="w-4 h-4" /> Quick Add
        </Button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 flex items-center gap-6 group hover:border-cyan-500/30 transition-all duration-500">
          <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.1)]">
             <ShieldIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Providers</p>
            <h3 className="text-4xl font-black text-white">{stats.totalProviders}</h3>
          </div>
        </Card>

        <Card className="p-8 flex items-center gap-6 group hover:border-green-500/30 transition-all duration-500">
          <div className="p-4 rounded-2xl bg-green-500/10 text-green-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.1)]">
             <CheckCircleIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Active Connections</p>
            <h3 className="text-4xl font-black text-white">{stats.activeProviders}</h3>
          </div>
        </Card>

        <Card className="p-8 flex items-center gap-6 group hover:border-purple-500/30 transition-all duration-500">
          <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.1)]">
             <ActivityIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Health Status</p>
            <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                </span>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Active</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Protocol Distribution */}
        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <BarChartIcon className="w-5 h-5 text-cyan-400" />
              Protocol Distribution
            </h3>
          </div>
          <div className="space-y-6">
            {Object.keys(stats.protocolStats).length === 0 ? (
                <div className="py-10 text-center border border-dashed border-white/5 rounded-2xl bg-white/5">
                  <p className="text-gray-500 italic text-sm">No protocols configured yet.</p>
                </div>
            ) : (
                Object.entries(stats.protocolStats).map(([type, count]) => (
                <div key={type} className="group">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-bold text-gray-400 uppercase tracking-wider group-hover:text-cyan-400 transition-colors">{type}</span>
                      <span className="text-gray-500 font-mono">{count} providers</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden p-[1px] border border-white/5">
                    <div 
                        className="bg-gradient-to-r from-cyan-600 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                        style={{ width: `${(stats.totalProviders > 0 ? (Number(count) / stats.totalProviders) * 100 : 0)}%` }}
                    ></div>
                    </div>
                </div>
                ))
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-8 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                <button 
                    onClick={() => navigate('/admin/providers')}
                    className="flex flex-col items-center justify-center p-6 border border-white/5 rounded-2xl hover:border-cyan-500/30 hover:bg-white/5 transition-all group relative overflow-hidden"
                >
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <LockIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span className="font-bold text-white text-sm">Manage Providers</span>
                    <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">View list & edit</span>
                </button>
                
                <button 
                    onClick={() => navigate('/admin/provider/new')}
                    className="flex flex-col items-center justify-center p-6 border border-white/5 rounded-2xl hover:border-green-500/30 hover:bg-white/5 transition-all group relative overflow-hidden"
                >
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <PlusIcon className="w-6 h-6 text-green-400" />
                    </div>
                    <span className="font-bold text-white text-sm">Add New Provider</span>
                    <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">OIDC, SAML, CAS</span>
                </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.4em]">
                    Encrypted Protocol v1.0.2 • Verified Session
                </p>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
