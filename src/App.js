import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import Signup from './Signup';
import ProfilePopup from './ProfilePopup';
import ResetPassword from './ResetPassword';
import { auth } from './firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import InputArea from './InputArea';
import ThreeScene from './ThreeScene'; // Import Three.js Scene Component

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [profileName, setProfileName] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      if (loggedInUser) {
        if (loggedInUser.emailVerified) {
          setUser(loggedInUser);
        } else {
          alert('Please verify your email before logging in.');
          auth.signOut();
        }
      } else {
        setUser(null);
        setAuthMode(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch profile name on login or reload
  useEffect(() => {
    const fetchProfileName = async () => {
      if (user) {
        try {
          const userDoc = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDoc);

          if (docSnap.exists() && docSnap.data().profileName) {
            setProfileName(docSnap.data().profileName);
          } else {
            setShowPopup(true);
          }
        } catch (err) {
          console.error('Error fetching profile name:', err);
          setShowPopup(true);
        }
      }
    };

    fetchProfileName();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAuthMode(null);
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const fetchImage = async () => {
    if (!prompt.trim()) {
      setErrorMessage('Prompt is required and cannot be empty.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setGeneratedImage(null);

    try {
      const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_HUGGINGFACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      });
      

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setGeneratedImage(url);
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ThreeScene /> {/* Render Three.js background */}
      <div className="app-container">
        {user && !showPopup ? (
          <>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
            <div className="card">
              <h1 className="title">Welcome, {profileName || user.email.split('@')[0]}!</h1>
              <InputArea
                prompt={prompt}
                setPrompt={setPrompt}
                fetchImage={fetchImage}
                loading={loading}
                errorMessage={errorMessage}
              />
              {loading && (
                <div className="loading-message">
                  <div className="spinner"></div>
                  <p>Please wait while the image is being generated. Do not reload the page.</p>
                </div>
              )}
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              {generatedImage && (
                <div className="generated-image">
                  <img src={generatedImage} alt={`Generated from prompt: ${prompt}`} />
                  <button
                    className="download-btn"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = generatedImage;
                      link.download = 'generated_image.png';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Download Image
                  </button>
                </div>
              )}
            </div>
          </>
        ) : showPopup ? (
          <ProfilePopup
            user={user}
            onSaveProfile={(name) => {
              setProfileName(name);
              setShowPopup(false);
            }}
          />
        ) : !authMode ? (
          <div className="landing-container">
            <div className="card">
              <h1 className="title">Welcome to AI Image Generator</h1>
              <p>Please select your preferred authentication mode:</p>
              <button className="auth-btn" onClick={() => setAuthMode('email')}>
                Login with Email
              </button>
              <button className="auth-btn" onClick={() => setAuthMode('google')}>
                Login with Google
              </button>
              <button className="auth-btn" onClick={() => setAuthMode('signup')}>
                Sign Up
              </button>
            </div>
          </div>
        ) : authMode === 'email' ? (
          <Login
            onLoginSuccess={setUser}
            onBack={() => setAuthMode(null)}
            onForgotPassword={() => setAuthMode('reset-password')}
          />
        ) : authMode === 'reset-password' ? (
          <ResetPassword onBack={() => setAuthMode('email')} />
        ) : authMode === 'google' ? (
          <Login onLoginSuccess={setUser} googleOnly onBack={() => setAuthMode(null)} />
        ) : authMode === 'phone' ? (
          <Login onLoginSuccess={setUser} phoneOnly onBack={() => setAuthMode(null)} />
        ) : authMode === 'signup' ? (
          <Signup onBack={() => setAuthMode(null)} />
        ) : null}
      </div>
    </>
  );
}

export default App;
