import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProviderById, saveProvider, deleteProvider } from '../../services/storageService';
import { ProviderConfig, ProtocolType, MOCK_LOGOS } from '../../types';
import { Card, Button, Input, Select, ConfirmationModal } from '../../components/UI';
import { CheckCircleIcon, TrashIcon } from '../../components/Icons';

const ProviderConfigForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProviderConfig>({
    id: Date.now().toString(),
    name: '',
    type: ProtocolType.OIDC,
    logo: MOCK_LOGOS.Generic,
    isEnabled: true,
    description: '',
    config: {},
    createdAt: Date.now()
  });

  useEffect(() => {
    if (isEditing && id) {
      const existing = getProviderById(id);
      if (existing) {
        setFormData(existing);
      } else {
        navigate('/admin');
      }
    }
  }, [id, isEditing, navigate]);

  const handleBasicChange = (field: keyof ProviderConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfigChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProvider(formData);
    navigate('/admin');
  };

  const onDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteProvider(formData.id);
    setDeleteModalOpen(false);
    navigate('/admin');
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
              label="IdP Entity ID" 
              value={formData.config.entryPoint || ''} 
              onChange={(e) => handleConfigChange('entryPoint', e.target.value)} 
              required
            />
            <Input 
              label="SSO URL (Single Sign On Service)" 
              value={formData.config.ssoUrl || ''} 
              onChange={(e) => handleConfigChange('ssoUrl', e.target.value)} 
              required
            />
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">X.509 Certificate</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 font-mono text-xs bg-gray-50 focus:bg-white text-gray-900"
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
    <div className="max-w-4xl mx-auto relative">
      <div className="mb-6 flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Provider' : 'New Provider'}</h2>
           <p className="text-gray-500">Configure connection details for SSO.</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin')}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">General</h3>
            <Input 
              label="Provider Name" 
              value={formData.name} 
              onChange={(e) => handleBasicChange('name', e.target.value)} 
              required
              placeholder="e.g. Corporate Okta"
            />

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 bg-gray-50 focus:bg-white text-gray-900"
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

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <div className="flex items-center gap-3">
                 <button
                    type="button"
                    onClick={() => handleBasicChange('isEnabled', !formData.isEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${formData.isEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                 >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${formData.isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                 </button>
                 <span className="text-sm text-gray-600">{formData.isEnabled ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            
            <Input 
              label="Logo URL" 
              value={formData.logo} 
              onChange={(e) => handleBasicChange('logo', e.target.value)} 
              placeholder="https://..."
            />
            
            <div className="mb-4">
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Preview</label>
                 <div className="border rounded p-2 flex justify-center bg-gray-50">
                     <img src={formData.logo} alt="Preview" className="h-12 w-12 object-contain" onError={(e) => e.currentTarget.src = MOCK_LOGOS.Generic}/>
                 </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Protocol Config */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                {formData.type} Configuration
            </h3>
            
            <div className="space-y-4 flex-1">
               <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4 text-sm text-blue-800">
                  <p className="font-medium">Instructions</p>
                  <p>Enter the {formData.type} credentials provided by your identity provider (e.g., Auth0, Keycloak, Google).</p>
               </div>
               
               {renderConfigFields()}
            </div>

             <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                {isEditing ? (
                  <Button type="button" variant="danger" onClick={onDeleteClick} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                ) : (
                  <div></div> /* Spacer */
                )}
                
                <Button type="submit">
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