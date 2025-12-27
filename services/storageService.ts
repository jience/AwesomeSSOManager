import { ProviderConfig, ProtocolType } from '../types/index';
import { APP_CONFIG } from '../config';

const { API_MODE, API_BASE_URL, STORAGE_KEY } = APP_CONFIG;

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

// --- Local Storage Implementation (Default for Demo) ---

const getLocalProviders = (): ProviderConfig[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROVIDERS));
    return DEFAULT_PROVIDERS;
  }
  return JSON.parse(stored);
};

const saveLocalProvider = (provider: ProviderConfig): void => {
  const providers = getLocalProviders();
  const existingIndex = providers.findIndex(p => p.id === provider.id);
  
  if (existingIndex >= 0) {
    providers[existingIndex] = provider;
  } else {
    providers.push(provider);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
};

const deleteLocalProvider = (id: string): void => {
  const providers = getLocalProviders().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
};

// --- Hybrid Export ---

export const getProviders = (): ProviderConfig[] => {
  if (API_MODE) {
    console.warn("API_MODE is enabled but synchronous getProviders called. Please refactor UI to use useEffect/async.");
    return [];
  }
  return getLocalProviders();
};

// Async version for future integration
export const fetchProvidersAsync = async (): Promise<ProviderConfig[]> => {
    if (API_MODE) {
        try {
            const res = await fetch(`${API_BASE_URL}/providers`);
            return await res.json();
        } catch (e) {
            console.error("Failed to fetch from backend", e);
            return [];
        }
    }
    return getLocalProviders();
};

export const saveProvider = async (provider: ProviderConfig): Promise<void> => {
  if (API_MODE) {
      try {
        await fetch(`${API_BASE_URL}/providers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(provider)
        });
      } catch(e) {
          console.error("Save failed", e);
      }
      return;
  }
  saveLocalProvider(provider);
};

export const deleteProvider = async (id: string): Promise<void> => {
  if (API_MODE) {
      try {
        await fetch(`${API_BASE_URL}/providers/${id}`, { method: 'DELETE' });
      } catch(e) {
          console.error("Delete failed", e);
      }
      return;
  }
  deleteLocalProvider(id);
};

export const getProviderById = (id: string): ProviderConfig | undefined => {
  return getLocalProviders().find(p => p.id === id);
};

// --- Helper for SSO Login URL ---
export const getSSOLoginUrl = (providerId: string): string => {
    if (API_MODE) {
        return `${API_BASE_URL}/auth/sso/login/${providerId}`;
    }
    return '#'; 
};