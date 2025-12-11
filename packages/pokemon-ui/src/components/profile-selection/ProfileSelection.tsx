import { useQuery } from '@apollo/client/react';
import { GET_PROFILES } from '../../lib/graphql/queries';
import { ProfileType } from '../../types/profile.types';
import { ProfileList } from './ProfileList';
import { CreateProfileForm } from './CreateProfileForm';
import './ProfileSelection.css';

interface ProfileSelectionProps {
  onSelectProfile: (profile: ProfileType) => void;
}

export function ProfileSelection({ onSelectProfile }: ProfileSelectionProps) {
  const { data, loading, error } = useQuery<{ getProfiles: ProfileType[] }>(GET_PROFILES);

  if (loading) {
    return (
      <div className="profile-selection-container">
        <div className="profile-selection-loading">Loading profiles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-selection-container">
        <div className="profile-selection-error">
          Error loading profiles: {error.message}
        </div>
      </div>
    );
  }

  const profiles = data?.getProfiles || [];

  return (
    <div className="profile-selection-container">
      <div className="profile-selection-content">
        <div className="profile-selection-header">
          <h1 className="profile-selection-title">Pokémon selector</h1>
          <p className="profile-selection-subtitle">Select or create a profile to add Pokémons into your team</p>
        </div>

        <div className="profile-selection-section">
          <h2 className="profile-selection-section-title">Select Profile</h2>
          <ProfileList
            profiles={profiles}
            onSelectProfile={onSelectProfile}
          />
        </div>

        <div className="profile-selection-section">
          <CreateProfileForm onProfileCreated={() => {}} />
        </div>
      </div>
    </div>
  );
}

