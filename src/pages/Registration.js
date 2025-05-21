// frontend/radio-station-app/src/pages/Registration.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Registration.css';

const Registration = () => {
  const [name, setName] = useState('');
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
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: name.trim(),
            state: state.trim(),
            role: role,
          },
        },
      });

      if (error) {
        console.error('Supabase error:', error.message);
        setError(error.message);
      } else {
        console.log('Registration successful:', data);
        setRegistrationSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
      setError('An unexpected error occurred. Please try again.');
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
              <label className="label" htmlFor="name">Name:</label>
              <input
                className="input"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="label" htmlFor="email">Email:</label>
              <input
                className="input"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="label" htmlFor="password">Password:</label>
              <input
                className="input"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="label" htmlFor="state">State:</label>
              <input
                className="input"
                type="text"
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="label" htmlFor="role">Role:</label>
              <select
                className="input"
                id="role"
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
            <p>Please check your email to verify your account.</p>
            <p>Redirecting to login page in 3 seconds...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
