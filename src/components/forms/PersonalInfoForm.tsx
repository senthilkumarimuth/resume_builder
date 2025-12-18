import { useResume } from '../../context/ResumeContext';
import type { PersonalInfo } from '../../types/resume';

const PersonalInfoForm = () => {
  const { resumeData, updateResumeData } = useResume();

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    updateResumeData({
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={resumeData.personalInfo.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={resumeData.personalInfo.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="john.doe@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={resumeData.personalInfo.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={resumeData.personalInfo.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="City, State"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          LinkedIn
        </label>
        <input
          type="url"
          value={resumeData.personalInfo.linkedin || ''}
          onChange={(e) => handleChange('linkedin', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://linkedin.com/in/johndoe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          GitHub
        </label>
        <input
          type="url"
          value={resumeData.personalInfo.github || ''}
          onChange={(e) => handleChange('github', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://github.com/johndoe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website/Portfolio
        </label>
        <input
          type="url"
          value={resumeData.personalInfo.website || ''}
          onChange={(e) => handleChange('website', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://johndoe.com"
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
