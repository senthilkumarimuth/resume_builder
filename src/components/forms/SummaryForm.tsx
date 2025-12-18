import { Eye, EyeOff } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

const SummaryForm = () => {
  const { resumeData, updateResumeData, toggleSectionVisibility } = useResume();

  const handleChange = (value: string) => {
    updateResumeData({ summary: value });
  };

  const isVisible = resumeData.sectionVisibility.summary;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Professional Summary</h3>
        <button
          onClick={() => toggleSectionVisibility('summary')}
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Summary
        </label>
        <textarea
          value={resumeData.summary}
          onChange={(e) => handleChange(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Write a brief professional summary about yourself..."
        />
        <p className="text-sm text-gray-500 mt-1">
          2-3 sentences highlighting your experience and expertise
        </p>
      </div>
    </div>
  );
};

export default SummaryForm;
