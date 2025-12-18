import type { ResumeData } from '../../types/resume';

interface TemplateProps {
  data: ResumeData;
}

const MinimalTemplate = ({ data }: TemplateProps) => {
  const formatDate = (date: string) => {
    if (!date) return '';
    const d = new Date(date + '-01');
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white p-8 shadow-lg" style={{ minHeight: '842px', width: '595px' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-light text-gray-900 mb-3">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>•</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>•</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website) && (
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
            {data.personalInfo.linkedin && (
              <span className="truncate max-w-[250px]">{data.personalInfo.linkedin}</span>
            )}
            {data.personalInfo.linkedin && (data.personalInfo.github || data.personalInfo.website) && <span>•</span>}
            {data.personalInfo.github && (
              <span className="truncate max-w-[250px]">{data.personalInfo.github}</span>
            )}
            {data.personalInfo.github && data.personalInfo.website && <span>•</span>}
            {data.personalInfo.website && (
              <span className="truncate max-w-[250px]">{data.personalInfo.website}</span>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.sectionVisibility.summary && data.summary && (
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.sectionVisibility.skills && data.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Skills
          </h2>
          <div className="space-y-2">
            {Object.entries(
              data.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.name);
                return acc;
              }, {} as Record<string, string[]>)
            ).map(([category, skills]) => (
              <div key={category} className="text-sm">
                <span className="font-medium text-gray-700">{category}:</span>{' '}
                <span className="text-gray-600">{skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {data.sectionVisibility.workExperience && data.workExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Experience
          </h2>
          <div className="space-y-5">
            {data.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="mb-1">
                  <h3 className="font-semibold text-gray-900 inline">{exp.role}</h3>
                  <span className="text-gray-600"> — {exp.company}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {formatDate(exp.startDate)} -{' '}
                  {exp.current ? 'Present' : formatDate(exp.endDate)}
                </p>
                {exp.description && (
                  <p className="text-gray-600 text-sm mb-2">{exp.description}</p>
                )}
                {exp.projects.filter((p) => p.trim()).length > 0 && (
                  <ul className="space-y-1">
                    {exp.projects
                      .filter((p) => p.trim())
                      .map((project, idx) => (
                        <li key={idx} className="text-sm text-gray-600 pl-4 relative before:content-['—'] before:absolute before:left-0">
                          {project}
                        </li>
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
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="mb-1">
                  <h3 className="font-semibold text-gray-900 inline">
                    {edu.degree} in {edu.field}
                  </h3>
                </div>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
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
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Personal Details
          </h2>
          <div className="space-y-1 text-sm">
            {data.personalDetails.fatherName && (
              <div>
                <span className="font-medium text-gray-700">Father's Name:</span>{' '}
                <span className="text-gray-600">{data.personalDetails.fatherName}</span>
              </div>
            )}
            {data.personalDetails.dateOfBirth && (
              <div>
                <span className="font-medium text-gray-700">Date of Birth:</span>{' '}
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
                <span className="font-medium text-gray-700">Gender:</span>{' '}
                <span className="text-gray-600">{data.personalDetails.gender}</span>
              </div>
            )}
            {data.personalDetails.maritalStatus && (
              <div>
                <span className="font-medium text-gray-700">Marital Status:</span>{' '}
                <span className="text-gray-600">{data.personalDetails.maritalStatus}</span>
              </div>
            )}
            {data.personalDetails.languagesKnown && (
              <div>
                <span className="font-medium text-gray-700">Languages:</span>{' '}
                <span className="text-gray-600">{data.personalDetails.languagesKnown}</span>
              </div>
            )}
            {data.personalDetails.nationality && (
              <div>
                <span className="font-medium text-gray-700">Nationality:</span>{' '}
                <span className="text-gray-600">{data.personalDetails.nationality}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
