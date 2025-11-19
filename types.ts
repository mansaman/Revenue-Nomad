
export enum ViewState {
  LANDING = 'LANDING',
  DEMO_FORM = 'DEMO_FORM',
  PROTECTED = 'PROTECTED',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
}

export interface LeadFormData {
  fullName: string;
  email: string;
  companyName: string;
  revenueRange: string;
  phone: string;
  message: string;
}

export interface Lead extends LeadFormData {
  id: string;
  timestamp: number;
}

export interface TokenPayload {
  email: string;
  exp: number; // Expiration timestamp
  issuedAt: number;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'csv' | 'excel' | 'other';
  size: string;
  uploadDate: number;
  dataUrl?: string; // Base64 string for the file content
}

export const REVENUE_RANGES = [
  "Pre-revenue",
  "$0 - $10k",
  "$10k - $100k",
  "$100k - $1M",
  "$1M - $10M",
  "$10M+",
];
