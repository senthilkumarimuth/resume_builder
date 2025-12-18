export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  projects: string[];
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface PersonalDetails {
  fatherName?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  languagesKnown?: string;
  nationality?: string;
}

export interface SectionVisibility {
  summary: boolean;
  skills: boolean;
  workExperience: boolean;
  education: boolean;
  personalDetails: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  personalDetails: PersonalDetails;
  sectionVisibility: SectionVisibility;
}

export type TemplateType = 'classic' | 'modern' | 'minimal' | 'creative';
