import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import type { Certification } from '../../types/resume';

const CertificationsForm = () => {
  const { resumeData, updateResumeData, toggleSectionVisibility } = useResume();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const isVisible = resumeData.sectionVisibility.certifications;

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      url: '',
    };
    updateResumeData({
      certifications: [...resumeData.certifications, newCert],
    });
    setExpandedIndex(resumeData.certifications.length);
  };

  const removeCertification = (id: string) => {
    updateResumeData({
      certifications: resumeData.certifications.filter((cert) => cert.id !== id),
    });
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    updateResumeData({
      certifications: resumeData.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Certifications</h3>
        <div className="flex gap-2">
          <button
            onClick={() => toggleSectionVisibility('certifications')}
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
            onClick={addCertification}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Certification
          </button>
        </div>
      </div>

      {resumeData.certifications.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No certifications added yet</p>
          <button
            onClick={addCertification}
            className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first certification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {resumeData.certifications.map((cert, index) => (
            <div key={cert.id} className="border border-gray-300 rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {cert.name || 'New Certification'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {cert.issuer || 'Issuer'}
                    {cert.date && ` • ${cert.date}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCertification(cert.id);
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. AWS Certified Solutions Architect"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issuer <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Amazon Web Services"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="month"
                      value={cert.date}
                      onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credential URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={cert.url || ''}
                      onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://..."
                    />
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

export default CertificationsForm;
