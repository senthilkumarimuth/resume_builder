import type { ResumeData } from './resume';

export interface ElectronAPI {
  saveResume: (data: ResumeData) => Promise<{ success: boolean; error?: string }>;
  loadResume: () => Promise<{ success: boolean; data?: ResumeData; error?: string }>;
  clearResume: () => Promise<{ success: boolean; error?: string }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
