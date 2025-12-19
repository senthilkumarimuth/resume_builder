import { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { ChevronDown, Plus, Copy, Edit, Trash, Check } from 'lucide-react';

interface ProfileSelectorProps {
  onCreateProfile: () => void;
  onDuplicateProfile: () => void;
  onRenameProfile: () => void;
}

const ProfileSelector = ({ onCreateProfile, onDuplicateProfile, onRenameProfile }: ProfileSelectorProps) => {
  const { profiles, currentProfileId, currentProfileName, loadProfile, deleteCurrentProfile } = useResume();
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleProfileSelect = async (profileId: number) => {
    if (profileId !== currentProfileId) {
      await loadProfile(profileId);
      setIsOpen(false);
    }
  };

  const handleDelete = async () => {
    if (profiles.length <= 1) {
      alert('Cannot delete the last profile.');
      return;
    }
    await deleteCurrentProfile();
    setShowDeleteConfirm(false);
    setIsOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div className="relative">
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-700">{currentProfileName || 'Select Profile'}</span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {/* Profiles List */}
            <div className="max-h-64 overflow-y-auto p-2">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleProfileSelect(profile.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                    profile.id === currentProfileId ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{profile.name}</div>
                    <div className="text-xs text-gray-500">{formatDate(profile.updated_at)}</div>
                  </div>
                  {profile.id === currentProfileId && (
                    <Check size={16} className="text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Actions */}
            <div className="p-2 space-y-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onCreateProfile();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Plus size={16} />
                <span>Create New Profile</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onDuplicateProfile();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Copy size={16} />
                <span>Duplicate Current</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onRenameProfile();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Edit size={16} />
                <span>Rename Current</span>
              </button>

              {profiles.length > 1 && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash size={16} />
                  <span>Delete Current</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Profile?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{currentProfileName}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSelector;
