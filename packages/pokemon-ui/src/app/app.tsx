import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { ProfileSelection } from '../components/profile-selection/ProfileSelection';
import { PokemonManager } from '../components/pokemon-table/PokemonManager';
import { GET_PROFILE } from '../lib/graphql/queries';
import { ProfileType } from '../types/profile.types';
import './app.css';

const PROFILE_STORAGE_KEY = 'pokemon-selected-profile';

export function App() {
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(() => {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const { error } = useQuery<{ getProfile: ProfileType }>(GET_PROFILE, {
    variables: { id: selectedProfile?.id || '' },
    skip: !selectedProfile,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (error && selectedProfile) {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      setSelectedProfile(null);
    }
  }, [error, selectedProfile]);

  const handleSelectProfile = (profile: ProfileType) => {
    setSelectedProfile(profile);

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  };

  const handleBackToProfileSelection = () => {
    setSelectedProfile(null);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  };

  if (!selectedProfile) {
    return <ProfileSelection onSelectProfile={handleSelectProfile} />;
  }

  return (
    <div className="app-container">
      <button className="back-button" onClick={handleBackToProfileSelection}>
        ← Back to Profile Selection
      </button>
      <div className="app-content">
        <h1 className="app-welcome-title">Welcome, {selectedProfile.name}!</h1>
        <PokemonManager profileId={selectedProfile.id} />
      </div>
    </div>
  );
}

export default App;
