export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthResponse {
  token: string;
  user: User;
  activeTenantId?: string;
}
