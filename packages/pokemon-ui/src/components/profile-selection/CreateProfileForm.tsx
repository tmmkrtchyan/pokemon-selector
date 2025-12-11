import { useState, FormEvent } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_PROFILE } from '../../lib/graphql/queries';
import { GET_PROFILES } from '../../lib/graphql/queries';
import { ProfileType } from '../../types/profile.types';
import './CreateProfileForm.css';

interface CreateProfileFormProps {
  onProfileCreated: (profile: ProfileType) => void;
}

export function CreateProfileForm({ onProfileCreated }: CreateProfileFormProps) {
  const [name, setName] = useState('');
  const [createProfile, { loading, error }] = useMutation<{ createProfile: ProfileType }>(CREATE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILES }],
    onCompleted: (data) => {
      setName('');
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createProfile({ variables: { name: name.trim() } });
    } catch (err) {
    }
  };

  return (
    <div className="create-profile-form-container">
      <h3 className="create-profile-form-title">Create New Profile</h3>
      <form className="create-profile-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="create-profile-input"
          placeholder="Enter profile name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        {error && (
          <div className="create-profile-error">
            {error.message || 'Failed to create profile. Please try again.'}
          </div>
        )}
        <button
          type="submit"
          className="create-profile-button"
          disabled={loading || !name.trim()}
        >
          {loading ? 'Creating...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
}

