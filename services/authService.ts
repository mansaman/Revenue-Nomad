
import { TokenPayload } from '../types';

const STORAGE_KEY = 'secure_magnet_token';
const ADMIN_SESSION_KEY = 'revenue_nomad_admin_session';
const ADMIN_USERS_KEY = 'revenue_nomad_admin_users';

// --- USER TOKEN LOGIC ---

export const generateMockToken = (email: string): string => {
  const payload: TokenPayload = {
    email,
    issuedAt: Date.now(),
    exp: Date.now() + 30 * 60 * 1000, // 30 minutes expiration
  };
  return btoa(JSON.stringify(payload));
};

export const saveToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEY);
};

export const clearToken = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const verifyToken = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decodedString = atob(token);
    const payload: TokenPayload = JSON.parse(decodedString);
    
    if (Date.now() > payload.exp) {
      clearToken();
      return false;
    }
    return true;
  } catch (e) {
    clearToken();
    return false;
  }
};

export const getTokenPayload = (): TokenPayload | null => {
  const token = getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

// --- ADMIN AUTH LOGIC ---

interface AdminUser {
  username: string;
  password: string; // In production, this should be hashed
}

const getAdmins = (): AdminUser[] => {
  const stored = localStorage.getItem(ADMIN_USERS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Default admin
  const defaultAdmin = { username: 'admin', password: 'password' };
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify([defaultAdmin]));
  return [defaultAdmin];
};

export const loginAdmin = (username: string, password: string): boolean => {
  const admins = getAdmins();
  const validUser = admins.find(u => u.username === username && u.password === password);
  
  if (validUser) {
    localStorage.setItem(ADMIN_SESSION_KEY, validUser.username);
    return true;
  }
  return false;
};

export const logoutAdmin = (): void => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const verifyAdmin = (): boolean => {
  return !!localStorage.getItem(ADMIN_SESSION_KEY);
};

export const getCurrentAdminUsername = (): string | null => {
  return localStorage.getItem(ADMIN_SESSION_KEY);
};

export const createAdmin = (username: string, password: string): boolean => {
  const admins = getAdmins();
  if (admins.find(u => u.username === username)) {
    return false; // User exists
  }
  const newAdmins = [...admins, { username, password }];
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(newAdmins));
  return true;
};

export const changePassword = (password: string): boolean => {
  const currentUser = getCurrentAdminUsername();
  if (!currentUser) return false;

  const admins = getAdmins();
  const updatedAdmins = admins.map(u => {
    if (u.username === currentUser) {
      return { ...u, password };
    }
    return u;
  });
  
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updatedAdmins));
  return true;
};

export const getAllAdminUsernames = (): string[] => {
  return getAdmins().map(u => u.username);
};
