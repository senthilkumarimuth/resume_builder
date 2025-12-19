import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  mode: 'create' | 'duplicate' | 'rename';
  currentName?: string;
}

const ProfileModal = ({ isOpen, onClose, onSubmit, mode, currentName = '' }: ProfileModalProps) => {
  const [profileName, setProfileName] = useState(currentName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setProfileName(mode === 'rename' ? currentName : '');
      setError('');
    }
  }, [isOpen, mode, currentName]);

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create New Profile';
      case 'duplicate':
        return 'Duplicate Profile';
      case 'rename':
        return 'Rename Profile';
    }
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) return 'Processing...';
    switch (mode) {
      case 'create':
        return 'Create';
      case 'duplicate':
        return 'Duplicate';
      case 'rename':
        return 'Rename';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = profileName.trim();

    if (!trimmedName) {
      setError('Profile name is required');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Profile name must be at least 2 characters');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Profile name must be less than 50 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(trimmedName);
      onClose();
    } catch (err) {
      setError('Failed to process. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="profileName" className="block text-sm font-medium text-gray-700 mb-2">
              Profile Name
            </label>
            <input
              id="profileName"
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="e.g., Senior Engineer, Manager Role"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {mode === 'create' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                A new empty profile will be created. You can add your information after creation.
              </p>
            </div>
          )}

          {mode === 'duplicate' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                All data from the current profile will be copied to the new profile. You can then modify it as needed.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {getSubmitButtonText()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
