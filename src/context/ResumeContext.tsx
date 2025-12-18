import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ResumeData, TemplateType, SectionVisibility } from '../types/resume';
import { loadResumeData, saveResumeData, clearResumeData } from '../utils/storage';

interface ResumeContextType {
  resumeData: ResumeData;
  updateResumeData: (data: Partial<ResumeData>) => void;
  selectedTemplate: TemplateType;
  setSelectedTemplate: (template: TemplateType) => void;
  clearAllData: () => void;
  toggleSectionVisibility: (section: keyof SectionVisibility) => void;
}

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
  },
  summary: '',
  workExperience: [],
  education: [],
  skills: [],
  personalDetails: {
    fatherName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    languagesKnown: '',
    nationality: '',
  },
  sectionVisibility: {
    summary: true,
    skills: true,
    workExperience: true,
    education: true,
    personalDetails: true,
  },
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with data from localStorage or default
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const storedData = loadResumeData();
    return storedData || defaultResumeData;
  });
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');

  // Auto-save to localStorage whenever resumeData changes
  useEffect(() => {
    saveResumeData(resumeData);
  }, [resumeData]);

  const updateResumeData = (data: Partial<ResumeData>) => {
    setResumeData((prev) => ({ ...prev, ...data }));
  };

  const toggleSectionVisibility = (section: keyof SectionVisibility) => {
    setResumeData((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: !prev.sectionVisibility[section],
      },
    }));
  };

  const clearAllData = () => {
    setResumeData(defaultResumeData);
    clearResumeData();
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updateResumeData,
        selectedTemplate,
        setSelectedTemplate,
        clearAllData,
        toggleSectionVisibility,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within ResumeProvider');
  }
  return context;
};
