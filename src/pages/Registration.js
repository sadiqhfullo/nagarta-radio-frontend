// frontend/radio-station-app/src/pages/Registration.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Registration.css';

const Registration = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Sign up user with email and password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!signUpData.user) {
        setError('User data not returned from Supabase');
        setLoading(false);
        return;
      }

      const userId = signUpData.user.id;

      // Step 2: Insert additional profile info into 'profiles' table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: fullName,
          email: email.trim(),
          state,
          role,
          created_at: new Date().toISOString(),
        }, { onConflict: 'id' }); // upsert on id

      if (profileError) {
        setError('Profile update error: ' + profileError.message);
        setLoading(false);
        return;
      }

      // Step 3: Success
      setRegistrationSuccess(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      setError('Unexpected error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="form-container">
        <h2 className="heading">Register</h2>

        {!registrationSuccess ? (
          <form onSubmit={handleSignUp}>

            <div className="input-group">
              <label htmlFor="fullName" className="label">Full Name:</label>
              <input
                id="fullName"
                className="input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email" className="label">Email:</label>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="label">Password:</label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="state" className="label">State:</label>
              <input
                id="state"
                className="input"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="role" className="label">Role:</label>
              <select
                id="role"
                className="input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Signing up...' : 'Register'}
            </button>

            {error && <p className="error">⚠️ {error}</p>}

            <p className="link">
              Already have an account? <Link to="/login" style={{ color: '#fff' }}>Login</Link>
            </p>
          </form>
        ) : (
          <div className="success-message">
            🎉 Registration successful! 🎉
            <p>Redirecting to login page in 3 seconds...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
