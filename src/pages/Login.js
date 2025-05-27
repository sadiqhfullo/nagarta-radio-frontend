import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/Auth.css';
import { getUserRole } from '../utils/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Clear cached role on every login attempt
    localStorage.removeItem('userRole');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        const role = await getUserRole();

        console.log('Logged in user role:', role);

        if (!role) {
          setError('Unable to fetch user role. Please try again.');
          setLoading(false);
          return;
        }

        if (role.toLowerCase().trim() === 'admin') {
          navigate('/admin-dashboard');
        } else if (role.toLowerCase().trim() === 'staff') {
          navigate('/staff-dashboard');
        } else if (role.toLowerCase().trim() === 'user') {
          navigate('/home');
        } else {
          navigate('/unauthorized');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2 className="heading">Login</h2>
        <form onSubmit={handleSignIn}>
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

          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {error && <p className="error">{error}</p>}
        </form>

        <p className="link">
          Don&apos;t have an account? <a href="/register" className="link-text">Register</a>
        </p>
        <p className="forgot-password">
          <a href="/forgot-password" className="link-text">Forgot password?</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
