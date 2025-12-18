import type { ResumeData } from '../types/resume';

const STORAGE_KEY = 'resume_builder_data';

export const saveResumeData = (data: ResumeData): void => {
  try {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, jsonData);
  } catch (error) {
    console.error('Failed to save resume data:', error);
  }
};

export const loadResumeData = (): ResumeData | null => {
  try {
    const jsonData = localStorage.getItem(STORAGE_KEY);
    if (!jsonData) return null;
    const data = JSON.parse(jsonData) as ResumeData;

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

export const clearResumeData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear resume data:', error);
  }
};

export const hasStoredData = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};
