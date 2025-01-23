import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase-config';

const Login = ({ onLoginSuccess, onBack, googleOnly, phoneOnly, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setMessage("Your email is not verified. A verification email has been sent.");
        await sendEmailVerification(user);
        return;
      }

      onLoginSuccess(user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      onLoginSuccess(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => console.log('Recaptcha verified'),
        },
        auth
      );
    }
  };

  const sendOtp = async () => {
    try {
      setupRecaptcha();
      const verifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
      setVerificationId(confirmationResult.verificationId);
    } catch (err) {
      setError(err.message);
    }
  };

  const verifyOtp = async () => {
    try {
      if (!verificationId) throw new Error('No verification ID available');
      const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await auth.signInWithCredential(credential);
      onLoginSuccess(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-card">
      {googleOnly ? (
        <>
          <h2>Sign in with Google</h2>
          <button onClick={handleGoogleLogin}>Sign in with Google</button>
        </>
      ) : phoneOnly ? (
        <>
          <h2>Phone Authentication</h2>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
          />
          <button onClick={sendOtp}>Send OTP</button>
          <div id="recaptcha-container"></div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      ) : (
        <>
          <h2>Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleLogin}>Login</button>
          <p className="forgot-password" onClick={onForgotPassword}>
            Forgot Password?
          </p>
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <button className="back-btn" onClick={onBack}>Back</button>
    </div>
  );
};

export default Login;
