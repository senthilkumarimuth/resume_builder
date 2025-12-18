import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import type { WorkExperience } from '../../types/resume';

const WorkExperienceForm = () => {
  const { resumeData, updateResumeData, toggleSectionVisibility } = useResume();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const isVisible = resumeData.sectionVisibility.workExperience;

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      projects: [''],
      description: '',
    };
    updateResumeData({
      workExperience: [...resumeData.workExperience, newExp],
    });
    setExpandedIndex(resumeData.workExperience.length);
  };

  const removeWorkExperience = (id: string) => {
    updateResumeData({
      workExperience: resumeData.workExperience.filter((exp) => exp.id !== id),
    });
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    updateResumeData({
      workExperience: resumeData.workExperience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const addProject = (expId: string) => {
    updateResumeData({
      workExperience: resumeData.workExperience.map((exp) =>
        exp.id === expId ? { ...exp, projects: [...exp.projects, ''] } : exp
      ),
    });
  };

  const removeProject = (expId: string, projectIndex: number) => {
    updateResumeData({
      workExperience: resumeData.workExperience.map((exp) =>
        exp.id === expId
          ? { ...exp, projects: exp.projects.filter((_, idx) => idx !== projectIndex) }
          : exp
      ),
    });
  };

  const updateProject = (expId: string, projectIndex: number, value: string) => {
    updateResumeData({
      workExperience: resumeData.workExperience.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              projects: exp.projects.map((proj, idx) =>
                idx === projectIndex ? value : proj
              ),
            }
          : exp
      ),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Work Experience</h3>
        <div className="flex gap-2">
          <button
            onClick={() => toggleSectionVisibility('workExperience')}
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
          <button
            onClick={addWorkExperience}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Experience
          </button>
        </div>
      </div>

      {resumeData.workExperience.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No work experience added yet</p>
          <button
            onClick={addWorkExperience}
            className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {resumeData.workExperience.map((exp, index) => (
            <div key={exp.id} className="border border-gray-300 rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {exp.role || 'New Position'} {exp.company && `at ${exp.company}`}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {exp.startDate || 'Start'} - {exp.current ? 'Present' : exp.endDate || 'End'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeWorkExperience(exp.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                  {expandedIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {expandedIndex === index && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateWorkExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Company Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateWorkExperience(exp.id, 'role', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Job Title"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateWorkExperience(exp.id, 'startDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateWorkExperience(exp.id, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateWorkExperience(exp.id, 'current', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      I currently work here
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={exp.description || ''}
                      onChange={(e) => updateWorkExperience(exp.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Brief description of your role and responsibilities..."
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Projects
                      </label>
                      <button
                        onClick={() => addProject(exp.id)}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Plus size={16} />
                        Add Project
                      </button>
                    </div>

                    <div className="space-y-2">
                      {exp.projects.map((project, projIndex) => (
                        <div key={projIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={project}
                            onChange={(e) => updateProject(exp.id, projIndex, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe a key project or achievement..."
                          />
                          {exp.projects.length > 1 && (
                            <button
                              onClick={() => removeProject(exp.id, projIndex)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkExperienceForm;
