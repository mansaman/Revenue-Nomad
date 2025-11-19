
import { Lead, LeadFormData, WebhookResponse } from '../types';
import { generateMockToken } from './authService';

const LEADS_STORAGE_KEY = 'revenue_nomad_leads';

export const submitLead = async (data: LeadFormData): Promise<WebhookResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate validation logic
  if (!data.email.includes('@')) {
    throw new Error("Invalid email address");
  }

  // --- PERSISTENCE LOGIC FOR DEMO ---
  const newLead: Lead = {
    ...data,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  const existingLeads = getLeads();
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify([newLead, ...existingLeads]));
  // ----------------------------------

  // Simulate webhook success and token return
  const token = generateMockToken(data.email);
  
  return {
    success: true,
    message: "Lead captured successfully",
    token,
  };
};

export const getLeads = (): Lead[] => {
  try {
    const stored = localStorage.getItem(LEADS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
