export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface SessionUser extends AuthUser {
  emailVerified: boolean;
  isActive: boolean;
}