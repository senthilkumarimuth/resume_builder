import PersonalInfoForm from '../components/forms/PersonalInfoForm';
import SummaryForm from '../components/forms/SummaryForm';
import WorkExperienceForm from '../components/forms/WorkExperienceForm';
import EducationForm from '../components/forms/EducationForm';
import SkillsForm from '../components/forms/SkillsForm';
import PersonalDetailsForm from '../components/forms/PersonalDetailsForm';
import ResumePreview from '../components/preview/ResumePreview';

const Builder = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <PersonalInfoForm />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <SummaryForm />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <SkillsForm />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <WorkExperienceForm />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <EducationForm />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <PersonalDetailsForm />
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-lg shadow-md p-6">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
