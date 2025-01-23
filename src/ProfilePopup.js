import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase-config';

const ProfilePopup = ({ user, onSaveProfile }) => {
  const [profileName, setProfileName] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!profileName.trim()) {
      setError('Profile name cannot be empty.');
      return;
    }

    try {
      // Save profile name to Firestore
      const userDoc = doc(db, 'users', user.uid); // Reference user document
      await setDoc(userDoc, { profileName }, { merge: true }); // Merge with existing data
      onSaveProfile(profileName); // Notify parent about saved name
    } catch (err) {
      console.error('Error saving profile name:', err);
      setError('Failed to save profile name. Please try again.');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h2>Welcome!</h2>
        <p>Tell us your profile name:</p>
        <input
          type="text"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          placeholder="Enter your profile name"
        />
        <button onClick={handleSave}>Save</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default ProfilePopup;
