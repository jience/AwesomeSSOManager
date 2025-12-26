import { APP_CONFIG } from '../config';
import { User, ProviderConfig } from '../types';

const getAuthToken = (): string | null => {
  const storedUser = localStorage.getItem('sso_user');
  if (storedUser) {
    const user: User = JSON.parse(storedUser);
    return user.token;
  }
  return null;
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const getProviders = async (): Promise<ProviderConfig[]> => {
  if (!APP_CONFIG.API_MODE) {
    // This case should be handled by the component, but as a fallback:
    return []; 
  }

  const response = await fetch(`${APP_CONFIG.API_BASE_URL}/providers`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    // In a real app, you'd want more robust error handling
    console.error('Failed to fetch providers:', response.statusText);
    if (response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
    }
    return [];
  }

  return response.json();
};

// Add other API functions (create, update, delete) here as needed.
// For example:
export const deleteProvider = async (id: string): Promise<void> => {
    if (!APP_CONFIG.API_MODE) return;
    
    await fetch(`${APP_CONFIG.API_BASE_URL}/providers/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
}

export const login = async (username: string, password: string): Promise<{user: User, token: string} | null> => {
  if (!APP_CONFIG.API_MODE) return null;

  const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    console.error('Login failed:', response.statusText);
    return null;
  }

  const data = await response.json();
  // The backend returns a `user` object and a `token`.
  // The User type in the frontend includes the token, so we'll combine them.
  const userWithToken: User = {
    ...data.user,
    token: data.token,
  };

  return { user: userWithToken, token: data.token };
};

export const getProviderById = async (id: string): Promise<ProviderConfig | null> => {
  if (!APP_CONFIG.API_MODE) return null;

  const response = await fetch(`${APP_CONFIG.API_BASE_URL}/providers/${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    console.error(`Failed to fetch provider ${id}:`, response.statusText);
    return null;
  }

  return response.json();
};

export const createProvider = async (providerData: Omit<ProviderConfig, 'id' | 'createdAt'>): Promise<ProviderConfig> => {
  const response = await fetch(`${APP_CONFIG.API_BASE_URL}/providers`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(providerData),
  });

  if (!response.ok) {
    throw new Error('Failed to create provider');
  }

  return response.json();
};

export const updateProvider = async (id: string, providerData: ProviderConfig): Promise<ProviderConfig> => {
  const response = await fetch(`${APP_CONFIG.API_BASE_URL}/providers/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(providerData),
  });

  if (!response.ok) {
    throw new Error('Failed to update provider');
  }

  return response.json();
};

export const getDashboardStats = async (): Promise<any> => {
  if (!APP_CONFIG.API_MODE) return null;

  const response = await fetch(`${APP_CONFIG.API_BASE_URL}/dashboard/stats`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    console.error('Failed to fetch dashboard stats:', response.statusText);
    return null;
  }

  return response.json();
};

