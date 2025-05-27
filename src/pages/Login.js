import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/Auth.css';

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

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const profileRef = doc(db, 'profiles', uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        const role = profileSnap.data().role?.toLowerCase() ?? 'user';

        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'staff') {
          navigate('/staff-dashboard');
        } else {
          navigate('/home');
        }
      } else {
        setError('Profile not found');
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
            <input className="input" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label className="label" htmlFor="password">Password:</label>
            <input className="input" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
