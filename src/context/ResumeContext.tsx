import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { ResumeData, TemplateType, SectionVisibility, ProfileMetadata } from '../types/resume';
import { clearResumeData, getAllProfiles, getProfile, saveProfile, createProfile as createProfileStorage, deleteProfile as deleteProfileStorage, duplicateProfile as duplicateProfileStorage } from '../utils/storage';

interface ResumeContextType {
  resumeData: ResumeData;
  updateResumeData: (data: Partial<ResumeData>) => void;
  selectedTemplate: TemplateType;
  setSelectedTemplate: (template: TemplateType) => void;
  clearAllData: () => void;
  toggleSectionVisibility: (section: keyof SectionVisibility) => void;
  // Profile management
  currentProfileId: number | null;
  currentProfileName: string;
  profiles: ProfileMetadata[];
  loadProfile: (profileId: number) => Promise<void>;
  createNewProfile: (name: string) => Promise<void>;
  duplicateCurrentProfile: (name: string) => Promise<void>;
  deleteCurrentProfile: () => Promise<void>;
  renameCurrentProfile: (name: string) => Promise<void>;
  isLoadingProfiles: boolean;
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
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [currentProfileId, setCurrentProfileId] = useState<number | null>(null);
  const [currentProfileName, setCurrentProfileName] = useState<string>('');
  const [profiles, setProfiles] = useState<ProfileMetadata[]>([]);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load profiles and initialize
  useEffect(() => {
    const initProfiles = async () => {
      try {
        const allProfiles = await getAllProfiles();
        setProfiles(allProfiles);

        if (allProfiles.length > 0) {
          // Load the most recently updated profile
          const latestProfile = allProfiles[0];
          const profileData = await getProfile(latestProfile.id);

          if (profileData) {
            setCurrentProfileId(profileData.id);
            setCurrentProfileName(profileData.name);
            setResumeData(profileData.data);
            setSelectedTemplate(profileData.template);
          }
        }
      } catch (error) {
        console.error('Failed to load profiles:', error);
      } finally {
        setIsLoading(false);
        setIsLoadingProfiles(false);
      }
    };
    initProfiles();
  }, []);

  // Auto-save to current profile with debouncing
  useEffect(() => {
    if (!isLoading && currentProfileId !== null) {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for debounced save
      saveTimeoutRef.current = setTimeout(async () => {
        await saveProfile(currentProfileId, currentProfileName, resumeData, selectedTemplate);
      }, 500); // 500ms debounce

      return () => {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
      };
    }
  }, [resumeData, selectedTemplate, currentProfileId, currentProfileName, isLoading]);

  const loadProfile = useCallback(async (profileId: number) => {
    try {
      const profileData = await getProfile(profileId);
      if (profileData) {
        setCurrentProfileId(profileData.id);
        setCurrentProfileName(profileData.name);
        setResumeData(profileData.data);
        setSelectedTemplate(profileData.template);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  }, []);

  const createNewProfile = useCallback(async (name: string) => {
    try {
      const newProfileId = await createProfileStorage(name, defaultResumeData, 'modern');
      if (newProfileId) {
        // Refresh profiles list
        const allProfiles = await getAllProfiles();
        setProfiles(allProfiles);

        // Load the new profile
        await loadProfile(newProfileId);
      }
    } catch (error) {
      console.error('Failed to create profile:', error);
      alert('Failed to create profile. Please try again.');
    }
  }, [loadProfile]);

  const duplicateCurrentProfile = useCallback(async (name: string) => {
    if (currentProfileId === null) return;

    try {
      const newProfileId = await duplicateProfileStorage(currentProfileId, name);
      if (newProfileId) {
        // Refresh profiles list
        const allProfiles = await getAllProfiles();
        setProfiles(allProfiles);

        // Load the new profile
        await loadProfile(newProfileId);
      }
    } catch (error) {
      console.error('Failed to duplicate profile:', error);
      alert('Failed to duplicate profile. Please try again.');
    }
  }, [currentProfileId, loadProfile]);

  const deleteCurrentProfile = useCallback(async () => {
    if (currentProfileId === null) return;

    if (profiles.length <= 1) {
      alert('Cannot delete the last profile.');
      return;
    }

    try {
      const success = await deleteProfileStorage(currentProfileId);
      if (success) {
        // Refresh profiles list
        const allProfiles = await getAllProfiles();
        setProfiles(allProfiles);

        // Load the first available profile
        if (allProfiles.length > 0) {
          await loadProfile(allProfiles[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to delete profile:', error);
      alert('Failed to delete profile. Please try again.');
    }
  }, [currentProfileId, profiles.length, loadProfile]);

  const renameCurrentProfile = useCallback(async (name: string) => {
    if (currentProfileId === null) return;

    try {
      setCurrentProfileName(name);
      await saveProfile(currentProfileId, name, resumeData, selectedTemplate);

      // Refresh profiles list
      const allProfiles = await getAllProfiles();
      setProfiles(allProfiles);
    } catch (error) {
      console.error('Failed to rename profile:', error);
      alert('Failed to rename profile. Please try again.');
    }
  }, [currentProfileId, resumeData, selectedTemplate]);

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

  const clearAllData = async () => {
    setResumeData(defaultResumeData);
    await clearResumeData();
  };

  const handleSetSelectedTemplate = (template: TemplateType) => {
    setSelectedTemplate(template);
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updateResumeData,
        selectedTemplate,
        setSelectedTemplate: handleSetSelectedTemplate,
        clearAllData,
        toggleSectionVisibility,
        currentProfileId,
        currentProfileName,
        profiles,
        loadProfile,
        createNewProfile,
        duplicateCurrentProfile,
        deleteCurrentProfile,
        renameCurrentProfile,
        isLoadingProfiles,
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
