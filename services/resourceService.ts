
import { Resource } from '../types';

const RESOURCES_KEY = 'revenue_nomad_resources';

// Seed data to show initially (Simulated files)
const DEFAULT_RESOURCES: Resource[] = [
  {
    id: 'default-1',
    name: '2024_Industry_Analysis.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadDate: Date.now(),
    dataUrl: '#' // In a real app, this would be a URL
  },
  {
    id: 'default-2',
    name: 'Raw_Lead_Data.csv',
    type: 'csv',
    size: '856 KB',
    uploadDate: Date.now(),
    dataUrl: '#'
  }
];

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'res-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

export const getResources = (): Resource[] => {
  const stored = localStorage.getItem(RESOURCES_KEY);
  if (!stored) {
    localStorage.setItem(RESOURCES_KEY, JSON.stringify(DEFAULT_RESOURCES));
    return DEFAULT_RESOURCES;
  }
  return JSON.parse(stored);
};

export const addResource = (file: File, dataUrl: string): void => {
  const resources = getResources();
  
  const typeMap: Record<string, Resource['type']> = {
    'application/pdf': 'pdf',
    'text/csv': 'csv',
    'application/vnd.ms-excel': 'excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel'
  };

  const newResource: Resource = {
    id: generateId(),
    name: file.name,
    type: typeMap[file.type] || 'other',
    size: formatBytes(file.size),
    uploadDate: Date.now(),
    dataUrl: dataUrl
  };

  const updated = [newResource, ...resources];
  
  try {
    localStorage.setItem(RESOURCES_KEY, JSON.stringify(updated));
  } catch (e) {
    throw new Error('Storage quota exceeded');
  }
};

export const deleteResource = (id: string): Resource[] => {
  const resources = getResources();
  const updated = resources.filter(r => r.id !== id);
  localStorage.setItem(RESOURCES_KEY, JSON.stringify(updated));
  return updated;
};

// Helper to format file size
const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
