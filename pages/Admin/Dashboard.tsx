import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProviders } from '../../services/storageService';
import { ProviderConfig } from '../../types/index';
import { Card, Button } from '../../components/UI';
import { ShieldIcon, CheckCircleIcon, PlusIcon, BarChartIcon, ActivityIcon, LockIcon } from '../../components/Icons';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<ProviderConfig[]>([]);

  useEffect(() => {
    setProviders(getProviders());
  }, []);

  const totalProviders = providers.length;
  const activeProviders = providers.filter(p => p.isEnabled).length;
  const inactiveProviders = totalProviders - activeProviders;
  
  // Calculate protocol breakdown
  const protocolStats = providers.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-1">Overview of your Single Sign-On ecosystem.</p>
        </div>
        <Button onClick={() => navigate('/admin/provider/new')}>
          <PlusIcon className="w-4 h-4" /> Quick Add
        </Button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4">
          <div className="p-4 rounded-full bg-blue-50 text-blue-600">
             <ShieldIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Providers</p>
            <h3 className="text-3xl font-bold text-gray-900">{totalProviders}</h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <div className="p-4 rounded-full bg-green-50 text-green-600">
             <CheckCircleIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Connections</p>
            <h3 className="text-3xl font-bold text-gray-900">{activeProviders}</h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <div className="p-4 rounded-full bg-purple-50 text-purple-600">
             <ActivityIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">System Status</p>
            <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <h3 className="text-lg font-bold text-gray-900">Operational</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocol Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BarChartIcon className="w-5 h-5 text-gray-500" />
              Protocol Distribution
            </h3>
          </div>
          <div className="space-y-4">
            {Object.keys(protocolStats).length === 0 ? (
                <p className="text-gray-500 italic text-sm">No protocols configured yet.</p>
            ) : (
                Object.entries(protocolStats).map(([type, count]) => (
                <div key={type} className="group">
                    <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{type}</span>
                    <span className="text-gray-500">{count} providers</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out group-hover:bg-blue-500" 
                        style={{ width: `${(Number(count) / totalProviders) * 100}%` }}
                    ></div>
                    </div>
                </div>
                ))
            )}
          </div>
        </Card>

        {/* Quick Actions / Recent */}
        <Card className="p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                    onClick={() => navigate('/admin/providers')}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-blue-600">
                        <LockIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">Manage Providers</span>
                    <span className="text-xs text-gray-500 mt-1">View list & edit</span>
                </button>
                
                <button 
                    onClick={() => navigate('/admin/provider/new')}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-green-600">
                        <PlusIcon className="w-5 h-5 text-gray-500 group-hover:text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">Add New Provider</span>
                    <span className="text-xs text-gray-500 mt-1">OIDC, SAML, CAS...</span>
                </button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                    System Version v1.0.2 • Last updated today
                </p>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;