// src/utils/auth.ts
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  user_id: number;
  exp: number;
  iat: number;
  role?: string;
}

export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    
    // Also set as cookie for middleware
    document.cookie = `access_token=${accessToken}; path=/; max-age=86400`;
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

export const removeTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }
};

export const isTokenValid = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getUserIdFromToken = (): number | null => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.user_id;
  } catch (error) {
    return null;
  }
};

export const getUserRoleFromToken = (): string | null => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role || 'user';
  } catch (error) {
    return null;
  }
};