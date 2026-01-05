import { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Download, FileText } from 'lucide-react';
import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import type { TemplateType } from '../../types/resume';
import { downloadPDF } from '../../utils/pdfExport';
import { downloadDOCX } from '../../utils/docxExport';
import type { ReactElement } from 'react';

const ResumePreview = () => {
  const { resumeData, selectedTemplate, setSelectedTemplate } = useResume();
  const [isExporting, setIsExporting] = useState(false);

  const templates: Record<TemplateType, { name: string; component: ReactElement }> = {
    modern: {
      name: 'Modern',
      component: <ModernTemplate data={resumeData} />,
    },
    classic: {
      name: 'Classic',
      component: <ClassicTemplate data={resumeData} />,
    },
    minimal: {
      name: 'Minimal',
      component: <MinimalTemplate data={resumeData} />,
    },
    creative: {
      name: 'Creative',
      component: <ModernTemplate data={resumeData} />,
    },
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const filename = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'resume'}_resume.pdf`;
      await downloadPDF(resumeData, filename);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDOCX = async () => {
    try {
      setIsExporting(true);
      const filename = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'resume'}_resume.docx`;
      await downloadDOCX(resumeData, filename);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      alert('Failed to export DOCX. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
          <button
            onClick={handleExportDOCX}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FileText size={20} />
            {isExporting ? 'Exporting...' : 'Export DOCX'}
          </button>
        </div>
      </div>

      {/* Template Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose Template
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(templates) as [TemplateType, typeof templates[TemplateType]][]).map(
            ([key, template]) => (
              <button
                key={key}
                onClick={() => setSelectedTemplate(key)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  selectedTemplate === key
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                {template.name}
              </button>
            )
          )}
        </div>
      </div>

      {/* Resume Preview */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-4 overflow-x-auto">
          <div className="flex justify-center">
            <div className="transform scale-75 origin-top">
              {templates[selectedTemplate].component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
