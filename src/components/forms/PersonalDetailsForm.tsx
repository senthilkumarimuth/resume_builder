import { Eye, EyeOff } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import type { PersonalDetails } from '../../types/resume';

const PersonalDetailsForm = () => {
  const { resumeData, updateResumeData, toggleSectionVisibility } = useResume();

  const handleChange = (field: keyof PersonalDetails, value: string) => {
    updateResumeData({
      personalDetails: {
        ...resumeData.personalDetails,
        [field]: value,
      },
    });
  };

  const isVisible = resumeData.sectionVisibility.personalDetails;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Personal Details</h3>
          <p className="text-sm text-gray-600">Optional information (commonly used in some regions)</p>
        </div>
        <button
          onClick={() => toggleSectionVisibility('personalDetails')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
            isVisible
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          title={isVisible ? 'Hide from resume' : 'Show in resume'}
        >
          {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
          <span className="text-sm font-medium">{isVisible ? 'Visible' : 'Hidden'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Father's Name
          </label>
          <input
            type="text"
            value={resumeData.personalDetails.fatherName || ''}
            onChange={(e) => handleChange('fatherName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Father's full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={resumeData.personalDetails.dateOfBirth || ''}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={resumeData.personalDetails.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marital Status
          </label>
          <select
            value={resumeData.personalDetails.maritalStatus || ''}
            onChange={(e) => handleChange('maritalStatus', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Languages Known
          </label>
          <input
            type="text"
            value={resumeData.personalDetails.languagesKnown || ''}
            onChange={(e) => handleChange('languagesKnown', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="English, Spanish, French"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nationality
          </label>
          <input
            type="text"
            value={resumeData.personalDetails.nationality || ''}
            onChange={(e) => handleChange('nationality', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="American, Indian, etc."
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
