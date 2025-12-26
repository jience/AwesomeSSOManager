import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../../config';
import { getProviders as storageGetProviders, deleteProvider as storageDeleteProvider } from '../../services/storageService';
import { getProviders as apiGetProviders, deleteProvider as apiDeleteProvider } from '../../services/apiService';
import { ProviderConfig } from '../../types/index';
import { Card, Button, Badge, ConfirmationModal } from '../../components/UI';
import { PlusIcon, EditIcon, TrashIcon, ShieldIcon } from '../../components/Icons';

const ProviderList: React.FC = () => {
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProviders = async () => {
      try {
        if (APP_CONFIG.API_MODE) {
          const data = await apiGetProviders();
          setProviders(Array.isArray(data) ? data : []);
        } else {
          setProviders(storageGetProviders() || []);
        }
      } catch (error) {
        console.error("Failed to load providers:", error);
        setProviders([]);
      }
    };
    
    loadProviders();
  }, []);

  const onDeleteClick = (e: React.MouseEvent | undefined, id: string) => {
    // Prevent event bubbling
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedProviderId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProviderId) {
      if (APP_CONFIG.API_MODE) {
        await apiDeleteProvider(selectedProviderId);
      } else {
        storageDeleteProvider(selectedProviderId);
      }
      
      // Optimistic UI Update: Filter out the deleted item from the state
      setProviders(currentProviders => currentProviders.filter(p => p.id !== selectedProviderId));
      
      // Reset state
      setDeleteModalOpen(false);
      setSelectedProviderId(null);
    }
  };

  return (
    <div className="space-y-10 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Identity Providers</h2>
          <p className="text-gray-400 mt-1">Manage third-party SSO integrations (CAS, OIDC, OAuth2, SAML).</p>
        </div>
        <Button onClick={() => navigate('/admin/provider/new')}>
          <PlusIcon className="w-4 h-4" /> Add Provider
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {providers.map(provider => (
          <Card key={provider.id} className="p-6 group hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-500">
                  <img src={provider.logo} alt={provider.name} className="max-w-full max-h-full rounded-sm" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')} />
                </div>
                <div>
                  <h3 className="font-bold text-white tracking-wide">{provider.name}</h3>
                  <div className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-1 opacity-70 group-hover:opacity-100 transition-opacity">{provider.type}</div>
                </div>
              </div>
              <Badge active={provider.isEnabled} />
            </div>
            
            <p className="text-sm text-gray-400 mb-8 line-clamp-2 h-10 font-light leading-relaxed">
              {provider.description || 'No description provided.'}
            </p>

            <div className="flex gap-3 pt-6 border-t border-white/5">
              <Button variant="secondary" className="flex-1 text-xs h-11" onClick={() => navigate(`/admin/provider/${provider.id}`)}>
                <EditIcon className="w-4 h-4" /> Configure
              </Button>
              <Button 
                variant="danger" 
                className="h-11 w-11 p-0 shrink-0" 
                onClick={(e) => onDeleteClick(e, provider.id)}
                title="Delete Provider"
              >
                <TrashIcon className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        ))}
        
        {providers.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border-2 border-dashed border-white/5">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldIcon className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-500 font-medium">No providers configured yet.</p>
                <Button variant="ghost" className="mt-4 text-cyan-400 hover:text-cyan-300" onClick={() => navigate('/admin/provider/new')}>
                    Create your first provider
                </Button>
            </div>
        )}
      </div>

      <ConfirmationModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Provider"
        message="Are you sure you want to delete this provider? This action cannot be undone and users may lose access."
      />
    </div>
  );
};

export default ProviderList;