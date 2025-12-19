import type { ResumeData, ProfileMetadata, Profile, TemplateType } from '../types/resume';

const STORAGE_KEY = 'resume_builder_data';
const PROFILES_LIST_KEY = 'resume_builder_profiles_list';
const PROFILE_KEY_PREFIX = 'resume_builder_profile_';

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

// Profile management functions
export const getAllProfiles = async (): Promise<ProfileMetadata[]> => {
  try {
    if (isElectron()) {
      const result = await (window as any).electronAPI.getAllProfiles();
      if (result.success) {
        return result.profiles;
      }
      return [];
    } else {
      // Fallback to localStorage for web
      const profilesJson = localStorage.getItem(PROFILES_LIST_KEY);
      if (profilesJson) {
        return JSON.parse(profilesJson) as ProfileMetadata[];
      }
      return [];
    }
  } catch (error) {
    console.error('Failed to get all profiles:', error);
    return [];
  }
};

export const getProfile = async (profileId: number): Promise<Profile | null> => {
  try {
    if (isElectron()) {
      const result = await (window as any).electronAPI.getProfile(profileId);
      if (result.success && result.profile) {
        return result.profile;
      }
      return null;
    } else {
      // Fallback to localStorage for web
      const profileJson = localStorage.getItem(`${PROFILE_KEY_PREFIX}${profileId}`);
      if (profileJson) {
        return JSON.parse(profileJson) as Profile;
      }
      return null;
    }
  } catch (error) {
    console.error('Failed to get profile:', error);
    return null;
  }
};

export const saveProfile = async (
  profileId: number,
  name: string,
  data: ResumeData,
  template: TemplateType
): Promise<boolean> => {
  try {
    if (isElectron()) {
      const result = await (window as any).electronAPI.saveProfile(profileId, name, data, template);
      return result.success;
    } else {
      // Fallback to localStorage for web
      const profile: Profile = {
        id: profileId,
        name,
        data,
        template,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(`${PROFILE_KEY_PREFIX}${profileId}`, JSON.stringify(profile));

      // Update profiles list
      const profiles = await getAllProfiles();
      const profileIndex = profiles.findIndex((p) => p.id === profileId);
      if (profileIndex !== -1) {
        profiles[profileIndex] = {
          id: profileId,
          name,
          updated_at: profile.updatedAt,
        };
        localStorage.setItem(PROFILES_LIST_KEY, JSON.stringify(profiles));
      }

      return true;
    }
  } catch (error) {
    console.error('Failed to save profile:', error);
    return false;
  }
};

export const createProfile = async (
  name: string,
  data: ResumeData,
  template: TemplateType
): Promise<number | null> => {
  try {
    if (isElectron()) {
      const result = await (window as any).electronAPI.createProfile(name, data, template);
      if (result.success) {
        return result.profileId;
      }
      return null;
    } else {
      // Fallback to localStorage for web
      const profiles = await getAllProfiles();
      const newId = profiles.length > 0 ? Math.max(...profiles.map((p) => p.id)) + 1 : 1;

      const profile: Profile = {
        id: newId,
        name,
        data,
        template,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(`${PROFILE_KEY_PREFIX}${newId}`, JSON.stringify(profile));

      // Update profiles list
      profiles.push({
        id: newId,
        name,
        updated_at: profile.updatedAt,
      });
      localStorage.setItem(PROFILES_LIST_KEY, JSON.stringify(profiles));

      return newId;
    }
  } catch (error) {
    console.error('Failed to create profile:', error);
    return null;
  }
};

export const deleteProfile = async (profileId: number): Promise<boolean> => {
  try {
    if (isElectron()) {
      const result = await (window as any).electronAPI.deleteProfile(profileId);
      return result.success;
    } else {
      // Fallback to localStorage for web
      localStorage.removeItem(`${PROFILE_KEY_PREFIX}${profileId}`);

      // Update profiles list
      const profiles = await getAllProfiles();
      const updatedProfiles = profiles.filter((p) => p.id !== profileId);
      localStorage.setItem(PROFILES_LIST_KEY, JSON.stringify(updatedProfiles));

      return true;
    }
  } catch (error) {
    console.error('Failed to delete profile:', error);
    return false;
  }
};

export const duplicateProfile = async (profileId: number, newName: string): Promise<number | null> => {
  try {
    if (isElectron()) {
      const result = await (window as any).electronAPI.duplicateProfile(profileId, newName);
      if (result.success) {
        return result.profileId;
      }
      return null;
    } else {
      // Fallback to localStorage for web
      const profile = await getProfile(profileId);
      if (!profile) {
        return null;
      }

      return await createProfile(newName, profile.data, profile.template);
    }
  } catch (error) {
    console.error('Failed to duplicate profile:', error);
    return null;
  }
};
