import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import type { Skill } from '../../types/resume';

const SkillsForm = () => {
  const { resumeData, updateResumeData, toggleSectionVisibility } = useResume();
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Programming Languages');

  const categories = ['Programming Languages', 'Frameworks & Libraries', 'Tools', 'AIML Models', 'Soft Skills', 'Languages', 'Other'];
  const isVisible = resumeData.sectionVisibility.skills;

  const addSkill = () => {
    if (!newSkillName.trim()) return;

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      category: newSkillCategory,
    };

    updateResumeData({
      skills: [...resumeData.skills, newSkill],
    });

    setNewSkillName('');
  };

  const removeSkill = (id: string) => {
    updateResumeData({
      skills: resumeData.skills.filter((skill) => skill.id !== id),
    });
  };

  const groupedSkills = resumeData.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
        <button
          onClick={() => toggleSectionVisibility('skills')}
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

      <div className="flex gap-2">
        <input
          type="text"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter a skill (e.g., React, JavaScript, Communication)"
        />
        <select
          value={newSkillCategory}
          onChange={(e) => setNewSkillCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          onClick={addSkill}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add
        </button>
      </div>

      {resumeData.skills.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No skills added yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="border border-gray-300 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >
                    <span className="text-sm">{skill.name}</span>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsForm;
