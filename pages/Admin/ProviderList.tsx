import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProviders, deleteProvider } from '../../services/storageService';
import { ProviderConfig } from '../../types';
import { Card, Button, Badge } from '../../components/UI';
import { PlusIcon, EditIcon, TrashIcon } from '../../components/Icons';

const ProviderList: React.FC = () => {
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const navigate = useNavigate();

  const loadProviders = () => {
    setProviders(getProviders());
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleDelete = (e: React.MouseEvent | undefined, id: string) => {
    if (e) {
      e.stopPropagation();
    }
    if (window.confirm('Are you sure you want to delete this provider?')) {
      deleteProvider(id);
      loadProviders();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Identity Providers</h2>
          <p className="text-gray-500 mt-1">Manage third-party SSO integrations (CAS, OIDC, OAuth2, SAML).</p>
        </div>
        <Button onClick={() => navigate('/admin/provider/new')}>
          <PlusIcon className="w-4 h-4" /> Add Provider
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {providers.map(provider => (
          <Card key={provider.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-1">
                  <img src={provider.logo} alt={provider.name} className="max-w-full max-h-full" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">{provider.type}</div>
                </div>
              </div>
              <Badge active={provider.isEnabled} />
            </div>
            
            <p className="text-sm text-gray-600 mb-6 line-clamp-2 h-10">
              {provider.description || 'No description provided.'}
            </p>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button variant="secondary" className="flex-1 text-base h-12" onClick={() => navigate(`/admin/provider/${provider.id}`)}>
                <EditIcon className="w-5 h-5" /> Configure
              </Button>
              <Button 
                variant="ghost" 
                className="text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 h-12 w-12 p-0 flex items-center justify-center rounded-lg transition-colors shrink-0" 
                onClick={(e) => handleDelete(e, provider.id)}
                title="Delete Provider"
              >
                <TrashIcon className="w-8 h-8" />
              </Button>
            </div>
          </Card>
        ))}
        
        {providers.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">No providers configured yet.</p>
                <Button variant="ghost" className="mt-2 text-blue-600" onClick={() => navigate('/admin/provider/new')}>
                    Create your first provider
                </Button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProviderList;