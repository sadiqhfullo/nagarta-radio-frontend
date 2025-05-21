// frontend/radio-station-app/src/pages/PhoneVerification.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/Auth.css';

const PhoneVerification = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter OTP
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({ phone });

    if (error) {
      setError(error.message);
    } else {
      setMessage('OTP sent to your phone.');
      setStep(2);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Phone number verified successfully.');
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2 className="heading">Phone Verification</h2>
        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="input-group">
              <label className="label" htmlFor="phone">Phone Number:</label>
              <input
                className="input"
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button className="button" type="submit">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="input-group">
              <label className="label" htmlFor="otp">Enter OTP:</label>
              <input
                className="input"
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button className="button" type="submit">Verify OTP</button>
          </form>
        )}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default PhoneVerification;
