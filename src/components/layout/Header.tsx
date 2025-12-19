import { useState } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import ProfileSelector from '../profile/ProfileSelector';
import ProfileModal from '../profile/ProfileModal';

const Header = () => {
  const { clearAllData, createNewProfile, duplicateCurrentProfile, renameCurrentProfile, currentProfileName } = useResume();
  const [modalMode, setModalMode] = useState<'create' | 'duplicate' | 'rename' | null>(null);

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all resume data? This action cannot be undone.')) {
      clearAllData();
      alert('All data has been cleared!');
    }
  };

  const handleModalSubmit = async (name: string) => {
    if (modalMode === 'create') {
      await createNewProfile(name);
    } else if (modalMode === 'duplicate') {
      await duplicateCurrentProfile(name);
    } else if (modalMode === 'rename') {
      await renameCurrentProfile(name);
    }
    setModalMode(null);
  };

  return (
    <>
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={32} />
              <h1 className="text-2xl font-bold">Resume Builder</h1>
            </div>

            <div className="flex items-center gap-3">
              <ProfileSelector
                onCreateProfile={() => setModalMode('create')}
                onDuplicateProfile={() => setModalMode('duplicate')}
                onRenameProfile={() => setModalMode('rename')}
              />
              <button
                onClick={handleClearData}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                title="Clear all data"
              >
                <Trash2 size={18} />
                Clear Data
              </button>
            </div>
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
        onSubmit={handleModalSubmit}
        mode={modalMode || 'create'}
        currentName={currentProfileName}
      />
    </>
  );
};

export default Header;
