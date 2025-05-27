import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userProfile = {
        id: user.uid,
        full_name: fullName,
        email,
        state,
        role,
        created_at: new Date().toISOString(),
      };

      await setDoc(doc(db, 'profiles', user.uid), userProfile);

      setRegistrationSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
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
              <input id="fullName" className="input" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="input-group">
              <label htmlFor="email" className="label">Email:</label>
              <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="label">Password:</label>
              <input id="password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="input-group">
              <label htmlFor="state" className="label">State:</label>
              <input id="state" className="input" type="text" value={state} onChange={(e) => setState(e.target.value)} required />
            </div>

            <div className="input-group">
              <label htmlFor="role" className="label">Role:</label>
              <select id="role" className="input" value={role} onChange={(e) => setRole(e.target.value)}>
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
            🎉 Registration successful! <p>Redirecting to login page in 3 seconds...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
