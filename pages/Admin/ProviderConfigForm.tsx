import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { APP_CONFIG } from '../../config';
import { 
  getProviderById as storageGetProviderById, 
  saveProvider as storageSaveProvider, 
  deleteProvider as storageDeleteProvider 
} from '../../services/storageService';
import { 
  getProviderById as apiGetProviderById,
  createProvider as apiCreateProvider,
  updateProvider as apiUpdateProvider,
  deleteProvider as apiDeleteProvider
} from '../../services/apiService';
import { ProviderConfig, ProtocolType, MOCK_LOGOS } from '../../types/index';
import { useNotification } from '../../contexts/NotificationContext';
import { Card, Button, Input, Select, ConfirmationModal } from '../../components/UI';
import { CheckCircleIcon, TrashIcon, ShieldIcon } from '../../components/Icons';

const ProviderConfigForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useNotification();
  const isEditing = !!id;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProviderConfig>({
    id: '', // Will be set by backend or storage service
    name: '',
    type: ProtocolType.OIDC,
    logo: MOCK_LOGOS.Generic,
    isEnabled: true,
    description: '',
    config: {},
    createdAt: 0
  });

  useEffect(() => {
    const fetchProvider = async (providerId: string) => {
      let existing: ProviderConfig | null = null;
      if (APP_CONFIG.API_MODE) {
        existing = await apiGetProviderById(providerId);
      } else {
        existing = storageGetProviderById(providerId);
      }
      
      if (existing) {
        setFormData(existing);
      } else {
        addToast('error', 'Not Found', 'Provider could not be found.');
        navigate('/admin/providers');
      }
    };

    if (isEditing && id) {
      fetchProvider(id);
    }
  }, [id, isEditing, navigate, addToast]);

  const handleBasicChange = (field: keyof ProviderConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfigChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (APP_CONFIG.API_MODE) {
        if (isEditing && id) {
          await apiUpdateProvider(id, formData);
        } else {
          // Omit id and createdAt for creation
          const { id, createdAt, ...creationData } = formData;
          await apiCreateProvider(creationData);
        }
      } else {
        storageSaveProvider(formData);
      }
      addToast('success', 'Success', `Provider "${formData.name}" has been saved.`);
      navigate('/admin/providers');
    } catch (error) {
      console.error("Failed to save provider:", error);
      addToast('error', 'Save Error', 'Could not save provider configuration.');
    }
  };

  const onDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!id) return;
    try {
      if (APP_CONFIG.API_MODE) {
        await apiDeleteProvider(id);
      } else {
        storageDeleteProvider(id);
      }
      addToast('info', 'Deleted', `Provider "${formData.name}" has been deleted.`);
      setDeleteModalOpen(false);
      navigate('/admin/providers');
    } catch (error) {
      console.error("Failed to delete provider:", error);
      addToast('error', 'Delete Error', 'Could not delete provider.');
    }
  };

  const renderConfigFields = () => {
    switch (formData.type) {
      case ProtocolType.OIDC:
        return (
          <>
            <Input 
              label="Client ID" 
              value={formData.config.clientId || ''} 
              onChange={(e) => handleConfigChange('clientId', e.target.value)} 
              required
            />
            <Input 
              label="Client Secret" 
              type="password"
              value={formData.config.clientSecret || ''} 
              onChange={(e) => handleConfigChange('clientSecret', e.target.value)} 
              required
            />
            <Input 
              label="Issuer URL (Well-known)" 
              value={formData.config.issuer || ''} 
              onChange={(e) => handleConfigChange('issuer', e.target.value)} 
              placeholder="https://accounts.google.com"
              required
            />
            <Input 
              label="Authorization Endpoint" 
              value={formData.config.authorizationUrl || ''} 
              onChange={(e) => handleConfigChange('authorizationUrl', e.target.value)} 
              placeholder="https://accounts.google.com/o/oauth2/v2/auth"
              required
            />
            <Input 
              label="Token Endpoint" 
              value={formData.config.tokenUrl || ''} 
              onChange={(e) => handleConfigChange('tokenUrl', e.target.value)} 
              placeholder="https://oauth2.googleapis.com/token"
              required
            />
            <Input 
              label="User Info Endpoint" 
              value={formData.config.userInfoUrl || ''} 
              onChange={(e) => handleConfigChange('userInfoUrl', e.target.value)} 
              placeholder="https://openidconnect.googleapis.com/v1/userinfo"
            />
            <Input 
              label="Scopes" 
              value={formData.config.scopes || ''} 
              onChange={(e) => handleConfigChange('scopes', e.target.value)} 
              placeholder="openid profile email"
            />
          </>
        );
      case ProtocolType.OAUTH2:
        return (
          <>
            <Input 
              label="Client ID" 
              value={formData.config.clientId || ''} 
              onChange={(e) => handleConfigChange('clientId', e.target.value)} 
              required
            />
            <Input 
              label="Client Secret" 
              type="password"
              value={formData.config.clientSecret || ''} 
              onChange={(e) => handleConfigChange('clientSecret', e.target.value)} 
              required
            />
            <Input 
              label="Authorization URL" 
              value={formData.config.authUrl || ''} 
              onChange={(e) => handleConfigChange('authUrl', e.target.value)} 
              required
            />
            <Input 
              label="Token URL" 
              value={formData.config.tokenUrl || ''} 
              onChange={(e) => handleConfigChange('tokenUrl', e.target.value)} 
              required
            />
            <Input 
              label="User Info URL" 
              value={formData.config.userInfoUrl || ''} 
              onChange={(e) => handleConfigChange('userInfoUrl', e.target.value)} 
            />
          </>
        );
      case ProtocolType.SAML2:
        return (
          <>
            <Input 
              label="IdP Entity ID (Issuer URL)"
              value={formData.config.issuer || ''} 
              onChange={(e) => handleConfigChange('issuer', e.target.value)} 
              placeholder="http://www.okta.com/exk..."
              required
            />
            <Input 
              label="IdP SSO Endpoint (IdP Sign-in URL)"
              value={formData.config.entryPoint || ''} 
              onChange={(e) => handleConfigChange('entryPoint', e.target.value)} 
              placeholder="https://idp.example.com/sso/saml"
              required
            />
            <div className="mb-4">
              <label className="block text-[10px] font-bold text-cyan-500/70 uppercase tracking-widest mb-2 ml-1">X.509 Certificate</label>
              <textarea
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-gray-600 transition-all hover:bg-black/60 h-32 font-mono text-xs"
                value={formData.config.cert || ''}
                onChange={(e) => handleConfigChange('cert', e.target.value)}
                placeholder="-----BEGIN CERTIFICATE-----..."
              ></textarea>
            </div>
          </>
        );
      case ProtocolType.CAS:
        return (
          <>
            <Input 
              label="CAS Server URL" 
              value={formData.config.serverUrl || ''} 
              onChange={(e) => handleConfigChange('serverUrl', e.target.value)} 
              placeholder="https://cas.example.org"
              required
            />
            <Input 
              label="Service URL (Callback)" 
              value={formData.config.serviceUrl || ''} 
              onChange={(e) => handleConfigChange('serviceUrl', e.target.value)} 
              placeholder="https://myapp.com/login/cas"
              required
            />
             <Input 
              label="Protocol Version" 
              value={formData.config.version || '3.0'} 
              onChange={(e) => handleConfigChange('version', e.target.value)} 
              placeholder="3.0"
            />
          </>
        );
      default:
        return <p>Select a protocol type.</p>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto relative pb-20">
      <div className="mb-10 flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-extrabold text-white tracking-tight">{isEditing ? 'Edit Provider' : 'New Provider'}</h2>
           <p className="text-gray-400 mt-1">Configure connection details for SSO.</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/providers')}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-8">
            <h3 className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-4 text-center">Base Parameters</h3>
            <Input 
              label="Provider Name"
              value={formData.name} 
              onChange={(e) => handleBasicChange('name', e.target.value)} 
              required
              placeholder="e.g. Corporate Okta"
            />

            <div className="mb-6">
              <label className="block text-[10px] font-bold text-cyan-500/70 uppercase tracking-widest mb-2 ml-1">Description</label>
              <textarea
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-gray-600 transition-all hover:bg-black/60 h-32"
                value={formData.description || ''}
                onChange={(e) => handleBasicChange('description', e.target.value)}
                placeholder="Enter a brief description for this provider..."
              />
            </div>
            
            <Select 
              label="Protocol"
              value={formData.type}
              onChange={(e) => handleBasicChange('type', e.target.value)}
              options={[
                { value: ProtocolType.OIDC, label: 'OpenID Connect (OIDC)' },
                { value: ProtocolType.OAUTH2, label: 'OAuth 2.0' },
                { value: ProtocolType.SAML2, label: 'SAML 2.0' },
                { value: ProtocolType.CAS, label: 'CAS' }
              ]}
              required
            />

            <div className="mb-6">
              <label className="block text-[10px] font-bold text-cyan-500/70 uppercase tracking-widest mb-2 ml-1">State</label>
              <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
                 <button
                    type="button"
                    onClick={() => handleBasicChange('isEnabled', !formData.isEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.isEnabled ? 'bg-cyan-600' : 'bg-gray-700'}`}
                 >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${formData.isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                 </button>
                 <span className={`text-xs font-bold uppercase tracking-wider ${formData.isEnabled ? 'text-cyan-400' : 'text-gray-500'}`}>{formData.isEnabled ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            
            <Input 
              label="Logo URL" 
              value={formData.logo} 
              onChange={(e) => handleBasicChange('logo', e.target.value)} 
              placeholder="https://..."
            />
            
            <div className="mb-2">
                 <label className="block text-[10px] font-bold text-cyan-500/70 uppercase tracking-widest mb-2 ml-1 text-center">Preview</label>
                 <div className="border border-white/10 rounded-2xl p-6 flex justify-center bg-black/40 shadow-inner">
                     <img src={formData.logo} alt="Preview" className="h-16 w-16 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" onError={(e) => e.currentTarget.src = MOCK_LOGOS.Generic}/>
                 </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Protocol Config */}
        <div className="lg:col-span-2">
          <Card className="p-8 h-full flex flex-col group transition-all duration-500">
            <h3 className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-4 flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5" />
                {formData.type} Configuration
            </h3>
            
            <div className="space-y-6 flex-1">
               <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-5 mb-6">
                  <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ShieldIcon className="w-3 h-3" />
                    Instructions
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">Enter the {formData.type} credentials provided by your identity provider (e.g., Auth0, Keycloak, Google).</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {renderConfigFields()}
               </div>
            </div>

             <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                {isEditing ? (
                  <Button type="button" variant="danger" onClick={onDeleteClick} className="px-8 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                ) : (
                  <div></div> /* Spacer */
                )}
                
                <Button type="submit" className="px-10 py-4 text-base shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  Save Configuration
                </Button>
             </div>
          </Card>
        </div>
      </form>

      <ConfirmationModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Provider"
        message={`Are you sure you want to delete "${formData.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ProviderConfigForm;