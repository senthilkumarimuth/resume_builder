import type { ResumeData } from '../types/resume';

const STORAGE_KEY = 'resume_builder_data';

// Check if running in Electron
const isElectron = () => {
  return !!(window as any).electronAPI;
};

export const saveResumeData = async (data: ResumeData): Promise<void> => {
  try {
    if (isElectron()) {
      // Use Electron SQLite database
      await (window as any).electronAPI.saveResume(data);
    } else {
      // Fallback to localStorage for web
      const jsonData = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, jsonData);
    }
  } catch (error) {
    console.error('Failed to save resume data:', error);
  }
};

export const loadResumeData = async (): Promise<ResumeData | null> => {
  try {
    let data: ResumeData | null = null;

    if (isElectron()) {
      // Use Electron SQLite database
      const result = await (window as any).electronAPI.loadResume();
      if (result.success && result.data) {
        data = result.data;
      }
    } else {
      // Fallback to localStorage for web
      const jsonData = localStorage.getItem(STORAGE_KEY);
      if (jsonData) {
        data = JSON.parse(jsonData) as ResumeData;
      }
    }

    if (!data) return null;

    // Migrate old data that doesn't have personalDetails
    if (!data.personalDetails) {
      data.personalDetails = {
        fatherName: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        languagesKnown: '',
        nationality: '',
      };
    }

    // Migrate old data that doesn't have sectionVisibility
    if (!data.sectionVisibility) {
      data.sectionVisibility = {
        summary: true,
        skills: true,
        workExperience: true,
        education: true,
        personalDetails: true,
      };
    }

    return data;
  } catch (error) {
    console.error('Failed to load resume data:', error);
    return null;
  }
};

export const clearResumeData = async (): Promise<void> => {
  try {
    if (isElectron()) {
      // Use Electron SQLite database
      await (window as any).electronAPI.clearResume();
    } else {
      // Fallback to localStorage for web
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to clear resume data:', error);
  }
};

export const hasStoredData = async (): Promise<boolean> => {
  try {
    if (isElectron()) {
      const result = await (window as any).electronAPI.loadResume();
      return result.success && result.data !== null;
    } else {
      return localStorage.getItem(STORAGE_KEY) !== null;
    }
  } catch (error) {
    return false;
  }
};
