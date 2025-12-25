export enum ProtocolType {
  OIDC = 'OIDC',
  OAUTH2 = 'OAUTH2',
  SAML2 = 'SAML2',
  CAS = 'CAS'
}

export interface ProviderConfig {
  id: string;
  name: string;
  type: ProtocolType;
  logo: string; // URL or placeholder
  isEnabled: boolean;
  description?: string;
  config: Record<string, string>;
  createdAt: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  token: string; // JWT
}

export const MOCK_LOGOS: Record<string, string> = {
  Google: 'https://picsum.photos/id/1/200/200',
  GitHub: 'https://picsum.photos/id/2/200/200',
  Okta: 'https://picsum.photos/id/3/200/200',
  Generic: 'https://picsum.photos/id/4/200/200'
};
