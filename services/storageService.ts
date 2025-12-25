import { ProviderConfig, ProtocolType } from '../types';

const STORAGE_KEY = 'sso_providers_config';

const DEFAULT_PROVIDERS: ProviderConfig[] = [
  {
    id: '1',
    name: 'Google Workspace',
    type: ProtocolType.OIDC,
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
    isEnabled: true,
    description: 'Corporate employee login',
    createdAt: Date.now(),
    config: {
      clientId: 'mock-google-client-id',
      clientSecret: 'mock-google-secret',
      issuer: 'https://accounts.google.com',
      scopes: 'openid profile email'
    }
  },
  {
    id: '2',
    name: 'GitHub',
    type: ProtocolType.OAUTH2,
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    isEnabled: true,
    description: 'Developer access',
    createdAt: Date.now(),
    config: {
      clientId: 'mock-github-id',
      clientSecret: 'mock-github-secret',
      authUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      userInfoUrl: 'https://api.github.com/user'
    }
  },
  {
    id: '3',
    name: 'Legacy CAS',
    type: ProtocolType.CAS,
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    isEnabled: false,
    description: 'Old intranet system',
    createdAt: Date.now(),
    config: {
      serverUrl: 'https://cas.example.com',
      serviceUrl: 'https://app.example.com/login/cas'
    }
  }
];

export const getProviders = (): ProviderConfig[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROVIDERS));
    return DEFAULT_PROVIDERS;
  }
  return JSON.parse(stored);
};

export const saveProvider = (provider: ProviderConfig): void => {
  const providers = getProviders();
  const existingIndex = providers.findIndex(p => p.id === provider.id);
  
  if (existingIndex >= 0) {
    providers[existingIndex] = provider;
  } else {
    providers.push(provider);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
};

export const deleteProvider = (id: string): void => {
  const providers = getProviders().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
};

export const getProviderById = (id: string): ProviderConfig | undefined => {
  return getProviders().find(p => p.id === id);
};
