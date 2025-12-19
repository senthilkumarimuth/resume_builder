import type { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

const ModernTemplate = ({ data }: TemplateProps) => {
  const formatDate = (date: string) => {
    if (!date) return '';
    const d = new Date(date + '-01');
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white p-8 shadow-lg" style={{ minHeight: '842px', width: '595px' }}>
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={16} className="text-blue-600" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={16} className="text-blue-600" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={16} className="text-blue-600" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin size={16} className="text-blue-700 fill-blue-700" />
              <span className="truncate max-w-[200px]">{data.personalInfo.linkedin}</span>
            </div>
          )}
          {data.personalInfo.github && (
            <div className="flex items-center gap-1.5">
              <Github size={16} className="text-gray-800 fill-gray-800" />
              <span className="truncate max-w-[200px]">{data.personalInfo.github}</span>
            </div>
          )}
          {data.personalInfo.website && (
            <div className="flex items-center gap-1.5">
              <Globe size={16} className="text-blue-600" />
              <span className="truncate max-w-[200px]">{data.personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.sectionVisibility.summary && data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-2">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.sectionVisibility.skills && data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3">Skills</h2>
          <div className="space-y-2">
            {Object.entries(
              data.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.name);
                return acc;
              }, {} as Record<string, string[]>)
            ).map(([category, skills]) => (
              <div key={category}>
                <span className="font-semibold text-gray-800">{category}: </span>
                <span className="text-gray-600">{skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {data.sectionVisibility.workExperience && data.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3">Work Experience</h2>
          <div className="space-y-4">
            {data.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.role}</h3>
                    <p className="text-gray-700">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-600 text-right">
                    <p>
                      {formatDate(exp.startDate)} -{' '}
                      {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </p>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-600 text-sm mb-2">{exp.description}</p>
                )}
                {exp.projects.filter((p) => p.trim()).length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-sm text-gray-600 space-y-1">
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
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-gray-700">{edu.institution}</p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 text-right">
                    <p>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                  </div>
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
        <div className="mb-6 border-t-2 border-gray-200 pt-4">
          <h2 className="text-xl font-bold text-blue-600 mb-3">Personal Details</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
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

export default ModernTemplate;
