import type { ResumeData } from '../../types/resume';

interface TemplateProps {
  data: ResumeData;
}

const ClassicTemplate = ({ data }: TemplateProps) => {
  const formatDate = (date: string) => {
    if (!date) return '';
    const d = new Date(date + '-01');
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white p-8 shadow-lg" style={{ minHeight: '842px', width: '595px' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="text-sm text-gray-600">
          {[
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.location,
          ]
            .filter(Boolean)
            .join(' | ')}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website) && (
          <div className="text-sm text-gray-600 mt-1">
            {[data.personalInfo.linkedin, data.personalInfo.github, data.personalInfo.website]
              .filter(Boolean)
              .join(' | ')}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.sectionVisibility.summary && data.summary && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-400 mb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.sectionVisibility.skills && data.skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-400 mb-2">
            Skills
          </h2>
          <div className="space-y-1">
            {Object.entries(
              data.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.name);
                return acc;
              }, {} as Record<string, string[]>)
            ).map(([category, skills]) => (
              <div key={category} className="text-sm">
                <span className="font-semibold text-gray-800">{category}: </span>
                <span className="text-gray-600">{skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {data.sectionVisibility.workExperience && data.workExperience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-400 mb-2">
            Work Experience
          </h2>
          <div className="space-y-3">
            {data.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <span className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} -{' '}
                    {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="text-gray-700 italic mb-1">{exp.company}</p>
                {exp.description && (
                  <p className="text-gray-600 text-sm mb-2">{exp.description}</p>
                )}
                {exp.projects.filter((p) => p.trim()).length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                    {exp.projects
                      .filter((p) => p.trim())
                      .map((project, idx) => (
                        <li key={idx}>{project}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.sectionVisibility.education && data.education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-400 mb-2">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-gray-700 italic">{edu.institution}</p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personal Details */}
      {data.sectionVisibility.personalDetails &&
        (data.personalDetails.fatherName ||
          data.personalDetails.dateOfBirth ||
          data.personalDetails.gender ||
          data.personalDetails.maritalStatus ||
          data.personalDetails.languagesKnown ||
          data.personalDetails.nationality) && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-400 mb-2">
            Personal Details
          </h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {data.personalDetails.fatherName && (
              <div>
                <span className="font-semibold text-gray-800">Father's Name: </span>
                <span className="text-gray-600">{data.personalDetails.fatherName}</span>
              </div>
            )}
            {data.personalDetails.dateOfBirth && (
              <div>
                <span className="font-semibold text-gray-800">Date of Birth: </span>
                <span className="text-gray-600">
                  {new Date(data.personalDetails.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
            {data.personalDetails.gender && (
              <div>
                <span className="font-semibold text-gray-800">Gender: </span>
                <span className="text-gray-600">{data.personalDetails.gender}</span>
              </div>
            )}
            {data.personalDetails.maritalStatus && (
              <div>
                <span className="font-semibold text-gray-800">Marital Status: </span>
                <span className="text-gray-600">{data.personalDetails.maritalStatus}</span>
              </div>
            )}
            {data.personalDetails.languagesKnown && (
              <div>
                <span className="font-semibold text-gray-800">Languages: </span>
                <span className="text-gray-600">{data.personalDetails.languagesKnown}</span>
              </div>
            )}
            {data.personalDetails.nationality && (
              <div>
                <span className="font-semibold text-gray-800">Nationality: </span>
                <span className="text-gray-600">{data.personalDetails.nationality}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;
