import { ProfileType } from '../../types/profile.types';
import './ProfileList.css';

interface ProfileListProps {
  profiles: ProfileType[];
  onSelectProfile: (profile: ProfileType) => void;
}

export function ProfileList({ profiles, onSelectProfile }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="profile-list-container">
        <div className="profile-list-empty">No profiles found. Create one to get started!</div>
      </div>
    );
  }

  return (
    <div className="profile-list-container">
      {profiles.map((profile) => (
        <button
          key={profile.id}
          className="profile-card"
          onClick={() => onSelectProfile(profile)}
        >
          {profile.name}
        </button>
      ))}
    </div>
  );
}

