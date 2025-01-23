import React, { useState } from 'react';
import { auth, db } from './firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Signup = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileName, setProfileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save profile name to Firestore
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, { profileName });

      alert('Sign up successful. Please check your email for verification.');
      auth.currentUser.sendEmailVerification();
      onBack();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Profile Name"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <button className="back-btn" onClick={onBack}>
        Back
      </button>
    </div>
  );
};

export default Signup;
